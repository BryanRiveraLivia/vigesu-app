import {
  toISOStringWithTimeSmart,
  toISOStringDateOnly,
} from "@/core/utils/utils";

import { OrderForm } from "@/features/orders/create-order/CreateOrder";

export interface CustomerOption {
  id: number;
  name: string;
}

export interface MechanicOption {
  id: number;
  name: string;
}

export const mapOrderFormToApiPayload = (
  form: OrderForm,
  selectedCustomer: CustomerOption | null,
  selectedMechanic: MechanicOption | null,
  files: File[]
) => {
  const tires = form.tires || {};

  const { start, finish } = toISOStringWithTimeSmart(
    form.datate_of_repair,
    form.time_start_service ?? "",
    form.time_finish_service ?? ""
  );

  return {
    customerId: String(form.customer_order),
    employeeId: String(form.mechanic_name),
    command: "string",
    customerName: selectedCustomer?.name ?? "",
    employeeName: selectedMechanic?.name ?? "",
    locationOfRepair: form.location_of_repair,
    equipament: form.equipment_order,
    dateOfRepair: toISOStringDateOnly(form.datate_of_repair),
    timeStart: start,
    timeFinish: finish,
    licencePlate: form.license_plate,
    po: form.po_number,
    vin: form.vin_number,
    rif: tires.rif,
    rof: tires.rof,
    rir: tires.rir,
    ror: tires.ror,
    lif: tires.lif,
    lof: tires.lof,
    lir: tires.lir,
    lor: tires.lor,
    cif: tires.cif,
    cof: tires.cof,
    cir: tires.cir,
    cor: tires.co,
    statusWorkOrder: 0,
    quickBookEstimateId: "",
    observation: form.observation,
    workOrderDetails:
      form.work_items?.map((item) => ({
        itemId: String(item.idParts),
        quantity: Number(item.quantity),
        observation: item.description,
      })) ?? [],
    createWorkOrderPhotos: files.map((file) => ({
      name: file.name,
    })),
  };
};

export const mapOrderEditFormToApiPayload = (
  form: OrderForm,
  selectedCustomer: CustomerOption | null,
  selectedMechanic: MechanicOption | null,
  workOrderId: string
) => {
  const tires = form.tires || {};

  const { start, finish } = toISOStringWithTimeSmart(
    form.datate_of_repair,
    form.time_start_service ?? "",
    form.time_finish_service ?? ""
  );

  return {
    workOrderId: Number(workOrderId), // Aquí lo agregamos al payload
    customerId: String(form.customer_order),
    employeeId: String(form.mechanic_name),

    command: "UPDATE", // ✅ Valor correcto requerido por backend
    customerName: selectedCustomer?.name ?? "",
    employeeName: selectedMechanic?.name ?? "",
    locationOfRepair: form.location_of_repair,
    equipament: form.equipment_order,
    dateOfRepair: toISOStringDateOnly(form.datate_of_repair),
    timeStart: start,
    timeFinish: finish,
    licencePlate: form.license_plate,
    po: form.po_number,
    vin: form.vin_number,
    rif: tires.rif,
    rof: tires.rof,
    rir: tires.rir,
    ror: tires.ror,
    lif: tires.lif,
    lof: tires.lof,
    lir: tires.lir,
    lor: tires.lor,
    cif: tires.cif,
    cof: tires.cof,
    cir: tires.cir,
    cor: tires.co,
    statusWorkOrder: 0,
    quickBookEstimateId: "",
    observation: form.observation,
    workOrderDetails:
      form.work_items?.map((item) => ({
        itemId: String(item.idParts), // ✅ Convertido a string para el backend
        quantity: Number(item.quantity),
        observation: item.description,
      })) ?? [],
    updateWorkOrderPhotos: [],
    deleteImageName: [],
  };
};
