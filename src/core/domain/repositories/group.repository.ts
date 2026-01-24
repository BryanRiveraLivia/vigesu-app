import { Group } from "../entities/group.entity";
import { PaginatedResult } from "../types/paginated-result";

export interface GetGroupsParams {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: number;
}

export interface CreateGroupParams {
  name: string;
}

export interface UpdateGroupParams {
  groupId: number;
  name: string;
  status: number;
}

export interface IGroupRepository {
  getGroups(params: GetGroupsParams): Promise<PaginatedResult<Group>>;
  createGroup(params: CreateGroupParams): Promise<void>;
  updateGroup(params: UpdateGroupParams): Promise<void>;
}
