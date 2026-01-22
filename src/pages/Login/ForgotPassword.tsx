import { useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const nav = useNavigate();
  const [login, setLogin] = useState(""); // email OU username
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/auth/password-reset/", { login });
      toast.success("Se existir uma conta, enviamos o link!", {
        description: "No DEV o link aparece no terminal do Django.",
      });
      nav("/login");
    } catch {
      toast.error("Erro", { description: "Tente novamente." });
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
          <h1 className="text-2xl font-semibold">Recuperar senha</h1>
          <p className="text-sm text-gray-500">
            Digite seu email (ou username). Vamos mandar um link.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email ou Username</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>

        <button
          disabled={busy}
          className="w-full rounded-lg bg-black text-white py-2 font-medium disabled:opacity-60"
        >
          {busy ? "Enviando…" : "Enviar link"}
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
