import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";

export const PAGE_SIZES = [10, 25, 50, 100];

type Changes = Record<string, string | number | null>;

export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlPage = Number(searchParams.get("page"));
  const page = Number.isInteger(urlPage) && urlPage > 1 ? urlPage - 1 : 0;
  const urlSize = Number(searchParams.get("size"));
  const size = PAGE_SIZES.includes(urlSize) ? urlSize : PAGE_SIZES[0];
  const search = searchParams.get("search") ?? "";

  const update = useCallback((changes: Changes, replace = false) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (!("page" in changes)) next.delete("page");
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === "") next.delete(key);
        else next.set(key, String(value));
      });
      return next;
    }, { replace });
  }, [setSearchParams]);

  const setPage = useCallback((newPage: number, replace = false) => {
    update({ page: newPage > 0 ? newPage + 1 : null }, replace);
  }, [update]);

  const setSize = useCallback((newSize: number) => update({ size: newSize }), [update]);

  const fitTo = useCallback((totalPages: number) => {
    if (totalPages > 0 && page >= totalPages) setPage(totalPages - 1, true);
  }, [page, setPage]);

  const [query, setQuery] = useState(search);
  const [lastSearch, setLastSearch] = useState(search);
  if (search !== lastSearch) {
    setLastSearch(search);
    setQuery(search);
  }
  const debounced = useDebounce(query.trim(), 400);

  useEffect(() => {
    if (debounced === query.trim() && debounced !== search) update({ search: debounced });
  }, [debounced, query, search, update]);

  return {
    page,
    size,
    search,
    query,
    setQuery,
    get: (key: string) => searchParams.get(key),
    update,
    setPage,
    setSize,
    fitTo,
  };
}
