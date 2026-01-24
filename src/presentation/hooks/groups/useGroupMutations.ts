import { useState } from "react";
import { createGroupUseCase, updateGroupUseCase } from "@/core/di/container";

interface UseGroupMutationsReturn {
  createGroup: (name: string) => Promise<void>;
  updateGroup: (groupId: number, name: string, status: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useGroupMutations = (): UseGroupMutationsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGroup = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      await createGroupUseCase.execute({ name });
    } catch (err) {
      console.error(err);
      setError("Failed to create group");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (groupId: number, name: string, status: number) => {
    setLoading(true);
    setError(null);
    try {
      await updateGroupUseCase.execute({ groupId, name, status });
    } catch (err) {
      console.error(err);
      setError("Failed to update group");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createGroup, updateGroup, loading, error };
};
