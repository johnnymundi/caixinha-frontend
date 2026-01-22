import { useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/register/", {
        username,
        email,
        password,
        password2,
      });
      toast.success("Conta criada!", {
        description: "Agora você já pode fazer login.",
      });
      nav("/login");
    } catch (e: any) {
      const data = e?.response?.data;
      const msg =
        data?.username?.[0] ||
        data?.email?.[0] ||
        data?.password?.[0] ||
        data?.password2?.[0] ||
        data?.detail ||
        "Não foi possível criar a conta.";
      toast.error("Erro no cadastro", { description: String(msg) });
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
          <h1 className="text-2xl font-semibold">Criar conta</h1>
          <p className="text-sm text-gray-500">
            Use um email válido para recuperar sua senha.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Senha</label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirmar senha</label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <button
          disabled={busy}
          className="w-full rounded-lg bg-black text-white py-2 font-medium disabled:opacity-60"
        >
          {busy ? "Criando…" : "Criar conta"}
        </button>

        <button
          type="button"
          onClick={() => nav("/login")}
          className="w-full rounded-lg border py-2 text-sm"
        >
          Voltar pro login
        </button>
      </form>
    </div>
  );
}
