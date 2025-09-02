import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addInstance,
  getInstance,
} from "./axios";

const useGetInstanceQuery = (schemaId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['getInstance', schemaId],
    queryFn: () => getInstance(schemaId, {}),
    enabled: !!schemaId && enabled, // Only run if schemaId exists and enabled is true
    retry: 1, // Retry once on failure
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  });
}

const useAddInstanceQuery = (schemaId: any, formData: {}) => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => addInstance({ schemaId, data: formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getInstance', schemaId] });
    }
  });
}

export {
  useGetInstanceQuery,
  useAddInstanceQuery
};
