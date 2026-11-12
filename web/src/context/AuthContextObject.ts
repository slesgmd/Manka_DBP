import { createContext } from "react";
import type { LoginRequest, RegisterRequest, RoleName, User } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: RoleName) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
