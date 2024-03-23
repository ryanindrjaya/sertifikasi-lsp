import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface QueryResult<TData> {
  data: TData | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => void;
}

function useQuery<TData = any>(url: string): QueryResult<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.get<TData>(BASE_URL + url);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error as AxiosError);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

export default useQuery;
