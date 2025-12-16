"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import {
  CustomerOption,
  TypeInspectionOption,
} from "@/features/orders/inspections/types/IInspectionSelect";
import { debounce } from "lodash";
import {
  IFullQuestion,
  IFullTypeInspection,
} from "../types/IFullTypeInspection";
import Loading from "@/shared/components/shared/Loading";
import { GiAutoRepair } from "react-icons/gi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useInspectionFullStore } from "../../store/inspection/inspectionFullStore";
import { group } from "console";
import Page from "@/app/[locale]/dashboard/documents/work-orders/edit/page";
import GenerateStep1 from "./GenerateStep1";
import GenerateStep2 from "./GenerateStep2";
import GenerateStep3 from "./GenerateStep3";
import GenerateStep4 from "./GenerateStep4";
import { useTranslations } from "next-intl";
import { formatApiErrorForToast } from "@/shared/utils/errors";
import { toast } from "sonner";

const GenerateStep0 = () => {
  const t = useTranslations("inspections");
  const { fullInspection, groupName, stepWizard, resetFullInspection } =
    useInspectionFullStore();
  const router = useRouter();
  const pathname = usePathname();
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const inputCustomerRef = useRef<HTMLInputElement>(null);

  const [typeOptions, setTypeOptions] = useState<TypeInspectionOption[]>([]);
  const [selectedType, setSelectedType] = useState<TypeInspectionOption | null>(
    null
  );

  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [inspectionData, setInspectionData] =
    useState<IFullTypeInspection | null>(null);

  const [objFilterForm, setObjFilterForm] = useState({ client: "" });

  // Búsqueda en tiempo real con debounce
  const debouncedSearchCustomer = useRef(
    debounce(async (value: string) => {
      if (value.length >= 3) {
        try {
          const response = await axiosInstance.get<CustomerOption[]>(
            `/QuickBooks/Customers/GetCustomerAll?search=${encodeURIComponent(
              value
            )}`
          );
          const filtered = (response.data ?? []).filter((item) =>
            item.name.toLowerCase().startsWith(value.toLowerCase())
          );
          setCustomerOptions(filtered);
          setShowCustomerDropdown(true);
        } catch (error) {
          /* console.error("Error buscando clientes:", error);*/
          setCustomerOptions([]);
          const msg = formatApiErrorForToast(error);
          toast.error(msg, {
            style: { whiteSpace: "pre-line" },
          });
        } finally {
          setIsLoadingCustomer(false);
        }
      } else {
        setCustomerOptions([]);
        setShowCustomerDropdown(false);
      }
    }, 500)
  ).current;

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setObjFilterForm({ client: value });

    if (value.length >= 1) {
      setIsLoadingCustomer(true); // 🔥 Mostrar desde el primer caracter
    } else {
      setIsLoadingCustomer(false); // 🔕 Apagar si el campo queda vacío
    }

    debouncedSearchCustomer(value);

    // Si se borra el campo, reinicia todo
    if (!value.trim()) {
      resetFields();
    }
  };

  const handleCustomerSelect = (option: CustomerOption) => {
    setSelectedCustomer(option);
    setObjFilterForm({ client: option.name });
    setShowCustomerDropdown(false);
    setCustomerOptions([]);

    // 🔄 Limpiar selección anterior
    setSelectedType(null);
    setInspectionData(null);
    setTypeOptions([]);

    // Cargar nuevos tipos
    fetchTypeInspections(option.id);
  };

  const fetchTypeInspections = async (customerId: string) => {
    try {
      const res = await axiosInstance.get<{ items: TypeInspectionOption[] }>(
        "/TypeInspection"
      );
      const filtered = res.data.items.filter(
        (item) => item.customerId == customerId || item.customerId == "0"
      );
      setTypeOptions(filtered);
    } catch (err) {
      console.error("Error cargando tipos de inspección", err);
    }
  };

  const handleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInspectionData(null);
    const found = typeOptions.find(
      (type) => type.typeInspectionId === parseInt(e.target.value)
    );
    setSelectedType(found ?? null);
    if (found) {
      try {
        const res = await axiosInstance.get<IFullTypeInspection>(
          `/TypeInspection/GetFullTypeInspectionId?TypeInspectionId=${found.typeInspectionId}`
        );
        setInspectionData(res.data);
        console.log("Datos completos de inspección:", res.data);
      } catch (err) {
        console.error("Error al obtener datos completos de inspección", err);
      }
    } else {
      setInspectionData(null);
    }
  };

  const goStep = async (
    typeInspectionId: number,
    groupName: string,
    groupId: number
  ) => {
    try {
      setIsLoading(true);

      const store = useInspectionFullStore.getState();
      const previous = store.fullInspection;

      const res = await axiosInstance.get<IFullTypeInspection>(
        `/TypeInspection/GetFullTypeInspectionId?TypeInspectionId=${typeInspectionId}`
      );

      // fusiona respuestas anteriores si existen
      const mergedQuestions = res.data.questions.map((q) => {
        const prev = previous?.questions.find(
          (pq) => pq.typeInspectionDetailId === q.typeInspectionDetailId
        );
        return {
          ...q,
          answers: prev?.answers ?? q.answers,
          finalResponse: prev?.finalResponse ?? "",
          statusInspectionConfig: prev?.statusInspectionConfig ?? false,
        };
      });

      store.setFullInspection({
        ...res.data,
        questions: mergedQuestions,
      });

      useInspectionFullStore.getState().setGroupName(groupName);
      useInspectionFullStore.getState().setGroupId(groupId);
      useInspectionFullStore.getState().setStepWizard(1);

      setIsLoading(false);
      /* const grouped = res.data.questions.reduce((acc, question) => {
        if (!acc[question.groupName]) acc[question.groupName] = [];
        acc[question.groupName].push(question);
        return acc;
      }, {} as Record<string, IFullQuestion[]>);*/
      //router.push(`${pathname}/configuration`);
    } catch (err) {
      console.error("Error al obtener datos completos de inspección", err);
    }
  };

  const resetFields = () => {
    setSelectedCustomer(null);
    setSelectedType(null);
    setTypeOptions([]);
    setInspectionData(null);
    setObjFilterForm({ client: "" });
    if (inputCustomerRef.current) inputCustomerRef.current.value = "";
    setCustomerOptions([]);
    setShowCustomerDropdown(false);
  };

  useEffect(() => {
    if (
      selectedCustomer &&
      selectedType &&
      inspectionData &&
      inspectionData.questions.length > 0
    ) {
      // Obtenemos el primer grupo (groupName y groupId)
      const firstGroup = inspectionData.questions[0];
      if (firstGroup) {
        goStep(
          inspectionData.typeInspectionId,
          firstGroup.groupName,
          firstGroup.groupId
        );
      }
    }
  }, [selectedCustomer, selectedType, inspectionData]);

  return (
    <>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
        <legend className="fieldset-legend text-lg">{t("step0.1")}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
          {/* Client */}
          <div className="flex flex-col">
            <legend className="fieldset-legend text-lg font-normal">
              {t("step0.2")}
            </legend>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  className="input input-lg text-lg w-full"
                  name="customer_order"
                  value={objFilterForm.client}
                  onChange={handleCustomerChange}
                  ref={inputCustomerRef}
                  autoComplete="off"
                />
                {isLoadingCustomer && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                    <Loading
                      height="h-[39px]"
                      enableLabel={false}
                      size="loading-sm "
                    />
                  </div>
                )}
              </div>
              {showCustomerDropdown && customerOptions.length > 0 && (
                <ul className="bg-base-100 w-full rounded-box shadow-md z-50 max-h-60 overflow-y-auto relative">
                  {customerOptions.map((option) => (
                    <li key={option.id} className="cursor-pointer text-sm">
                      <button
                        type="button"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleCustomerSelect(option)}
                      >
                        {option.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Tipo de inspección */}
          <div className="flex flex-col">
            <legend className="fieldset-legend text-lg font-normal">
              {t("step0.3")}
            </legend>
            <select
              className="select w-full text-lg input-lg disabled:border-gray-200"
              disabled={!typeOptions.length}
              value={selectedType?.typeInspectionId || ""}
              onChange={handleTypeChange}
            >
              <option value="">{t("step0.4")}</option>
              {typeOptions.map((type) => (
                <option
                  key={type.typeInspectionId}
                  value={type.typeInspectionId}
                >
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex flex-col !hidden">
            <legend className="fieldset-legend text-lg font-normal hidden md:flex min-h-[32px]">
              {" "}
            </legend>
            <div className="flex flex-row items-center justify-center gap-2">
              <button
                className="btn bg-black rounded-full pr-3 py-6 sm:flex border-none flex-1"
                onClick={() => console.log({ selectedCustomer, selectedType })}
              >
                <IoSearchOutline className="text-xl text-white" />
                <span className="py-1 px-4 text-white font-normal rounded-full md:block text-[13px]">
                  Search
                </span>
              </button>
              <button
                className="btn bg-black/50 rounded-full pr-3 py-6 sm:flex border-none w-[50px]"
                onClick={resetFields}
              >
                <MdOutlineSettingsBackupRestore className="text-2xl text-white" />
              </button>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="!hidden">
        {/*!inspectionData && (
          <Loading height="h-[300px]" label="Esperando configuración ..." />
        )*/}
        {/* Grupos (cards) */}
        <div className="cont my-5 flex flex-col gap-1">
          {inspectionData &&
            Object.entries(
              inspectionData.questions.reduce(
                (acc, question) => {
                  if (!acc[question.groupName]) acc[question.groupName] = [];
                  acc[question.groupName].push(question);
                  return acc;
                },
                {} as Record<string, IFullQuestion[]>
              )
            ).map(([groupName, questions]) => {
              const groupId = questions[0]?.groupId;
              return (
                <button
                  onClick={() =>
                    goStep(inspectionData.typeInspectionId, groupName, groupId)
                  }
                  className="w-full card lg:card-side bg-black/80 shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-lg  hover:bg-[#191917] text-white hover:text-white/80 flex flex-row"
                  key={groupName}
                >
                  <div className="bg-[#191917] w-fit flex items-center justify-center p-2">
                    <GiAutoRepair className="w-[25px] h-[25px]  text-white" />
                  </div>
                  <div className="card-body flex flex-row justify-between gap-5">
                    <div className="flex flex-col items-start">
                      <h2 className="card-title text-left">{groupName} </h2>
                      <p className="text-lg text-left">
                        {inspectionData.description}
                      </p>
                    </div>
                    <div className="card-actions justify-end flex items-center ">
                      {questions.filter((item) => item.status === 0).length >
                        0 && (
                        <span className="badge badge-error text-white text-lg">
                          {questions.filter((item) => item.status === 0).length}
                        </span>
                      )}
                      {questions.filter((item) => item.status === 1).length >
                        0 && (
                        <span className="badge badge-success text-white text-lg">
                          {questions.filter((item) => item.status === 1).length}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
      {inspectionData && (
        <div className="containerX mt-12 max-w-full mb-5">
          {objFilterForm.client !== "" && stepWizard === 1 && (
            <GenerateStep1 ClientName={objFilterForm.client} />
          )}
          {stepWizard === 2 && <GenerateStep2 />}
          {stepWizard === 3 && <GenerateStep3 />}
          {stepWizard === 4 && <GenerateStep4 />}
        </div>
      )}
      {/*isLoading && (
        <Loading className="absolute top-0 left-0 h-full bg-white z-50" />
      )*/}
    </>
  );
};

export default GenerateStep0;
