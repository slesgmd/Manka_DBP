import axios from "axios";

export const statusOf = (error: unknown) => (axios.isAxiosError(error) ? error.response?.status : undefined);
