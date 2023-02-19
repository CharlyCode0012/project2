import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signial = abortController.signal;
    const fecthData = async () => {
      setLoading(true);

      try {
        const res = await fetch(url);

        if (!res.ok) {
          const error = new Error("Error en la peticion fetch");
          error.status = res.status || "00";
          error.statusText = res.statusText || "Ocurrio un error";
          throw error;
        }

        const json = await res.json();

        if (!signial.aborted) {
          setData(json);
          setError(null);
        }
      } catch (error) {
        if (!signial.aborted) {
          setData(null);
          setError(error);
        }
      } finally {
        if (!signial.aborted) setLoading(false);
      }
    };

    fecthData();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return {
    data,
    error,
    loading,
  };
};
