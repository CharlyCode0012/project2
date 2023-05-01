import { useMemo } from "react";

export function useRow(data) {
  const rows = useMemo(() => {
    if (data) return data;
    return [];
  }, [data]);

  return rows;
}
