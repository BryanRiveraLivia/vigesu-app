import {
  IGroupRepository,
  GetGroupsParams,
} from "@/core/domain/repositories/group.repository";
import { Group } from "@/core/domain/entities/group.entity";
import { PaginatedResult } from "@/core/domain/types/paginated-result";

export class GetGroupsUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(params: GetGroupsParams): Promise<PaginatedResult<Group>> {
    return this.groupRepository.getGroups(params);
  }
}
