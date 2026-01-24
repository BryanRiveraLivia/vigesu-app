import { GroupRepositoryImpl } from "@/infrastructure/repositories/group.repository.impl";
import { GetGroupsUseCase } from "@/core/application/use-cases/groups/get-groups.use-case";
import { CreateGroupUseCase } from "@/core/application/use-cases/groups/create-group.use-case";
import { UpdateGroupUseCase } from "@/core/application/use-cases/groups/update-group.use-case";

// Repositories
const groupRepository = new GroupRepositoryImpl();

// Use Cases
export const getGroupsUseCase = new GetGroupsUseCase(groupRepository);
export const createGroupUseCase = new CreateGroupUseCase(groupRepository);
export const updateGroupUseCase = new UpdateGroupUseCase(groupRepository);
