import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import type { Summary, Transaction } from "@/@types/types";
import EmptyState from "../components/EmptyState";
import Badge from "@/components/Badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
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

    return out.slice(0, 5);
  }, [summary]);

  const maxTop = useMemo(() => {
    return topOutCategories.reduce((m, x) => Math.max(m, x.total), 0);
  }, [topOutCategories]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Resumo do mês</p>
        </div>

        <div className="flex items-center gap-3">
          <Label htmlFor="month" className="text-sm">
            Mês
          </Label>
          <Input
            id="month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-42.5"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Entradas"
          value={summary ? money(summary.income) : "—"}
        />
        <StatCard
          title="Saídas"
          value={summary ? money(summary.expense) : "—"}
        />
        <StatCard
          title="Saldo do mês"
          value={summary ? money(summary.balance_month) : "—"}
        />
        <StatCard
          title="Saldo total"
          value={summary ? money(summary.balance_total) : "—"}
        />
      </section>

      <Separator />

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Últimas transações</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {loading && recent.length === 0 ? (
              <div className="text-sm text-muted-foreground">Carregando…</div>
            ) : recent.length === 0 ? (
              <EmptyState
                title="Sem transações ainda"
                description="Crie uma transação na aba Transações para preencher seu histórico."
                action={
                  <Button asChild className="rounded-lg">
                    <a href="/transactions">Ir para Transações</a>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-2">
                {recent.map((t) => (
                  <div key={t.id} className="rounded-xl border bg-card p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge type={t.type} />
                      <span className="text-sm font-semibold">
                        {money(t.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.date}
                      </span>
                    </div>

                    <div className="mt-1 text-sm text-muted-foreground">
                      {t.category_name ?? "Sem categoria"}
                      {t.description ? ` • ${t.description}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top categorias (saídas)</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {!summary ? (
              <div className="text-sm text-muted-foreground">—</div>
            ) : topOutCategories.length === 0 ? (
              <EmptyState
                title="Nada para analisar ainda"
                description="Quando você tiver saídas categorizadas, o top aparecerá aqui."
              />
            ) : (
              <div className="space-y-3">
                {topOutCategories.map((x) => {
                  const pct = maxTop > 0 ? (x.total / maxTop) * 100 : 0;
                  return (
                    <div key={x.name} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">{x.name}</span>
                        <span className="text-sm font-semibold">
                          {money(x.total)}
                        </span>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-[width]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                <p className="text-xs text-muted-foreground">
                  (Barra relativa ao maior gasto do mês)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
