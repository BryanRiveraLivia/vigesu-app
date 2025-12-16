"use client";
import { usePathname, useRouter } from "next/navigation";
import { COMPANY_INFO } from "@/config/constants";
import React, { FC, useRef, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUploader from "./ImageUploader";
import { TbArrowDownToArc } from "react-icons/tb";
import { IoAddCircleOutline } from "react-icons/io5";
import ActionButton from "@/shared/components/shared/tableButtons/ActionButton";
import {
  mapOrderEditFormToApiPayload,
  mapOrderFormToApiPayload,
} from "@/shared/utils/orderMapper";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { debounce } from "lodash";
import clsx from "clsx";
import { MdEdit } from "react-icons/md";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/shared/components/shared/Loading";
import { toast } from "sonner";
import { renameFileWithUniqueName } from "@/shared/utils/utils";
import { useTranslations } from "next-intl";
import { formatApiErrorForToast } from "@/shared/utils/errors";

interface WorkOrderDetail {
  observation?: string;
  quantity?: number | string;
  itemId?: number;
}

const workItemSchema = z.object({
  description: z.string().optional(),
  parts: z.string().min(1, "Required"),
  quantity: z.string().min(1, "Required"),
  itemId: z.number().optional(),
});

const orderSchema = z.object({
  customer_order: z.string().min(1, "Required"),
  location_of_repair: z.string().min(1, "Required"),
  time_start_service: z.string().optional(),
  equipment_order: z.string().min(1, "Required"),
  datate_of_repair: z.string().min(1, "Required"),
  time_finish_service: z.string().optional(),
  license_plate: z.string().min(1, "Required"),
  po_number: z.string().optional(),
  vin_number: z.string().optional(),
  mechanic_name: z.string().min(1, "Required"),
  tires: z.object({
    rif: z.string().optional(),
    rof: z.string().optional(),
    rir: z.string().optional(),
    ror: z.string().optional(),
    lif: z.string().optional(),
    lof: z.string().optional(),
    lir: z.string().optional(),
    lor: z.string().optional(),
    cif: z.string().optional(),
    cof: z.string().optional(),
    cir: z.string().optional(),
    co: z.string().optional(),
  }),
  observation: z.string().optional(),
  work_items: z.array(workItemSchema),
});

interface CustomerOption {
  id: number;
  name: string;
}

interface MechanicOption {
  id: number;
  name: string;
}

interface ItemOption {
  id: number;
  name: string;
}

export type OrderForm = z.infer<typeof orderSchema>;

const EditOrder = () => {
  const tToasts = useTranslations("toast");

  const tAlerts = useTranslations("alerts");
  const tWorkOrders = useTranslations("workorders");
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();
  const parentPath = pathname.replace(/\/[^/]+$/, "");

  const router = useRouter();
  const [disableButton, setDisableButton] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [selectedMechanic, setSelectedMechanic] =
    useState<MechanicOption | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemOption | null>(null);

  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [mechanicOptions, setMechanicOptions] = useState<MechanicOption[]>([]);
  const [showMechanicDropdown, setShowMechanicDropdown] = useState(false);
  const mechanicInputRef = useRef<HTMLInputElement>(null);

  const [itemOptions, setItemOptions] = useState<ItemOption[]>([]);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const itemInputRef = useRef<HTMLInputElement>(null);

  const [newItem, setNewItem] = useState({
    description: "",
    parts: "",
    quantity: "",
    itemId: 0,
  });

  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [isLoadingMechanic, setIsLoadingMechanic] = useState(false);
  const [isLoadingServiceParts, setIsLoadingServiceParts] = useState(false);

  const [newItemError, setNewItemError] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const previewUrlsRef = useRef<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [deletedPhotoNames, setDeletedPhotoNames] = useState<string[]>([]);

  const searchCustomer = async (name?: string) => {
    try {
      let url = `/QuickBooks/Customers/GetCustomerName?RealmId=9341454759827689`;
      if (name) url += `&Name=${encodeURIComponent(name)}`;

      const response = await axiosInstance.get(url);
      setCustomerOptions(response.data ?? []);
    } catch (error) {
      /* toast.error(`${tToasts("error")}: ${error}`);*/
      //console.error("Error buscando clientes:", error);
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setIsLoadingMechanic(false);
    }
  };

  const debouncedSearch = useRef(
    debounce((value: string) => {
      if (value.length >= 3) {
        searchCustomer(value);
      } else {
        setCustomerOptions([]);
      }
    }, 500)
  ).current;

  const handleCustomerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setShowDropdown(true);

    if (value.length >= 1) {
      setIsLoadingCustomer(true); // 🔥 Mostrar desde el primer caracter
    } else {
      setIsLoadingCustomer(false); // 🔕 Apagar si el campo queda vacío
    }

    debouncedSearch(value);
  };

  const searchMechanic = async (name?: string) => {
    try {
      let url = `/QuickBooks/employees/GetEmployeeName?RealmId=9341454759827689`;
      if (name) url += `&Name=${encodeURIComponent(name)}`;

      const response = await axiosInstance.get(url);
      setMechanicOptions(response.data ?? []);
    } catch (error) {
      /*toast.error(`${tToasts("error")}: ${error}`);*/
      //console.error("Error buscando empleados:", error);
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setIsLoadingMechanic(false);
    }
  };

  const debouncedSearchMechanic = useRef(
    debounce((value: string) => {
      if (value.length >= 3) {
        searchMechanic(value);
      } else {
        setMechanicOptions([]);
      }
    }, 500)
  ).current;

  const handleMechanicInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setShowMechanicDropdown(true);

    if (value.length >= 1) {
      setIsLoadingMechanic(true); // 🔥 Mostrar desde el primer caracter
    } else {
      setIsLoadingMechanic(false); // 🔕 Apagar si el campo queda vacío
    }

    debouncedSearchMechanic(value);
  };

  const searchItem = async (name?: string) => {
    try {
      let url = `/QuickBooks/Items/GetItemName?RealmId=9341454759827689`;
      if (name) url += `&Name=${encodeURIComponent(name)}`;

      const response = await axiosInstance.get(url);
      setItemOptions(response.data ?? []);
    } catch (error) {
      /*toast.error(`${tToasts("error")}: ${error}`);*/
      //console.error("Error buscando items:", error);
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setIsLoadingServiceParts(false);
    }
  };

  const debouncedSearchItem = useRef(
    debounce((value: string) => {
      if (value.length >= 3) {
        searchItem(value);
      } else {
        setItemOptions([]);
      }
    }, 500)
  ).current;

  const handleItemInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewItem((prev) => ({ ...prev, parts: value }));
    setShowItemDropdown(true);

    if (value.length >= 1) {
      setIsLoadingServiceParts(true); // 🔥 Mostrar desde el primer caracter
    } else {
      setIsLoadingServiceParts(false);
    }

    debouncedSearchItem(value);
  };

  const getTodayLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getCustomerName = async (customerId: string) => {
    if (!customerId) return "";
    const res = await axiosInstance.get(
      `/QuickBooks/Customers/GetCustomerId?CustomerId=${customerId}&RealmId=9341454759827689`
    );
    return res.data?.name ?? "";
  };

  const getMechanicName = async (mechanicId: string) => {
    if (!mechanicId) return "";
    const res = await axiosInstance.get(
      `/QuickBooks/Employees/GetEmployeeId?EmployeeId=${mechanicId}&RealmId=9341454759827689`
    );
    return res.data?.name ?? "";
  };

  const fetchWorkOrder = async () => {
    try {
      const res = await axiosInstance.get(
        `/WorkOrder/GetWorkOrderById?WorkOrderId=${id}`
      );
      const data = res.data;

      setDisableButton(data.statusWorkOrder);

      const fetchItemName = async (itemId: number): Promise<string> => {
        if (!itemId) return "";
        const response = await axiosInstance.get(
          `/QuickBooks/Items/GetItemId?ItemId=${itemId}&RealmId=9341454759827689`
        );
        return response.data?.name ?? "";
      };

      const workItems = await Promise.all(
        (data.workOrderDetails as WorkOrderDetail[] | undefined)?.map(
          async (item) => ({
            description: item.observation ?? "",
            quantity: String(item.quantity ?? ""),
            itemId: Number(item.itemId ?? 0), // ✅ aseguramos tipo number
            parts: await fetchItemName(item.itemId ?? 0),
          })
        ) ?? []
      );

      const customerName = await getCustomerName(data.customerId);
      const mechanicName = await getMechanicName(data.employeeId);

      // 🔁 1. Reset con todos los campos excepto work_items
      reset({
        customer_order: String(data.customerId),
        mechanic_name: String(data.employeeId),
        location_of_repair: data.locationOfRepair ?? "",
        time_start_service: data.timeStart?.substring(11, 16) ?? "",
        equipment_order: data.equipament ?? "",
        datate_of_repair: data.dateOfRepair?.substring(0, 10) ?? "",
        time_finish_service: data.timeFinish?.substring(11, 16) ?? "",
        license_plate: data.licencePlate ?? "",
        po_number: data.po ?? "",
        vin_number: data.vin ?? "",
        observation: data.observation ?? "",
        tires: {
          rif: data.rif ?? "",
          rof: data.rof ?? "",
          rir: data.rir ?? "",
          ror: data.ror ?? "",
          lif: data.lif ?? "",
          lof: data.lof ?? "",
          lir: data.lir ?? "",
          lor: data.lor ?? "",
          cif: data.cif ?? "",
          cof: data.cof ?? "",
          cir: data.cir ?? "",
          co: data.cor ?? "",
        },
      });

      // 🧩 2. Luego sincroniza el array con `replace`
      replace(workItems);

      // Luego seteamos los "visuales"
      setSelectedCustomer({ id: data.customerId, name: customerName });
      setSelectedMechanic({ id: data.employeeId, name: mechanicName });

      setExistingPhotos(
        data.workOrderPhotos?.map((p: { name: string }) => p.name) ?? []
      );
      setFiles([]);
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    } catch (err) {
      toast.error(`${tToasts("error")}: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchWorkOrder();
    }
  }, [id]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    reset,
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    mode: "onChange",
    defaultValues: {
      work_items: [],
      tires: {
        rif: "",
        rof: "",
        rir: "",
        ror: "",
        lif: "",
        lof: "",
        lir: "",
        lor: "",
        cif: "",
        cof: "",
        cir: "",
        co: "",
      },
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "work_items",
  });

  const onSubmit = async (data: OrderForm) => {
    try {
      // Adaptamos data
      const adaptedData = {
        ...data,
        work_items: data.work_items.map((item) => ({
          ...item,
          idParts: item.itemId ?? 0,
        })),
      };

      // ⚠️ Primero sube los archivos físicos si hay
      if (files.length > 0) {
        const formData = new FormData();
        formData.append("WorkOrderId", String(id));

        files.forEach((file) => {
          formData.append("Files", file);
        });

        try {
          const res = await axiosInstance.post(
            "/WorkOrder/UploadWorkOrderPhotos",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Upload result:", res.data);

          if (res.data !== 1) {
            //toast.error(`${tToasts("error")}: ${tToasts("msj.18")}`);
          } else {
            toast.success(`${tToasts("ok")}: ${tToasts("msj.19")}`);
          }
        } catch (error) {
          /*toast.error(`${tToasts("error")}: ${error}`);
          console.error(error);*/
          const msg = formatApiErrorForToast(error);
          toast.error(msg, {
            style: { whiteSpace: "pre-line" },
          });
        }
      }

      // Luego arma el payload con los nombres reales
      const payload = {
        ...mapOrderEditFormToApiPayload(
          adaptedData,
          selectedCustomer,
          selectedMechanic,
          id
        ),
        updateWorkOrderPhotos: [
          ...files.map((file) => ({ name: file.name })),
          ...existingPhotos.map((name) => ({ name })),
        ],
        deleteImageName: deletedPhotoNames,
      };
      console.log("updateWorkOrderPhotos:", payload.updateWorkOrderPhotos);
      console.log("deleteImageName:", payload.deleteImageName);

      // Actualiza el registro
      await axiosInstance.put(`/WorkOrder/${id}`, payload);

      // 🔁 Refresca la orden para actualizar visuales
      await fetchWorkOrder();
      setFiles([]);
      setDeletedPhotoNames([]);
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];

      setFiles([]);

      toast.success(`${tToasts("ok")}: ${tToasts("msj.20")}`);

      //router.push(parentPath);
    } catch (error) {
      /*toast.error(`${tToasts("error")}: ${error}`);*/
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    }
  };

  const handleAddRow = () => {
    const result = workItemSchema.safeParse({
      ...newItem,
      itemId: Number(newItem.itemId),
    });

    if (!result.success) {
      setNewItemError(result.error.issues[0]?.message || "Invalid input");
      return;
    }

    append(result.data);
    setNewItem({ description: "", parts: "", quantity: "", itemId: 0 });
    setSelectedItem(null);
    setNewItemError(null);
  };

  const handleNewItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "itemId" ? Number(value) : value,
    }));
  };

  const inputClass = (hasError: boolean) =>
    `flex-1 input input-lg bg-[#f6f3f4] w-full text-center font-bold text-3xl transition-all border-1 text-lg font-normal ${
      hasError ? "border-red-500" : "border-gray-100"
    }`;

  const labelClass = () => `font-medium w-[30%] break-words`;

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        toast.error(`${tToasts("error")}: ${tToasts("msj.11")}`);
      })}
    >
      <div className=" border-[#00000014] border-1 p-2 mb-6 rounded-md flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex flex-row gap-2 items-center justify-center ">
            <span className={clsx(labelClass(), `!w-[30%]`)}>
              {tWorkOrders("edit.1")}
            </span>
            {selectedCustomer ? (
              <div className="flex flex-1 items-center gap-2 ">
                <span className="truncate w-0 flex-1 px-2">
                  {selectedCustomer.name}
                </span>
                <button
                  type="button"
                  className="btn p-2 btn-xs bg-transparent hover:shadow-none border-none  flex items-center justify-center "
                  onClick={() => {
                    setIsLoadingCustomer(false);
                    setSelectedCustomer(null);
                    setValue("customer_order", "");
                    setCustomerOptions([]);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <MdEdit className="text-2xl" />
                </button>
              </div>
            ) : (
              <div className="relative flex-1">
                <div className="relative">
                  <input
                    {...register("customer_order")}
                    type="text"
                    className={inputClass(!!errors.customer_order)}
                    onChange={(e) => {
                      handleCustomerInputChange(e);
                      setValue("customer_order", e.target.value);
                    }}
                    ref={(el) => {
                      inputRef.current = el;
                    }}
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
                <ul className="bg-base-100 w-full rounded-box shadow-md z-50 max-h-60 overflow-y-auto absolute mt-1 flex flex-col !cursor-pointer">
                  {customerOptions.map((option, idx) => (
                    <li
                      key={option.id}
                      className="w-full !cursor-pointer text-sm"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (inputRef.current) {
                            inputRef.current.value = option.name;
                            setShowDropdown(false);
                            setValue("customer_order", String(option.id));
                            setSelectedCustomer(option);
                            setCustomerOptions([]);
                            debouncedSearch.cancel();
                          }
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {option.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={labelClass()}> {tWorkOrders("edit.2")}</span>
            <input
              {...register("location_of_repair")}
              type="text"
              className={inputClass(!!errors.location_of_repair)}
            />
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={labelClass()}> {tWorkOrders("edit.3")}</span>
            <input
              {...register("time_start_service")}
              type="time"
              defaultValue={getCurrentTime()}
              className={inputClass(!!errors.time_start_service)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={labelClass()}>{tWorkOrders("edit.4")}</span>
            <input
              {...register("equipment_order")}
              type="text"
              className={inputClass(!!errors.equipment_order)}
            />
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={labelClass()}>{tWorkOrders("edit.5")}</span>
            <input
              {...register("datate_of_repair")}
              type="date"
              defaultValue={getTodayLocalDate()}
              className={inputClass(!!errors.datate_of_repair)}
            />
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={labelClass()}>{tWorkOrders("edit.6")}</span>
            <input
              {...register("time_finish_service")}
              type="time"
              className={inputClass(!!errors.time_finish_service)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={labelClass()}>{tWorkOrders("edit.7")}</span>
            <input
              {...register("license_plate")}
              type="text"
              className={inputClass(!!errors.license_plate)}
            />
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={labelClass()}>{tWorkOrders("edit.8")}</span>
            <input
              {...register("po_number")}
              type="text"
              className={inputClass(!!errors.po_number)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={labelClass()}>{tWorkOrders("edit.9")}</span>
            <input
              {...register("vin_number")}
              type="text"
              className={inputClass(!!errors.vin_number)}
            />
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={clsx(labelClass(), `!w-[30%]`)}>
              {tWorkOrders("edit.10")}
            </span>

            {selectedMechanic ? (
              <div className="flex flex-1 items-center gap-2 ">
                <span className="truncate w-0 flex-1 px-2">
                  {selectedMechanic.name}
                </span>
                <button
                  type="button"
                  className="btn p-2 btn-xs bg-transparent hover:shadow-none border-none flex items-center justify-center"
                  onClick={() => {
                    setIsLoadingMechanic(false);
                    setSelectedMechanic(null);
                    setValue("mechanic_name", "");
                    setMechanicOptions([]);
                    if (mechanicInputRef.current)
                      mechanicInputRef.current.value = "";
                  }}
                >
                  <MdEdit className="text-2xl" />
                </button>
              </div>
            ) : (
              <div className="relative flex-1">
                <div className="reelative">
                  <input
                    {...register("mechanic_name")}
                    type="text"
                    className={inputClass(!!errors.mechanic_name)}
                    onChange={(e) => {
                      handleMechanicInputChange(e);
                      setValue("mechanic_name", e.target.value);
                    }}
                    ref={(el) => {
                      register("mechanic_name").ref(el);
                      mechanicInputRef.current = el;
                    }}
                    autoComplete="off"
                  />
                  {isLoadingMechanic && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                      <Loading enableLabel={false} size="loading-sm " />
                    </div>
                  )}
                </div>
                <ul className="bg-base-100 w-full rounded-box shadow-md z-50 max-h-60 overflow-y-auto absolute mt-1 flex flex-col !cursor-pointer">
                  {mechanicOptions.map((option, idx) => (
                    <li
                      key={option.id}
                      className="w-full !cursor-pointer text-sm"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (mechanicInputRef.current) {
                            mechanicInputRef.current.value = option.name;
                            setShowMechanicDropdown(false);
                            setValue("mechanic_name", option.name);
                            setSelectedMechanic(option);
                            setMechanicOptions([]);
                            debouncedSearchMechanic.cancel();
                            console.log("Seleccionaste mechanic:", {
                              id: option.id,
                              name: option.name,
                            });
                          }
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {option.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-box border-[#00000014] border-1 mb-6 p-3 gap-4 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={clsx(labelClass(), `!w-[30%]`)}>
              {tWorkOrders("edit.11")}
            </span>

            {selectedItem ? (
              <div className="flex flex-1 items-center gap-2 ">
                <span className="truncate w-0 flex-1 px-2">
                  {selectedItem.name}
                </span>
                <button
                  type="button"
                  className="btn p-2 btn-xs bg-transparent hover:shadow-none border-none flex items-center justify-center"
                  onClick={() => {
                    setSelectedItem(null);
                    setNewItem((prev) => ({ ...prev, parts: "" }));
                    setItemOptions([]);
                    if (itemInputRef.current) itemInputRef.current.value = "";
                  }}
                >
                  <MdEdit className="text-2xl" />
                </button>
              </div>
            ) : (
              <div className="relative flex-1">
                <div className="flex">
                  <input
                    name="parts"
                    value={newItem.parts}
                    onChange={handleItemInputChange}
                    ref={itemInputRef}
                    className={inputClass(
                      !!newItemError && newItem.parts.trim() === ""
                    )}
                    type="text"
                    autoComplete="off"
                  />
                  {isLoadingServiceParts && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                      <Loading enableLabel={false} size="loading-sm " />
                    </div>
                  )}
                </div>
                <ul className="bg-base-100 w-full rounded-box shadow-md z-50 max-h-60 overflow-y-auto absolute mt-1 flex flex-col !cursor-pointer">
                  {itemOptions.map((option, idx) => (
                    <li
                      key={option.id}
                      className="w-full !cursor-pointer text-sm"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (itemInputRef.current) {
                            setIsLoadingServiceParts(false);
                            itemInputRef.current.value = option.name;
                            setShowItemDropdown(false);
                            setNewItem((prev) => ({
                              ...prev,
                              parts: option.name,
                              itemId: option.id,
                            }));
                            setSelectedItem(option);
                            setItemOptions([]);
                            debouncedSearchItem.cancel();
                          }
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        {option.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-row gap-2 items-center justify-center">
            <span className={labelClass()}> {tWorkOrders("edit.12")}</span>
            <input
              name="quantity"
              value={newItem.quantity}
              onChange={handleNewItemChange}
              className={inputClass(
                !!newItemError && newItem.quantity.trim() === ""
              )}
              type="number"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <div className="flex flex-col gap-2 items-left justify-center">
            <span className={`${labelClass()} !w-full`}>
              {" "}
              {tWorkOrders("edit.13")}
            </span>
            <textarea
              name="description"
              value={newItem.description}
              onChange={handleNewItemChange}
              className={`!text-left p-2 ${inputClass(
                !!newItemError && newItem.description.trim() === ""
              )}`}
              rows={3}
              placeholder="Write work description..."
            ></textarea>

            <button
              type="button"
              onClick={handleAddRow}
              className="btn min-w-[30px] min-h-[39px] p-2 rounded-md mt-3"
            >
              <IoAddCircleOutline className="text-2xl" />
              {tWorkOrders("edit.14")}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-box border-[#00000014] border-1 ">
          <table className="table w-full">
            <thead className="bg-[#191917]">
              <tr className="border-b-[#00000014]">
                <th className=" text-center w-[40%] text-white font-medium">
                  {tWorkOrders("edit.13")}
                </th>
                <th className=" text-center w-[15%] text-white font-medium">
                  {tWorkOrders("edit.11")}
                </th>
                <th className=" text-center w-[15%] text-white font-medium">
                  {tWorkOrders("edit.12")}
                </th>
                <th className=" text-center w-[5%] text-white font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b-[#00000014]">
                  <td className="text-center">
                    <input
                      {...register(`work_items.${index}.description`)}
                      type="text"
                      className={`${inputClass(
                        false
                      )} bg-white border-none focus:outline-none focus:ring-0 focus:border-none`}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      {...register(`work_items.${index}.parts`)}
                      type="text"
                      readOnly
                      className={`${inputClass(
                        false
                      )} bg-white border-none focus:outline-none focus:ring-0 focus:border-none`}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      {...register(`work_items.${index}.quantity`)}
                      type="text"
                      className={`${inputClass(
                        false
                      )} bg-white border-none focus:outline-none focus:ring-0 focus:border-none`}
                    />
                  </td>
                  <td className="text-center">
                    <ActionButton
                      icon={
                        <FiTrash2 className="w-[20px] h-[20px] opacity-70" />
                      }
                      label="Delete"
                      onClick={() => remove(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-bold mb-2"> {tWorkOrders("edit.15")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-4 border-[#00000014] border-1 p-3 mb-6 rounded-md">
          {(
            [
              "rif",
              "rof",
              "rir",
              "ror",
              "lif",
              "lof",
              "lir",
              "lor",
              "cif",
              "cof",
              "cir",
              "co",
            ] as const
          ).map((key) => (
            <div
              key={key}
              className="flex flex-row gap-2 items-center justify-center"
            >
              <span className={labelClass()}>{key.toUpperCase()}</span>
              <input
                {...register(`tires.${key}` as const)}
                type="text"
                className={`input border-gray-100 input-lg bg-[#f6f3f4] w-full text-left text-lg font-normal`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-box border-[#00000014] border-1 mb-6 p-3 gap-4 flex flex-col">
        <div className="flex flex-col gap-2 items-left justify-center">
          <span className="font-bold break-words !w-full">
            {tWorkOrders("edit.16")}
          </span>
          <textarea
            {...register("observation")}
            className="!text-left p-2 flex-1 input input-lg bg-[#f6f3f4] w-full    transition-all border-1 text-lg font-normal border-gray-100"
            rows={5}
            placeholder={tWorkOrders("edit.21")}
          ></textarea>
        </div>
      </div>

      <div className="overflow-hidden">
        <ImageUploader
          files={files} // pasamos directamente el estado
          onFilesChange={(newFiles) => {
            // limpiar previews anteriores
            previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            previewUrlsRef.current = newFiles.map((file) =>
              URL.createObjectURL(file)
            );
            setFiles(newFiles);
          }}
          existingFiles={existingPhotos}
          onRemoveExistingFile={(name) => {
            setDeletedPhotoNames((prev) => [...prev, name]);
            setExistingPhotos((prev) => prev.filter((n) => n !== name));
          }}
          accept={{
            "image/*": [],
            "application/pdf": [],
            "application/msword": [],
          }}
        />
      </div>

      {disableButton !== null && disableButton !== 1 && (
        <div className="pt-4">
          <button
            type="submit"
            className="btn font-normal bg-black text-white rounded-full pr-3 py-6 sm:flex border-none flex-1 w-full md:w-[300px] mx-auto"
          >
            <span className="py-1 px-2 text-white font-normal rounded-full md:block text-[13px]">
              {tWorkOrders("edit.19")}
            </span>
          </button>
        </div>
      )}
    </form>
  );
};

export default EditOrder;
