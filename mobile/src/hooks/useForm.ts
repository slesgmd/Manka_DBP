import { useCallback, useReducer, useRef } from "react";

type FieldErrors<T> = Partial<Record<keyof T, string>>;

interface FormState<T> {
  values: T;
  touched: Partial<Record<keyof T, boolean>>;
  serverErrors: FieldErrors<T>;
  error: string | null;
  sending: boolean;
}

type FormAction<T> =
  | { type: "change"; field: keyof T; value: T[keyof T] }
  | { type: "touch"; field: keyof T }
  | { type: "touchAll" }
  | { type: "submit" }
  | { type: "fail"; error: string; fieldErrors: FieldErrors<T> }
  | { type: "done" }
  | { type: "reset"; values: T };

function formReducer<T>(state: FormState<T>, action: FormAction<T>): FormState<T> {
  switch (action.type) {
    case "change":
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        serverErrors: { ...state.serverErrors, [action.field]: undefined },
        error: null,
      };
    case "touch":
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case "touchAll":
      return { ...state, touched: Object.fromEntries(Object.keys(state.values as object).map(key => [key, true])) as FormState<T>["touched"] };
    case "submit":
      return { ...state, error: null, serverErrors: {}, sending: true };
    case "fail":
      return { ...state, error: action.error, serverErrors: action.fieldErrors, sending: false };
    case "done":
      return { ...state, sending: false };
    case "reset":
      return { values: action.values, touched: {}, serverErrors: {}, error: null, sending: false };
  }
}

export function useForm<T extends object>(initialValues: T, validate: (values: T) => FieldErrors<T> = () => ({})) {
  const [state, dispatch] = useReducer(formReducer<T>, { values: initialValues, touched: {}, serverErrors: {}, error: null, sending: false });
  const sendingRef = useRef(false);

  const clientErrors = validate(state.values);
  const valid = !Object.values(clientErrors).some(Boolean);
  const errorOf = (field: keyof T) => state.serverErrors[field] || (state.touched[field] ? clientErrors[field] : undefined);
  const hasVisibleErrors = (Object.keys(state.values) as (keyof T)[]).some(field => errorOf(field));

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => dispatch({ type: "change", field, value }), []);
  const touch = useCallback((field: keyof T) => dispatch({ type: "touch", field }), []);

  const start = () => {
    if (sendingRef.current) return false;
    if (!valid) {
      dispatch({ type: "touchAll" });
      return false;
    }
    sendingRef.current = true;
    dispatch({ type: "submit" });
    return true;
  };

  const fail = useCallback((error: string, fieldErrors: FieldErrors<T> = {}) => {
    sendingRef.current = false;
    dispatch({ type: "fail", error, fieldErrors });
  }, []);

  const done = useCallback(() => {
    sendingRef.current = false;
    dispatch({ type: "done" });
  }, []);

  const reset = useCallback((values: T) => {
    sendingRef.current = false;
    dispatch({ type: "reset", values });
  }, []);

  return { ...state, valid, errorOf, hasVisibleErrors, setField, touch, start, fail, done, reset };
}
