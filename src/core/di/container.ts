import { GroupRepositoryImpl } from "@/infrastructure/repositories/group.repository.impl";
import { WorkOrderRepositoryImpl } from "@/infrastructure/repositories/work-order.repository.impl"; // New
import { GetGroupsUseCase } from "@/core/application/use-cases/groups/get-groups.use-case";
import { CreateGroupUseCase } from "@/core/application/use-cases/groups/create-group.use-case";
import { UpdateGroupUseCase } from "@/core/application/use-cases/groups/update-group.use-case";
import { GetWorkOrdersUseCase } from "@/core/application/use-cases/work-orders/get-work-orders.use-case"; // New
import { GetTotalWorkOrdersUseCase } from "@/core/application/use-cases/work-orders/get-total-work-orders.use-case"; // New

// Repositories
const groupRepository = new GroupRepositoryImpl();
const workOrderRepository = new WorkOrderRepositoryImpl(); // New

// Use Cases
export const getGroupsUseCase = new GetGroupsUseCase(groupRepository);
export const createGroupUseCase = new CreateGroupUseCase(groupRepository);
export const updateGroupUseCase = new UpdateGroupUseCase(groupRepository);

// Work Orders
export const getWorkOrdersUseCase = new GetWorkOrdersUseCase(
  workOrderRepository,
);
export const getTotalWorkOrdersUseCase = new GetTotalWorkOrdersUseCase(
  workOrderRepository,
);
