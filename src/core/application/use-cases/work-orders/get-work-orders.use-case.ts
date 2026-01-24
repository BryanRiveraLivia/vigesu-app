import { IWorkOrderRepository } from "@/core/domain/repositories/work-order.repository";
import { WorkOrder } from "@/features/inspections/models/inspections.types";
import { WorkOrderFilters } from "@/core/types/order/IFilters";
import { PaginatedResult } from "@/core/domain/types/paginated-result";

export class GetWorkOrdersUseCase {
  constructor(private readonly repository: IWorkOrderRepository) {}

  async execute(
    filters: WorkOrderFilters,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatedResult<WorkOrder>> {
    return this.repository.getWorkOrders(filters, pageNumber, pageSize);
  }
}
