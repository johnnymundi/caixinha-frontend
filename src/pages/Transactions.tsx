import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import type { Category, Transaction, TxType } from "@/@types/types";
import Badge from "@/components/badge";
import EmptyState from "@/components/EmptyState";
import CreateCategoryModal from "@/components/Modals/CreateCategoryModal";
import ConfirmDialog from "@/components/Modals/ConfirmDialog";
import { toast } from "sonner";

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
      const payload: any = {
        type: form.type,
        amount: form.amount,
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
      toast.error("Erro ao salvar");
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
    <div style={{ display: "grid", gap: 12 }}>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Transações</h2>
          <div style={{ color: "#666" }}>
            Entradas: <b>{money(totals.inc)}</b> • Saídas:{" "}
            <b>{money(totals.out)}</b> • Saldo: <b>{money(totals.bal)}</b>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span>Mês</span>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={input}
            />
          </label>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            style={input}
          >
            <option value="ALL">Todos</option>
            <option value="IN">Entradas</option>
            <option value="OUT">Saídas</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={input}
          >
            <option value="ALL">Todas categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section
        style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 12 }}
      >
        <div style={panel}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Nova transação</h3>
            <button style={btn} onClick={() => setCreateCatOpen(true)}>
              + Categoria
            </button>
          </div>

          <form
            onSubmit={createTransaction}
            style={{ display: "grid", gap: 10 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as TxType }))
                }
                style={input}
              >
                <option value="IN">Entrada</option>
                <option value="OUT">Saída</option>
              </select>

              <input
                placeholder="Valor (ex: 35.90)"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                style={input}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                style={input}
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                style={input}
              >
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <input
              placeholder="Descrição (opcional)"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              style={input}
            />

            <button style={btnPrimary} type="submit">
              Salvar
            </button>

            <small style={{ color: "#666" }}>
              💡 Se quiser, eu também te passo um endpoint pra “categoria padrão
              = Outros”.
            </small>
          </form>
        </div>

        <div style={panel}>
          <h3 style={{ marginTop: 0 }}>Lista</h3>

          {loading ? (
            <div style={{ color: "#666" }}>Carregando…</div>
          ) : txs.length === 0 ? (
            <EmptyState
              title="Nada por aqui ainda"
              description="Crie sua primeira transação para ver o histórico e o resumo do mês."
              action={
                <button
                  style={btnPrimary}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  Criar transação
                </button>
              }
            />
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {txs.map((t) => (
                <div key={t.id} style={row}>
                  <div style={{ display: "grid", gap: 4 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Badge type={t.type} />
                      <b style={{ fontSize: 14 }}>{money(t.amount)}</b>
                      <span style={{ color: "#666", fontSize: 13 }}>
                        {t.date}
                      </span>
                    </div>

                    <span style={{ color: "#666", fontSize: 13 }}>
                      {t.category_name ?? "Sem categoria"}
                      {t.description ? ` • ${t.description}` : ""}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setTxToDelete(t);
                      setConfirmOpen(true);
                    }}
                    style={btnDanger}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CreateCategoryModal
        open={createCatOpen}
        onClose={() => setCreateCatOpen(false)}
        onCreated={(cat) => {
          setCategories((prev) => {
            // evita duplicar
            if (prev.some((x) => x.id === cat.id)) return prev;
            return [...prev, cat].sort((a, b) => a.name.localeCompare(b.name));
          });
          // seleciona a nova categoria no form
          setForm((f) => ({ ...f, category: String(cat.id) }));
          toast.success("Categoria criada!");
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir transação?"
        description={
          txToDelete
            ? `Você vai excluir ${txToDelete.type === "IN" ? "uma entrada" : "uma saída"} de ${money(txToDelete.amount)} (${txToDelete.date}).`
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

const panel: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  background: "white",
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  border: "1px solid #f0f0f0",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
};

const input: React.CSSProperties = {
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
};

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e5e5",
  background: "#fff",
  cursor: "pointer",
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  border: "1px solid #000",
  background: "#000",
  color: "#fff",
};

const btnDanger: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #e5e5e5",
  background: "#fff",
  cursor: "pointer",
};
