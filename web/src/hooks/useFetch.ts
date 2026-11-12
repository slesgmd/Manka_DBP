import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface FetchState<T> {
  request: object | null;
  data: T | null;
  error: Error | null;
}

export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<FetchState<T>>({ request: null, data: null, error: null });
  const request = useMemo(() => ({ fetcher, attempt }), [fetcher, attempt]);

  useEffect(() => {
    const controller = new AbortController();
    request.fetcher(controller.signal)
      .then(data => setState({ request, data, error: null }))
      .catch(err => {
        if (axios.isCancel(err)) return;
        const error = err instanceof Error ? err : new Error(String(err));
        setState(prev => ({ request, data: prev.data, error }));
      });
    return () => controller.abort();
  }, [request]);

  const retry = () => setAttempt(a => a + 1);

  return {
    data: state.data,
    loading: state.request !== request,
    error: state.request === request ? state.error : null,
    retry,
  };
}
