import axios from "axios";
import type { ApiError } from "../types/common";

export const statusOf = (error: unknown) => (axios.isAxiosError(error) ? error.response?.status : undefined);

const FIELD_MESSAGES: [RegExp, (match: RegExpMatchArray) => string][] = [
  [/must not be (blank|null|empty)/, () => "Este campo es obligatorio."],
  [/size must be between (\d+) and (\d+)/, m => `Debe tener entre ${m[1]} y ${m[2]} caracteres.`],
  [/well-formed email/, () => "Escribe un correo válido, por ejemplo tu@correo.com."],
  [/greater than or equal to (\d+)/, m => `Debe ser ${m[1]} o más.`],
  [/less than or equal to (\d+)/, m => `Debe ser ${m[1]} o menos.`],
  [/uppercase, lowercase and numeric/, () => "Debe tener una mayúscula, una minúscula y un número."],
];

function translateField(text: string) {
  for (const [pattern, toText] of FIELD_MESSAGES) {
    const match = text.match(pattern);
    if (match) return toText(match);
  }
  return "Revisa este campo.";
}

function parseFieldErrors(message?: string) {
  const fieldErrors: Record<string, string> = {};
  for (const part of message?.split(/, (?=\w+: )/) ?? []) {
    const match = part.match(/^(\w+): (.+)$/);
    if (match) fieldErrors[match[1]] = translateField(match[2]);
  }
  return fieldErrors;
}

export function errorInfo(error: unknown): { message: string; fieldErrors: Record<string, string> } {
  const none = {};
  if (!axios.isAxiosError<ApiError>(error)) return { message: "Inténtalo otra vez.", fieldErrors: none };
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return { message: "El servidor tardó demasiado en responder. Inténtalo otra vez.", fieldErrors: none };
  }
  if (!error.response || !navigator.onLine) return { message: "Sin conexión: revisa tu red.", fieldErrors: none };

  switch (error.response.status) {
    case 400:
      return { message: "Revisa los datos marcados e inténtalo otra vez.", fieldErrors: parseFieldErrors(error.response.data?.message) };
    case 401:
      return { message: "Tu sesión expiró. Vuelve a iniciar sesión.", fieldErrors: none };
    case 403:
      return { message: "No tienes permisos para hacer esto.", fieldErrors: none };
    case 404:
      return { message: "No lo encontramos. Quizá ya se borró.", fieldErrors: none };
    case 409:
      return { message: "Ya existe o está en uso.", fieldErrors: none };
    default:
      return error.response.status >= 500
        ? { message: "Algo falló de nuestro lado. Inténtalo otra vez.", fieldErrors: none }
        : { message: "Inténtalo otra vez.", fieldErrors: none };
  }
}

export const errorMessage = (error: unknown, action: string) => `${action} ${errorInfo(error).message}`;
