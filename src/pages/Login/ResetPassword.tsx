import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const { uid, token } = useParams();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uid || !token) return;

    setBusy(true);
    try {
      await api.post(`/auth/password-reset/${uid}/${token}/`, {
        new_password: p1,
        new_password2: p2,
      });
      toast.success("Senha alterada!", {
        description: "Faça login com a nova senha.",
      });
      nav("/login");
    } catch (e: any) {
      const msg = e?.response?.data?.detail ?? "Link inválido ou expirado.";
      toast.error("Não foi possível alterar", { description: String(msg) });
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
          <h1 className="text-2xl font-semibold">Nova senha</h1>
          <p className="text-sm text-gray-500">Escolha uma senha nova.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nova senha</label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2"
            value={p1}
            onChange={(e) => setP1(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirmar nova senha</label>
          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2"
            value={p2}
            onChange={(e) => setP2(e.target.value)}
          />
        </div>

        <button
          disabled={busy}
          className="w-full rounded-lg bg-black text-white py-2 font-medium disabled:opacity-60"
        >
          {busy ? "Salvando…" : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
