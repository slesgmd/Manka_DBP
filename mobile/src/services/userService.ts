import api from "./api";
import type { User } from "../types/auth";

export const getCurrentUser = (signal?: AbortSignal) =>
  api.get<User>("/users/me", { signal }).then(r => r.data);
