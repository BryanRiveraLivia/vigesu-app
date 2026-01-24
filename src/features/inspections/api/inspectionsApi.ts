// src/features/orders/api/workOrdersApi.ts

import { axiosInstance } from "@/core/utils/axiosInstance";
import { WorkOrderResponse } from "../models/inspections.types";
import { WorkOrderFilters } from "@/core/types/order/IFilters";
import { toast } from "sonner";

export const getWorkOrders = async (
  filters: WorkOrderFilters,
  pageNumber: number,
  pageSize: number
) => {
  const params = new URLSearchParams();

  if (filters.client) params.append("CustomerId", filters.client);
  if (filters.worker) params.append("EmployeeId", filters.worker);
  if (filters.status) params.append("StatusWorkOrder", filters.status);
  if (filters.creationdate)
    params.append("Created", filters.creationdate.toISOString());

  if (filters.workorder) {
    const num = Number(filters.workorder);
    if (!isNaN(num)) {
      params.append("WorkOrderNumber", num.toString());
    }
  }

  params.append("PageNumber", pageNumber.toString());
  params.append("PageSize", pageSize.toString());

  const response = await axiosInstance.get(`/WorkOrder?${params.toString()}`);
  return response.data;
};

export const getTotalWorkOrders = async () => {
  try {
    const response = await axiosInstance.get(`/WorkOrder`);
    const data = response.data.totalCount;
    return data ?? 0;
  } catch (error) {
    console.log(`${error}`);
  }
};
