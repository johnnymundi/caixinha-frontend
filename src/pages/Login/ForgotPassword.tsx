import { useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Recuperar senha
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Digite seu email (ou username). Vamos mandar um link.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Email ou Username</Label>
              <Input
                id="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="voce@email.com ou seu_username"
                autoComplete="username"
              />
            </div>

            <Button disabled={busy} className="w-full rounded-lg">
              {busy ? "Enviando…" : "Enviar link"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-lg"
              onClick={() => nav("/login")}
            >
              Voltar pro login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
