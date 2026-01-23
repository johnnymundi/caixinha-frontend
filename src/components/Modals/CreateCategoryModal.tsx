import { useMemo, useState } from "react";
import { api } from "@/services/api";
import type { Category } from "@/@types/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateCategoryModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (cat: Category) => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const canSave = useMemo(
    () => name.trim().length >= 2 && !saving,
    [name, saving],
  );

  async function save() {
    setError("");
    setSaving(true);
    try {
      const res = await api.post<Category>("/categories/", {
        name: name.trim(),
      });
      onCreated(res.data);
      setName("");
      onClose();
    } catch (e: any) {
      const msg =
        e?.response?.data?.name?.[0] ??
        e?.response?.data?.detail ??
        "Não foi possível criar a categoria.";
      setError(String(msg));
    } finally {
      setSaving(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    // impede fechar enquanto está salvando
    if (!nextOpen && saving) return;
    if (!nextOpen) onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Nova categoria</DialogTitle>
          <DialogDescription>
            Crie uma categoria para organizar suas transações.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Nome</Label>
            <Input
              id="category-name"
              autoFocus
              placeholder="Ex: Alimentação"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <p className="text-sm text-muted-foreground">
            Dica: use nomes curtos e consistentes (ex: “Casa”, “Mercado”,
            “Transporte”).
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button type="button" onClick={save} disabled={!canSave}>
            {saving ? "Salvando…" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
