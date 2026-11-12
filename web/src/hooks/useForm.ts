import { useCallback, useReducer } from "react";

interface FormState<T> {
  values: T;
  error: string | null;
  sending: boolean;
}

type FormAction<T> =
  | { type: "change"; field: keyof T; value: T[keyof T] }
  | { type: "submit" }
  | { type: "fail"; error: string }
  | { type: "done" }
  | { type: "reset"; values: T };

function formReducer<T>(state: FormState<T>, action: FormAction<T>): FormState<T> {
  switch (action.type) {
    case "change":
      return { ...state, values: { ...state.values, [action.field]: action.value }, error: null };
    case "submit":
      return { ...state, error: null, sending: true };
    case "fail":
      return { ...state, error: action.error, sending: false };
    case "done":
      return { ...state, sending: false };
    case "reset":
      return { values: action.values, error: null, sending: false };
  }
}

export function useForm<T>(initialValues: T) {
  const [state, dispatch] = useReducer(formReducer<T>, { values: initialValues, error: null, sending: false });

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => dispatch({ type: "change", field, value }), []);
  const start = useCallback(() => dispatch({ type: "submit" }), []);
  const fail = useCallback((error: string) => dispatch({ type: "fail", error }), []);
  const done = useCallback(() => dispatch({ type: "done" }), []);
  const reset = useCallback((values: T) => dispatch({ type: "reset", values }), []);

  return { ...state, setField, start, fail, done, reset };
}
