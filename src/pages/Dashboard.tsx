import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import type { Summary, Transaction } from "@/@types/types";
import EmptyState from "../components/EmptyState";
import Badge from "@/components/badge";

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

export default function Dashboard() {
  const [month, setMonth] = useState(ymNow());
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const s = await api.get<Summary>(`/summary/?month=${month}`);
        setSummary(s.data);

        const r = await api.get<Transaction[]>(
          `/transactions/recent/?limit=10&month=${month}`,
        );
        setRecent(r.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [month]);

  const topOutCategories = useMemo(() => {
    if (!summary) return [];

    const out = summary.by_category
      .filter((x) => x.type === "OUT")
      .map((x) => ({
        name: x.category__name ?? "Sem categoria",
        total: Number(x.total),
      }))
      .sort((a, b) => b.total - a.total);

    // top 5
    return out.slice(0, 5);
  }, [summary]);

  const maxTop = useMemo(() => {
    return topOutCategories.reduce((m, x) => Math.max(m, x.total), 0);
  }, [topOutCategories]);

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
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <div style={{ color: "#666" }}>Resumo do mês</div>
        </div>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Mês</span>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{ padding: 8, borderRadius: 10, border: "1px solid #ddd" }}
          />
        </label>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        <Card title="Entradas" value={summary ? money(summary.income) : "—"} />
        <Card title="Saídas" value={summary ? money(summary.expense) : "—"} />
        <Card
          title="Saldo do mês"
          value={summary ? money(summary.balance_month) : "—"}
        />
        <Card
          title="Saldo total"
          value={summary ? money(summary.balance_total) : "—"}
        />
      </section>

      <section
        style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}
      >
        <div style={panel}>
          <h3 style={{ marginTop: 0 }}>Últimas transações</h3>

          {loading && recent.length === 0 ? (
            <div style={{ color: "#666" }}>Carregando…</div>
          ) : recent.length === 0 ? (
            <EmptyState
              title="Sem transações ainda"
              description="Crie uma transação na aba Transações para preencher seu histórico."
              action={
                <a href="/transactions" style={linkBtn}>
                  Ir para Transações
                </a>
              }
            />
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {recent.map((t) => (
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
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={panel}>
          <h3 style={{ marginTop: 0 }}>Top categorias (saídas)</h3>

          {!summary ? (
            <div style={{ color: "#666" }}>—</div>
          ) : topOutCategories.length === 0 ? (
            <EmptyState
              title="Nada para analisar ainda"
              description="Quando você tiver saídas categorizadas, o top aparecerá aqui."
            />
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {topOutCategories.map((x) => {
                const pct = maxTop > 0 ? (x.total / maxTop) * 100 : 0;
                return (
                  <div key={x.name} style={{ display: "grid", gap: 6 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>{x.name}</span>
                      <span style={{ color: "#111", fontWeight: 800 }}>
                        {money(x.total)}
                      </span>
                    </div>

                    <div
                      style={{
                        height: 10,
                        borderRadius: 999,
                        background: "#f2f2f2",
                        overflow: "hidden",
                        border: "1px solid #eee",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          borderRadius: 999,
                          background: "#111", // sem libs/tema, simples
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <div style={{ color: "#666", fontSize: 12 }}>
                (Barra relativa ao maior gasto do mês)
              </div>
            </div>
          )}
        </div>
      </section>
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
  border: "1px solid #f0f0f0",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
};

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={panel}>
      <div style={{ color: "#666", fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{value}</div>
    </div>
  );
}

const linkBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #000",
  background: "#000",
  color: "#fff",
  textDecoration: "none",
};
