import {
  IGroupRepository,
  CreateGroupParams,
} from "@/core/domain/repositories/group.repository";

export class CreateGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  async execute(params: CreateGroupParams): Promise<void> {
    return this.groupRepository.createGroup(params);
  }
}
