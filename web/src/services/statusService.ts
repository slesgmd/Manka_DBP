import api from "./api";
import type { StatusResponse } from "../types/common";

export const getStatus = (signal?: AbortSignal) =>
  api.get<StatusResponse>("/status", { signal }).then(r => r.data);
