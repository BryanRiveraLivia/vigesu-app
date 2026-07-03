import { useState, useEffect, useCallback } from "react";
import { Group } from "@/core/domain/entities/group.entity";
import { getGroupsUseCase } from "@/core/di/container";
import { PaginatedResult } from "@/core/domain/types/paginated-result";

interface UseGroupsParams {
  page: number;
  pageSize: number;
  name?: string;
  status?: string; // Kept as string to match UI filter state, will parse in hook
}

interface UseGroupsReturn {
  groups: Group[];
  loading: boolean;
  totalRecords: number;
  totalPages: number;
  error: string | null;
  refresh: () => void;
}

export const useGroups = (params: UseGroupsParams): UseGroupsReturn => {
  const [data, setData] = useState<PaginatedResult<Group> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statusNumber =
        params.status && params.status !== ""
          ? Number(params.status)
          : undefined;

      const result = await getGroupsUseCase.execute({
        pageNumber: params.page,
        pageSize: params.pageSize,
        name: params.name,
        status: statusNumber,
      });
      setData(result);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [params.page, params.pageSize, params.name, params.status, refreshFlag]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const refresh = () => setRefreshFlag((prev) => prev + 1);

  return {
    groups: data?.items ?? [],
    loading,
    totalRecords: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 0,
    error,
    refresh,
  };
};
