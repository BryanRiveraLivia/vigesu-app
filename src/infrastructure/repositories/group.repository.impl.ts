import {
  GetGroupsParams,
  IGroupRepository,
} from "@/core/domain/repositories/group.repository";
import { Group } from "@/core/domain/entities/group.entity";
import { PaginatedResult } from "@/core/domain/types/paginated-result";
import { httpClient } from "@/infrastructure/http/http-client";

export class GroupRepositoryImpl implements IGroupRepository {
  async getGroups(params: GetGroupsParams): Promise<PaginatedResult<Group>> {
    const queryParams: Record<string, unknown> = {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    };

    if (params.name) {
      queryParams.Name = params.name;
    }

    if (params.status !== undefined && params.status !== -1) {
      // -1 or null check depending on usage
      queryParams.Status = params.status;
    }

    const response = await httpClient.get<PaginatedResult<Group>>("/Group", {
      params: queryParams,
    });

    return response.data;
  }

  async createGroup(params: { name: string }): Promise<void> {
    await httpClient.post("/Group", params);
  }

  async updateGroup(params: {
    groupId: number;
    name: string;
    status: number;
  }): Promise<void> {
    await httpClient.put(`/Group/${params.groupId}`, params);
  }
}
