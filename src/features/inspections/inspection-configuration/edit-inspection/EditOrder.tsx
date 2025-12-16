"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { z } from "zod";
import {
  useForm,
  UseFormRegister,
  FieldErrors,
  UseFormTrigger,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormChassi from "../types-pdf/FormChassiEdit/FormChassi";
import { debounce } from "lodash";
import type { DebouncedFunc } from "lodash";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { CustomerOption } from "@/shared/utils/orderMapper";
import {
  ExportedAnswer,
  ExportedQuestion,
} from "@/shared/types/inspection/ITypes";
import Loading from "@/shared/components/shared/Loading";
import AlertInfo from "@/shared/components/shared/AlertInfo";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { InspectionStatusLabel } from "../models/typeInspection";
import { MdEdit } from "react-icons/md";
import { useTranslations } from "next-intl";
import { formatApiErrorForToast } from "@/shared/utils/errors";

// --------- Estados backend ----------
const STATUS_ACTIVE = 0 as const;
const STATUS_DELETED = 1 as const;

// ---------- Tipos de API ----------
interface TemplateItem {
  templateInspectionId: number;
  name: string;
}
interface TemplateRes {
  items: TemplateItem[];
}

interface BackendAnswerObject {
  typeInspectionDetailAnswerId?: number;
  id?: number;
  response?: string;
  color?: string;
  usingItem?: boolean;
  isPrintable?: boolean;
  subTypeInspectionDetailAnswers?: BackendAnswer[];
}
type BackendAnswer = string | BackendAnswerObject;

interface TypeInspectionQuestionFromApi {
  typeInspectionDetailId?: number;
  templateInspectionQuestionId: number;
  question: string;
  typeQuestion: number | string;
  groupId: number;
  status: number | string;
  typeInspectionDetailAnswers?: BackendAnswer[];
}

interface TypeInspectionGetResponse {
  customerName: string;
  status: number | string;
  name: string;
  templateInspectionId: number | string;
  description?: string;
  customerId: number | string;
  typeInspectionQuestions: TypeInspectionQuestionFromApi[];
}

interface CustomerIdRes {
  name?: string;
}

// ---------- HELPERS ----------
const safeNumber = (val: unknown, fallback = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

const dedupeAnswers = (answers: ExportedAnswer[]): ExportedAnswer[] => {
  const seen = new Set<string>();
  const out: ExportedAnswer[] = [];
  for (const a of answers ?? []) {
    const key =
      `${(a.response || "").trim()}|${a.color || ""}|` +
      `${a.usingItem ? 1 : 0}|${a.isPrintable ? 1 : 0}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({
        ...a,
        subTypeInspectionDetailAnswers: dedupeAnswers(
          a.subTypeInspectionDetailAnswers ?? []
        ),
      });
    }
  }
  return out;
};

// mapea backend->front (respuestas)
const mapAnswerFromApi = (a: BackendAnswer): ExportedAnswer => {
  if (typeof a === "string") {
    return {
      id: undefined,
      response: a,
      color: "",
      usingItem: false,
      isPrintable: true,
      subTypeInspectionDetailAnswers: [],
    };
  }
  return {
    id:
      a.typeInspectionDetailAnswerId != null
        ? safeNumber(a.typeInspectionDetailAnswerId, 0)
        : a.id != null
          ? safeNumber(a.id, 0)
          : undefined,
    response: a.response ?? "",
    color: a.color ?? "",
    usingItem: !!a.usingItem,
    isPrintable: a.isPrintable ?? true,
    subTypeInspectionDetailAnswers: Array.isArray(
      a.subTypeInspectionDetailAnswers
    )
      ? a.subTypeInspectionDetailAnswers.map(mapAnswerFromApi)
      : [],
  };
};

// 👉 ExportedAnswer[] -> API Answer[] (RECURSIVO)
type ApiAnswer = {
  typeInspectionDetailAnswerId: number | null; // 0 o id existente o null
  response: string;
  color: string;
  usingItem: boolean;
  isPrintable: boolean;
  subTypeInspectionDetailAnswers: ApiAnswer[];
};

const toApiAnswers = (answers: ExportedAnswer[] = []): ApiAnswer[] =>
  (answers ?? []).map((ans) => {
    let idOut: number | null = null;
    if (ans?.id === 0)
      idOut = 0; // duplicado => 0
    else if (typeof ans?.id === "number" && ans.id > 0)
      idOut = ans.id; // existente
    else idOut = null; // nuevo creado desde cero

    return {
      typeInspectionDetailAnswerId: idOut,
      response: ans?.response ?? "",
      color: ans?.color ?? "",
      usingItem: !!ans?.usingItem,
      isPrintable: ans?.isPrintable ?? true,
      subTypeInspectionDetailAnswers: toApiAnswers(
        ans?.subTypeInspectionDetailAnswers ?? []
      ),
    };
  });

// Convierte preguntas al shape EXACTO del backend
const toApiQuestionsRaw = (qs: ExportedQuestion[]) =>
  (qs ?? []).map((q) => ({
    // si viene 0 (duplicado) lo respetamos; si viene undefined => null
    typeInspectionDetailId:
      q.typeInspectionDetailId === 0
        ? 0
        : q.typeInspectionDetailId != null
          ? q.typeInspectionDetailId
          : null,
    templateInspectionQuestionId: safeNumber(q.templateInspectionQuestionId, 0),
    groupId: safeNumber(q.groupId, 0),
    question: q.question ?? "",
    typeQuestion: safeNumber(q.typeQuestion, 0),
    status: q.status === STATUS_DELETED ? STATUS_DELETED : STATUS_ACTIVE,
    typeInspectionDetailAnswers: toApiAnswers(q.typeInspectionDetailAnswers),
  }));

// -----------------------------------------------------

interface EditOrderProps {
  changeTitle?: (newTitle: string) => void;
  isLoadingStatus?: () => void;
}

const baseSchema = z.object({
  client: z.string().min(1, "Client is required"),
  status: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  theme: z.string().min(1, "Template is required"),
  description: z.string().optional(),
});

type FormFields = z.infer<typeof baseSchema>;

const EditOrder = ({ changeTitle }: EditOrderProps) => {
  const { id } = useParams<{ id: string }>();
  const initialQuestionsRef = useRef<ExportedQuestion[] | null>(null);
  const latestQuestionsRef = useRef<ExportedQuestion[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [templates, setTemplates] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>("");

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);

  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [hasAtLeastOneQuestion, setHasAtLeastOneQuestion] = useState(false);
  const inputCustomerRef = useRef<HTMLInputElement>(null);

  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  const tToasts = useTranslations("toast");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormFields>({
    resolver: zodResolver(baseSchema),
    mode: "onChange",
    defaultValues: {
      client: "",
      status: "",
      name: "",
      theme: "",
      description: "",
    },
  });

  const [objFilterForm, setObjFilterForm] = useState<{
    client: string;
    status: string;
    workorder: string;
    worker: string;
    creationdate?: Date;
  }>({
    client: "",
    status: "",
    workorder: "",
    worker: "",
    creationdate: undefined,
  });

  // Handle Customer Input
  const searchCustomer = async (name?: string) => {
    try {
      let url = `/QuickBooks/Customers/GetCustomerName?RealmId=9341454759827689`;
      if (name) url += `&Name=${encodeURIComponent(name)}`;
      const response = await axiosInstance.get<CustomerOption[]>(url);
      setCustomerOptions(response.data ?? []);
    } catch (error) {
      //console.error("Error buscando clientes:", error);
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setIsLoadingCustomer(false);
    }
  };

  const debouncedSearchCustomer: DebouncedFunc<(value: string) => void> =
    useRef(
      debounce((value: string) => {
        if (value.length >= 3) {
          searchCustomer(value);
        } else {
          setCustomerOptions([]);
        }
      }, 500)
    ).current;

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setShowCustomerDropdown(true);
    debouncedSearchCustomer(value);

    if (value.length >= 1) {
      setIsLoadingCustomer(true);
    } else {
      setIsLoadingCustomer(false);
    }

    setObjFilterForm((prev) => ({ ...prev, client: value }));
  };

  const currentTheme = watch("theme");
  const currentTemplateId = watch("theme");

  const getCustomerName = async (customerId: string) => {
    if (!customerId) return "";
    const res = await axiosInstance.get<CustomerIdRes>(
      `/QuickBooks/Customers/GetCustomerId?CustomerId=${customerId}&RealmId=9341454759827689`
    );
    return res.data?.name ?? "";
  };

  useEffect(() => {
    trigger();
  }, [currentTheme, trigger]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [templateRes, inspectionRes] = await Promise.all([
          axiosInstance.get<TemplateRes>("/TemplateInspection"),
          axiosInstance.get<TypeInspectionGetResponse>(
            `/TypeInspection/GetTypeInspectionId?TypeInspectionId=${id}`
          ),
        ]);

        const items = templateRes.data.items;
        setTemplates(
          items.map((t) => ({
            id: t.templateInspectionId,
            name: t.name,
          }))
        );

        const data = inspectionRes.data;

        setValue("client", data.customerName);
        setValue("status", String(data.status));
        setValue("name", data.name);
        setValue("theme", String(data.templateInspectionId));
        setValue("description", data.description ?? "");

        const customerName = await getCustomerName(String(data.customerId));

        setSelectedCustomer({
          id: Number(data.customerId),
          name: customerName,
        });

        setObjFilterForm((prev) => ({
          ...prev,
          client: customerName,
        }));

        setValue("client", customerName);

        // ---------- Mapeo preguntas desde API ----------
        const mappedQuestions: ExportedQuestion[] = (
          data.typeInspectionQuestions ?? []
        ).map((q) => ({
          typeInspectionDetailId: q.typeInspectionDetailId ?? 0,
          templateInspectionQuestionId: q.templateInspectionQuestionId,
          question: q.question,
          typeQuestion: safeNumber(q.typeQuestion, 0),
          groupId: q.groupId,
          status:
            safeNumber(q.status, STATUS_ACTIVE) === STATUS_DELETED
              ? STATUS_DELETED
              : STATUS_ACTIVE,
          typeInspectionDetailAnswers: dedupeAnswers(
            (q.typeInspectionDetailAnswers ?? []).map(mapAnswerFromApi)
          ),
        }));

        if (!initialQuestionsRef.current) {
          initialQuestionsRef.current = mappedQuestions;
          latestQuestionsRef.current = mappedQuestions; // seed ref
          setHasAtLeastOneQuestion(
            mappedQuestions.some((qq) => qq.status !== STATUS_DELETED)
          );
        } else {
          setHasAtLeastOneQuestion(
            (latestQuestionsRef.current ?? []).some(
              (qq) => qq.status !== STATUS_DELETED
            )
          );
        }
      } catch (err) {
        console.error("Error al cargar datos iniciales", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id, setValue]);

  useEffect(() => {
    const selected = templates.find((t) => String(t.id) === currentTemplateId);
    setSelectedTemplateName(selected?.name ?? "");
  }, [currentTemplateId, templates]);

  const inputClass = (hasError: boolean) =>
    `flex-1 input input-lg bg-[#f6f3f4] w-full text-center font-bold text-3xl transition-all border-1 text-lg font-normal ${
      hasError ? "border-red-500" : "border-gray-100"
    }`;
  const labelClass = () => `font-medium w-[30%] break-words`;

  const onSubmit = async (data: FormFields) => {
    if (!hasAtLeastOneQuestion) {
      alert("Debe agregar al menos una pregunta con respuestas");
      return;
    }

    const currentQuestions = latestQuestionsRef.current;

    // Filtra nuevos que ya fueron marcados como eliminados
    const cleanedQuestions = currentQuestions.filter((q) => {
      const isNew = !q.typeInspectionDetailId || q.typeInspectionDetailId === 0;
      const isDeleted = q.status === STATUS_DELETED;
      if (isNew && isDeleted) return false;
      return true;
    });

    const details = toApiQuestionsRaw(cleanedQuestions);

    const payload = {
      command: "Update" as const,
      typeInspectionId: Number(id),
      templateInspectionId: Number(currentTemplateId),
      customerId: String(selectedCustomer?.id ?? ""),
      customerName: data.client,
      name: data.name,
      description: data.description,
      status: Number(data.status) || STATUS_ACTIVE,
      typeInspectionQuestions: details,
    };

    try {
      await axiosInstance.put(`/TypeInspection/${id}`, payload);
      toast.success(`${tToasts("ok")}: ${tToasts("msj.33")}`);
      router.push("../");
    } catch (error) {
      /*toast.error(`${tToasts("error")}: ${error}`);
      console.error(error);*/
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    }
  };

  // --- handlers memoizados ---
  const handleQuestionsChange = useCallback((hasQuestions: boolean) => {
    setHasAtLeastOneQuestion(hasQuestions);
  }, []);

  const handleQuestionsExport = useCallback((updated: ExportedQuestion[]) => {
    latestQuestionsRef.current = updated;
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <AlertInfo>
        All the grey spaces are editable, meaning you can write on them and add
        the required data.
      </AlertInfo>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-box border-[#00000014] border-1 mb-6 p-3 gap-0 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5  p-2 mb-0 rounded-md">
            <div className="flex flex-row gap-2 items-center justify-center col-span-1">
              <span className="font-medium w-[30%] break-words">Client</span>

              {selectedCustomer ? (
                <div className="flex flex-1 items-center gap-2">
                  <span className="truncate w-0 flex-1 px-2">
                    {selectedCustomer.name}
                  </span>
                  <button
                    type="button"
                    className="btn p-2 btn-xs bg-transparent hover:shadow-none border-none flex items-center justify-center"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setValue("client", "");
                      setObjFilterForm((prev) => ({ ...prev, client: "" }));
                      setCustomerOptions([]);
                      if (inputCustomerRef.current)
                        inputCustomerRef.current.value = "";
                    }}
                  >
                    <MdEdit className="text-2xl" />
                  </button>
                </div>
              ) : (
                <CustomerSelector
                  inputClass={inputClass}
                  errors={errors}
                  register={register}
                  objFilterForm={objFilterForm}
                  setObjFilterForm={setObjFilterForm}
                  isLoadingCustomer={isLoadingCustomer}
                  inputCustomerRef={inputCustomerRef}
                  showCustomerDropdown={showCustomerDropdown}
                  setShowCustomerDropdown={setShowCustomerDropdown}
                  customerOptions={customerOptions}
                  debouncedSearchCustomer={debouncedSearchCustomer}
                  trigger={trigger}
                  handleCustomerChange={handleCustomerChange}
                />
              )}
            </div>

            <div className="flex flex-row gap-2 items-center justify-center col-span-1">
              <span className={labelClass()}>Status</span>

              <select
                defaultValue=""
                className={inputClass(!!errors.status)}
                {...register("status")}
              >
                <option disabled value="">
                  Pick a status
                </option>
                {Object.entries(InspectionStatusLabel).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5  p-2 mb-0 rounded-md">
            <div className="flex flex-row gap-2 items-center justify-center col-span-1">
              <span className={labelClass()}>Name</span>
              <input
                type="text"
                className={inputClass(!!errors.name)}
                {...register("name")}
              />
            </div>
            <div className="flex flex-row gap-2 items-center justify-center col-span-1">
              <span className={labelClass()}>Theme</span>
              <select
                defaultValue=""
                disabled
                className={inputClass(!!errors.theme)}
                {...register("theme")}
              >
                <option disabled value="">
                  Select a template
                </option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mt-3 p-2">
            <div className="flex flex-col gap-2 items-left justify-center">
              <span className={`${labelClass()} !w-full`}>Description</span>
              <textarea
                className={`!text-left p-2 ${inputClass(!!errors.description)}`}
                rows={3}
                placeholder="Write work description..."
                {...register("description")}
              />
            </div>
          </div>
        </div>

        {selectedTemplateName && (
          <FormChassi
            register={
              register as unknown as UseFormRegister<{
                client: string;
                name: string;
                theme: string;
                status?: string;
              }>
            }
            errors={
              errors as FieldErrors<{
                client: string;
                name: string;
                theme: string;
                status?: string;
              }>
            }
            onQuestionsChange={handleQuestionsChange}
            onQuestionsExport={handleQuestionsExport}
            templateName={selectedTemplateName}
            templateId={Number(currentTemplateId)}
            initialQuestions={initialQuestionsRef.current || []}
          />
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={!isValid || !hasAtLeastOneQuestion}
            className="disabled:cursor-not-allowed disabled:!text-black btn font-normal bg-black text-white rounded-full pr-3 py-6 sm:flex border-none flex-1 w-full md:w-[300px] mx-auto"
          >
            <span className="py-1 px-2 text-white font-normal rounded-full md:block text-[13px]">
              Save
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

export default EditOrder;

// --- Subcomponente local para selector de cliente (tipado, sin any) ---
interface CustomerSelectorProps {
  inputClass: (hasError: boolean) => string;
  errors: FieldErrors<FormFields>;
  register: UseFormRegister<FormFields>;
  objFilterForm: {
    client: string;
    status: string;
    workorder: string;
    worker: string;
    creationdate?: Date;
  };
  setObjFilterForm: React.Dispatch<
    React.SetStateAction<{
      client: string;
      status: string;
      workorder: string;
      worker: string;
      creationdate?: Date;
    }>
  >;
  isLoadingCustomer: boolean;
  inputCustomerRef: React.RefObject<HTMLInputElement | null>;
  showCustomerDropdown: boolean;
  setShowCustomerDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  customerOptions: CustomerOption[];
  debouncedSearchCustomer: DebouncedFunc<(value: string) => void>;
  trigger: UseFormTrigger<FormFields>;
  handleCustomerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomerSelector: React.FC<CustomerSelectorProps> = ({
  inputClass,
  errors,
  register,
  objFilterForm,
  setObjFilterForm,
  isLoadingCustomer,
  inputCustomerRef,
  showCustomerDropdown,
  setShowCustomerDropdown,
  customerOptions,
  debouncedSearchCustomer,
  trigger,
  handleCustomerChange,
}) => {
  return (
    <div className="relative flex-1">
      <div className="relative">
        <input
          type="text"
          className={inputClass(!!errors.client)}
          {...register("client")}
          value={objFilterForm.client}
          onChange={handleCustomerChange}
          ref={inputCustomerRef}
          autoComplete="off"
        />
        {isLoadingCustomer && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
            <Loading height="h-[39px]" enableLabel={false} size="loading-sm " />
          </div>
        )}
      </div>
      {showCustomerDropdown && (
        <ul className="bg-base-100 w-full rounded-box shadow-md z-50 max-h-60 overflow-y-auto absolute mt-1 flex flex-col !cursor-pointer">
          {customerOptions.map((option) => (
            <li key={option.id} className="text-sm">
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  if (inputCustomerRef.current) {
                    setObjFilterForm((prev) => ({
                      ...prev,
                      client: option.name,
                    }));
                    inputCustomerRef.current.value = option.name;
                    debouncedSearchCustomer.cancel();
                    trigger("client");
                    setShowCustomerDropdown(false);
                  }
                }}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
