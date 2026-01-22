import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export function applyToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("access_token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("access_token");
  }
}

export function applyRefreshToken(token: string | null) {
  if (token) localStorage.setItem("refresh_token", token);
  else localStorage.removeItem("refresh_token");
}

// aplica access no boot
applyToken(localStorage.getItem("access_token"));

let refreshing: Promise<string | null> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // pra não entrar em loop
    if (original?._retry) throw error;

    const status = error?.response?.status;
    const data = error?.response?.data;

    const isExpired =
      data?.code === "token_not_valid" &&
      Array.isArray(data?.messages) &&
      data.messages.some((m: any) =>
        m.message?.toLowerCase().includes("expired"),
      );

    if (status === 401 && isExpired) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        applyToken(null);
        throw error;
      }

      if (!refreshing) {
        refreshing = (async () => {
          try {
            const r = await axios.post(
              "http://localhost:8000/api/auth/refresh/",
              { refresh },
              { withCredentials: true },
            );

            const newAccess = r.data?.access ?? null;
            const newRefresh = r.data?.refresh ?? null;

            applyToken(newAccess);
            if (newRefresh) applyRefreshToken(newRefresh);

            return newAccess;
          } catch {
            applyToken(null);
            applyRefreshToken(null);
            return null;
          } finally {
            refreshing = null;
          }
        })();
      }

      const newAccess = await refreshing;
      if (!newAccess) throw error;

      // refaz a request original já com token novo
      return api(original);
    }

    throw error;
  },
);
