import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addInstance,
  getInstance,
} from "./axios";

const useGetInstanceQuery = (schemaId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['getInstance', schemaId],
    queryFn: () => getInstance(schemaId, {})
  });
}

const useAddInstanceQuery = (schemaId: any, formData: {}) => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addInstance'] });
    }
  });
}

export {
  useGetInstanceQuery,
  useAddInstanceQuery
};
