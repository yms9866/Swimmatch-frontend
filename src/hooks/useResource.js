import { useEffect, useState } from "react";

export default function useResource(loader) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setStatus("loading");
      setData(null);
      try {
        const value = await loader(controller.signal);
        if (!controller.signal.aborted) {
          setData(value);
          setStatus("success");
        }
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }
    load();
    return () => controller.abort();
  }, [loader, request]);

  return { data, status, retry: () => setRequest((value) => value + 1) };
}
