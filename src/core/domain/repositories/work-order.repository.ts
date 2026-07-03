import { PaginatedResult } from "../types/paginated-result";
import { WorkOrder } from "@/features/inspections/models/inspections.types";
import { WorkOrderFilters } from "@/core/types/order/IFilters";

export interface IWorkOrderRepository {
  getWorkOrders(
    filters: WorkOrderFilters,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatedResult<WorkOrder>>;

  getTotalWorkOrders(): Promise<number>;
}
