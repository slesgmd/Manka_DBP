import api from "./api";
import type { User, UserRoleUpdateRequest } from "../types/auth";

export const getCurrentUser = (signal?: AbortSignal) =>
  api.get<User>("/users/me", { signal }).then(r => r.data);

export const getUsers = (signal?: AbortSignal) =>
  api.get<User[]>("/users", { signal }).then(r => r.data);

export const updateUserRoles = (id: number, data: UserRoleUpdateRequest) =>
  api.patch<User>(`/users/${id}/roles`, data).then(r => r.data);
