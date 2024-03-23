import axios, { AxiosRequestConfig } from "axios";
import { useState } from "react";

type MutationResult<TData> = [
  (variables?: any, deleteUrl?: string) => void,
  {
    data: TData | null;
    loading: boolean;
    error: any;
  }
];

type MutationOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

function useMutation<TData = any, TVariables = any>(
  url: string,
  method: "get" | "post" | "put" | "delete",
  options?: MutationOptions
): MutationResult<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (variables?: TVariables, deleteUrl?: string) => {
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      let response;
      switch (method) {
        case "get":
          response = await axios.get<TData>(BASE_URL + url);
          break;
        case "post":
          response = await axios.post<TData>(BASE_URL + url, variables);
          break;
        case "put":
          response = await axios.put<TData>(BASE_URL + url, variables);
          break;
        case "delete":
          response = await axios.delete<TData>(BASE_URL || "" + deleteUrl);
          break;
      }
      setData(response?.data);
      options?.onSuccess && options.onSuccess();
      setError(null);
    } catch (err) {
      options?.onError && options.onError();
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return [mutate, { data, loading, error }];
}

export default useMutation;
