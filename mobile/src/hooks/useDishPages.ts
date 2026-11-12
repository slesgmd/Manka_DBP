import { useCallback, useEffect, useReducer } from "react";
import axios from "axios";
import { getDishes } from "../services/dishService";
import type { Dish } from "../types/catalog";
import type { Page } from "../types/common";

const PAGE_SIZE = 10;

interface DishPagesState {
  name: string;
  page: number;
  attempt: number;
  dishes: Dish[];
  total: number;
  last: boolean;
  loading: boolean;
  error: Error | null;
}

type DishPagesAction =
  | { type: "search"; name: string }
  | { type: "next" }
  | { type: "retry" }
  | { type: "loaded"; data: Page<Dish> }
  | { type: "failed"; error: Error };

function reducer(state: DishPagesState, action: DishPagesAction): DishPagesState {
  switch (action.type) {
    case "search":
      if (action.name === state.name) return state;
      return { ...state, name: action.name, page: 0, dishes: [], total: 0, last: false, loading: true, error: null };
    case "next":
      if (state.loading || state.last || state.error) return state;
      return { ...state, page: state.page + 1, loading: true };
    case "retry":
      return { ...state, attempt: state.attempt + 1, loading: true, error: null };
    case "loaded":
      return {
        ...state,
        dishes: action.data.number === 0 ? action.data.content : [...state.dishes, ...action.data.content],
        total: action.data.totalElements,
        last: action.data.last,
        loading: false,
      };
    case "failed":
      return { ...state, loading: false, error: action.error };
  }
}

export function useDishPages(name: string) {
  const [state, dispatch] = useReducer(reducer, {
    name,
    page: 0,
    attempt: 0,
    dishes: [],
    total: 0,
    last: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: "search", name });
  }, [name]);

  useEffect(() => {
    const controller = new AbortController();
    getDishes({ name: state.name || undefined, page: state.page, size: PAGE_SIZE, sort: "name,asc" }, controller.signal)
      .then(data => dispatch({ type: "loaded", data }))
      .catch(err => {
        if (axios.isCancel(err)) return;
        dispatch({ type: "failed", error: err instanceof Error ? err : new Error(String(err)) });
      });
    return () => controller.abort();
  }, [state.name, state.page, state.attempt]);

  const loadMore = useCallback(() => dispatch({ type: "next" }), []);
  const retry = useCallback(() => dispatch({ type: "retry" }), []);

  return { dishes: state.dishes, total: state.total, loading: state.loading, error: state.error, loadMore, retry };
}
