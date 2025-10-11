// src/hooks/useSwrMutation.ts
import { apiClient } from "@/api/apiClient";
import useSWRMutation from "swr/mutation";

export function useSwrMutationApi(endpoint: string) {
  const { trigger, data, error, isMutating } = useSWRMutation(endpoint, async (url: string, { arg }: { arg: any }) => {
    return await apiClient.post(url, arg);
  });

  return { trigger, data, error, isMutating };
}
