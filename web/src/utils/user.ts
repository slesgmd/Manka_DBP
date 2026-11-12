import type { RoleName, User } from "../types/auth";

export const ROLE_LABELS: Record<RoleName, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  USER: "Usuario",
};

export const mainRoleLabel = (user: User) => {
  if (user.roles.includes("ADMIN")) return ROLE_LABELS.ADMIN;
  if (user.roles.includes("MANAGER")) return ROLE_LABELS.MANAGER;
  return ROLE_LABELS.USER;
};

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");
