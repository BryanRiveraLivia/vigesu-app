import { IWorkOrderRepository } from "@/core/domain/repositories/work-order.repository";

export class GetTotalWorkOrdersUseCase {
  constructor(private readonly repository: IWorkOrderRepository) {}

  async execute(): Promise<number> {
    return this.repository.getTotalWorkOrders();
  }
}
