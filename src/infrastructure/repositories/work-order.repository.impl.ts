import { IWorkOrderRepository } from "@/core/domain/repositories/work-order.repository";
import { WorkOrder } from "@/features/inspections/models/inspections.types";
import { WorkOrderFilters } from "@/core/types/order/IFilters";
import { PaginatedResult } from "@/core/domain/types/paginated-result";
import { httpClient } from "@/infrastructure/http/http-client";

export class WorkOrderRepositoryImpl implements IWorkOrderRepository {
  async getWorkOrders(
    filters: WorkOrderFilters,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatedResult<WorkOrder>> {
    const params: Record<string, string> = {};

    if (filters.client) params["CustomerId"] = filters.client;
    if (filters.worker) params["EmployeeId"] = filters.worker;
    if (filters.status) params["StatusWorkOrder"] = filters.status;
    if (filters.creationdate)
      params["Created"] = filters.creationdate.toISOString();

    if (filters.workorder) {
      const num = Number(filters.workorder);
      if (!isNaN(num)) {
        params["WorkOrderNumber"] = num.toString();
      }
    }

    params["PageNumber"] = pageNumber.toString();
    params["PageSize"] = pageSize.toString();

    // httpClient handles base URL and interceptors
    const response = await httpClient.get<PaginatedResult<WorkOrder>>(
      "/WorkOrder",
      {
        params,
      },
    );

    return response.data;
  }

  async getTotalWorkOrders(): Promise<number> {
    try {
      const response = await httpClient.get<{ totalCount: number }>(
        "/WorkOrder",
      );
      return response.data.totalCount ?? 0;
    } catch (error: unknown) {
      console.warn("API Error:", error instanceof Error ? error.message : String(error));
      return 0;
    }
  }
}
