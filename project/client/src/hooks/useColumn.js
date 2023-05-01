import { useMemo } from "react";

export function useColumn(th) {
  const columns = useMemo(() => th, [th]);

  return columns;
}
