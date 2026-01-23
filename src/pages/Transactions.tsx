import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import type { Category, Transaction, TxType } from "@/@types/types";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import CreateCategoryModal from "@/components/Modals/CreateCategoryModal";
import ConfirmDialog from "@/components/Modals/ConfirmDialog";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalizeBRLAmount } from "@/lib/normalizeAmout";

function ymNow() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function money(v: string | number) {
  const n = typeof v === "number" ? v : Number(v);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type FormState = {
  type: TxType;
  amount: string;
  date: string; // YYYY-MM-DD
  category: string; // id as string
  description: string;
};

export default function TransactionsPage() {
  const [month, setMonth] = useState(ymNow());
  const [typeFilter, setTypeFilter] = useState<TxType | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const [categories, setCategories] = useState<Category[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [createCatOpen, setCreateCatOpen] = useState(false);

  const [form, setForm] = useState<FormState>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return {
      type: "OUT",
      amount: "",
      date: `${yyyy}-${mm}-${dd}`,
      category: "",
      description: "",
    };
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  function unwrapResults<T>(data: any): T[] {
    return Array.isArray(data) ? data : (data?.results ?? []);
  }

  function buildQuery() {
    const params: Record<string, string> = { month };
    if (typeFilter !== "ALL") params.type = typeFilter;
    if (categoryFilter !== "ALL") params.category = categoryFilter;
    params.ordering = "-date,-id";
    return params;
  }

  async function loadAll() {
    setLoading(true);
    try {
      const [c, t] = await Promise.all([
        api.get("/categories/"),
        api.get("/transactions/", { params: buildQuery() }),
      ]);
      setCategories(unwrapResults<Category>(c.data));
      setTxs(unwrapResults<Transaction>(t.data));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, typeFilter, categoryFilter]);

  const totals = useMemo(() => {
    let inc = 0;
    let out = 0;
    for (const t of txs) {
      const n = Number(t.amount);
      if (t.type === "IN") inc += n;
      else out += n;
    }
    return { inc, out, bal: inc - out };
  }, [txs]);

  async function createTransaction(e: React.FormEvent) {
    e.preventDefault();
    try {
      const normalized = normalizeBRLAmount(form.amount);

      if (!normalized || Number.isNaN(Number(normalized))) {
        toast.error("Valor inválido", { description: "Use algo como 10,99" });
        return;
      }

      const payload: any = {
        type: form.type,
        amount: normalized,
        date: form.date,
        description: form.description,
        category: form.category ? Number(form.category) : null,
      };

      await api.post("/transactions/", payload);
      toast.success("Transação criada");
      setForm((f) => ({ ...f, amount: "", description: "" }));
      await loadAll();
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ?? "Verifique os campos e tente novamente.";
      toast.error("Erro ao salvar", { description: String(msg) });
    }
  }

  async function removeTxConfirmed() {
    if (!txToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/transactions/${txToDelete.id}/`);
      toast.success("Transação excluída");
      setConfirmOpen(false);
      setTxToDelete(null);
      await loadAll();
    } catch {
      toast.error("Erro ao excluir");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* topo */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Transações</h2>
          <p className="text-sm text-muted-foreground">
            Entradas: <span className="font-semibold">{money(totals.inc)}</span>{" "}
            • Saídas: <span className="font-semibold">{money(totals.out)}</span>{" "}
            • Saldo: <span className="font-semibold">{money(totals.bal)}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="month">Mês</Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-[170px]"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as any)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="IN">Entradas</SelectItem>
              <SelectItem value="OUT">Saídas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      {/* grid */}
      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.2fr]">
        {/* nova transação */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Nova transação</CardTitle>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => setCreateCatOpen(true)}
              >
                + Categoria
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={createTransaction} className="space-y-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, type: v as TxType }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Entrada</SelectItem>
                    <SelectItem value="OUT">Saída</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  inputMode="decimal"
                  placeholder="Valor (ex: 35.90)"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />

                <Select
                  value={form.category || "NONE"}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      category: v === "NONE" ? "" : v,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Sem categoria</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                placeholder="Descrição (opcional)"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />

              <Button type="submit" className="w-full rounded-lg">
                Salvar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* lista */}
        <Card className="min-h-[420px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lista</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Carregando…</div>
            ) : txs.length === 0 ? (
              <EmptyState
                title="Nada por aqui ainda"
                description="Crie sua primeira transação para ver o histórico e o resumo do mês."
              />
            ) : (
              <ScrollArea className="h-[520px] pr-2">
                <div className="space-y-2">
                  {txs.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge type={t.type} />
                          <span className="text-sm font-semibold">
                            {money(t.amount)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {t.date}
                          </span>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          {t.category_name ?? "Sem categoria"}
                          {t.description ? ` • ${t.description}` : ""}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => {
                          setTxToDelete(t);
                          setConfirmOpen(true);
                        }}
                      >
                        Excluir
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </section>

      <CreateCategoryModal
        open={createCatOpen}
        onClose={() => setCreateCatOpen(false)}
        onCreated={(cat) => {
          setCategories((prev) => {
            if (prev.some((x) => x.id === cat.id)) return prev;
            return [...prev, cat].sort((a, b) => a.name.localeCompare(b.name));
          });
          setForm((f) => ({ ...f, category: String(cat.id) }));
          toast.success("Categoria criada!");
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir transação?"
        description={
          txToDelete
            ? `Você vai excluir ${
                txToDelete.type === "IN" ? "uma entrada" : "uma saída"
              } de ${money(txToDelete.amount)} (${txToDelete.date}).`
            : undefined
        }
        confirmText="Excluir"
        onClose={() => {
          if (!deleting) {
            setConfirmOpen(false);
            setTxToDelete(null);
          }
        }}
        onConfirm={removeTxConfirmed}
        busy={deleting}
      />
    </div>
  );
}
