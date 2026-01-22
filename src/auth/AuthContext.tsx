import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

type User = {
  id: number | string;
  email: string;
  username: string;
  first_name?: string | null;
  last_name?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    try {
      const res = await api.get<User>("/auth/me/");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    try {
      const res = await api.post<{ user: User }>("/auth/login/", {
        email,
        password,
      });
      setUser(res.data.user);
      toast.success("Bem-vindo!");
    } catch (e: any) {
      const msg = e?.response?.data?.detail ?? "Não foi possível entrar.";
      toast.error("Login falhou", { description: String(msg) });
      throw e;
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout/");
    } finally {
      setUser(null);
      toast.info("Você saiu da conta");
    }
  }

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshMe }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuth deve ser usado dentro de <AuthProvider />");
  return ctx;
}
