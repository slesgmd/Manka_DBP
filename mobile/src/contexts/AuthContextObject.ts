import { createContext } from "react";
import type { LoginRequest, RegisterRequest, User } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  expired: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
