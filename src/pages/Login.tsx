import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation() as any;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const from = location?.state?.from ?? "/";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
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
          <h1 className="text-2xl font-semibold">Entrar</h1>
          <p className="text-sm text-gray-500">Acesse sua Caixinha</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Senha</label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          disabled={busy}
          className="w-full rounded-lg bg-black text-white py-2 font-medium disabled:opacity-60"
        >
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
