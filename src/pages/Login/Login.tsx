import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation() as any;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location?.state?.from ?? "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(username, password);
      nav(from, { replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm space-y-4"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-semibold">Entrar</h1>
          <p className="text-sm text-gray-500">Acesse sua Caixinha</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enzo_Caixote"
          />
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-medium">Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-11.5 right-2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeSlashIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          disabled={busy}
          className="w-full rounded-lg bg-black text-white py-2 font-medium disabled:opacity-60"
        >
          {busy ? "Entrando…" : "Entrar"}
        </button>
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => nav("/forgot")}
            className="text-gray-600 hover:text-black underline-offset-4 hover:underline"
          >
            Esqueci minha senha
          </button>

          <button
            type="button"
            onClick={() => nav("/register")}
            className="text-gray-600 hover:text-black underline-offset-4 hover:underline"
          >
            Criar conta
          </button>
        </div>
      </form>
    </div>
  );
}
