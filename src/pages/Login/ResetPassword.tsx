import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/services/api";
import { toast } from "sonner";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const { uid, token } = useParams();

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [busy, setBusy] = useState(false);

  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);

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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Nova senha
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Escolha uma senha nova.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="p1">Nova senha</Label>

              <div className="relative">
                <Input
                  id="p1"
                  type={showP1 ? "text" : "password"}
                  value={p1}
                  onChange={(e) => setP1(e.target.value)}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowP1((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                  aria-label={showP1 ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showP1 ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="p2">Confirmar nova senha</Label>

              <div className="relative">
                <Input
                  id="p2"
                  type={showP2 ? "text" : "password"}
                  value={p2}
                  onChange={(e) => setP2(e.target.value)}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowP2((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
                  aria-label={showP2 ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showP2 ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <Button disabled={busy} className="w-full rounded-lg">
              {busy ? "Salvando…" : "Salvar nova senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
