import { GroupRepositoryImpl } from "@/infrastructure/repositories/group.repository.impl";
import { WorkOrderRepositoryImpl } from "@/infrastructure/repositories/work-order.repository.impl";
import { InspectionRepositoryImpl } from "@/infrastructure/repositories/inspection.repository.impl";
import { TypeInspectionRepositoryImpl } from "@/infrastructure/repositories/type-inspection.repository.impl";
import { GetGroupsUseCase } from "@/core/application/use-cases/groups/get-groups.use-case";
import { CreateGroupUseCase } from "@/core/application/use-cases/groups/create-group.use-case";
import { UpdateGroupUseCase } from "@/core/application/use-cases/groups/update-group.use-case";
import { GetWorkOrdersUseCase } from "@/core/application/use-cases/work-orders/get-work-orders.use-case";
import { GetTotalWorkOrdersUseCase } from "@/core/application/use-cases/work-orders/get-total-work-orders.use-case";
import { GetInspectionsUseCase } from "@/core/application/use-cases/inspections/get-inspections.use-case";
import { GetTemplateInspectionsUseCase } from "@/core/application/use-cases/inspections/get-template-inspections.use-case";
import { GetTypeInspectionsUseCase } from "@/core/application/use-cases/type-inspections/get-type-inspections.use-case";

// Repositories
const groupRepository = new GroupRepositoryImpl();
const workOrderRepository = new WorkOrderRepositoryImpl();
const inspectionRepository = new InspectionRepositoryImpl();
const typeInspectionRepository = new TypeInspectionRepositoryImpl();

// Groups
export const getGroupsUseCase = new GetGroupsUseCase(groupRepository);
export const createGroupUseCase = new CreateGroupUseCase(groupRepository);
export const updateGroupUseCase = new UpdateGroupUseCase(groupRepository);

// Work Orders
export const getWorkOrdersUseCase = new GetWorkOrdersUseCase(workOrderRepository);
export const getTotalWorkOrdersUseCase = new GetTotalWorkOrdersUseCase(workOrderRepository);

// Inspections
export const getInspectionsUseCase = new GetInspectionsUseCase(inspectionRepository);
export const getTemplateInspectionsUseCase = new GetTemplateInspectionsUseCase(inspectionRepository);

// Type Inspections
export const getTypeInspectionsUseCase = new GetTypeInspectionsUseCase(typeInspectionRepository);
