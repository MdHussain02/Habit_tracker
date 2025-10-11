// src/hooks/useSwrApi.ts
import { apiClient } from "@/api/apiClient";
import useSWR from "swr";


export default function useSwrApi(endpoint: string, options = {}) {
  const fetcher = async (url: string) => await apiClient.get(url);

  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
