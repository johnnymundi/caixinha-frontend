import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Category } from "@/@types/types";
import CreateCategoryModal from "@/components/Modals/CreateCategoryModal";
import ConfirmDialog from "@/components/Modals/ConfirmDialog";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function unwrapResults<T>(data: any): T[] {
  return Array.isArray(data) ? data : (data?.results ?? []);
}

export default function CategoryPage({
  onSelectCategoryId,
}: {
  onSelectCategoryId?: (id: number) => void;
}) {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/categories/");
      setCats(unwrapResults<Category>(res.data));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteCategory() {
    if (!catToDelete) return;
    setDeleting(true);

    try {
      await api.delete(`/categories/${catToDelete.id}/`);
      toast.success("Categoria excluída", {
        description: `A categoria "${catToDelete.name}" foi removida.`,
      });

      setCats((prev) => prev.filter((c) => c.id !== catToDelete.id));
      setConfirmOpen(false);
      setCatToDelete(null);
    } catch (e: any) {
      const msg = e?.response?.data?.detail ?? "Não foi possível excluir.";
      toast.error("Erro ao excluir", { description: String(msg) });
    } finally {
      setDeleting(false);
    }
  }

  const handleDelete = (c: Category) => {
    if (c.name === "Outros") {
      toast.error("Não é possível excluir!", {
        description: "A categoria 'Outros' não pode ser removida.",
      });
      return;
    }
    setCatToDelete(c);
    setConfirmOpen(true);
  };

  return (
    <div className="space-y-4">
      <CreateCategoryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(cat) => {
          setCats((prev) =>
            [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)),
          );
          toast.success("Categoria criada", { description: cat.name });
          onSelectCategoryId?.(cat.id);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir categoria?"
        description={
          catToDelete
            ? `Você vai excluir "${catToDelete.name}". As transações dessa categoria serão movidas para "Outros".`
            : undefined
        }
        confirmText="Excluir"
        onClose={() => {
          if (!deleting) {
            setConfirmOpen(false);
            setCatToDelete(null);
          }
        }}
        onConfirm={deleteCategory}
        busy={deleting}
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Categorias</CardTitle>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => setCreateOpen(true)}
              >
                + Categoria
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={load}
              >
                Recarregar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Carregando…</div>
          ) : cats.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Sem categorias ainda.
            </div>
          ) : (
            <>
              <Separator className="mb-3" />
              <ScrollArea className="h-130 pr-2">
                <div className="space-y-2">
                  {cats.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ID: {c.id}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {onSelectCategoryId ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-lg"
                            onClick={() => {
                              onSelectCategoryId(c.id);
                              toast.info("Categoria selecionada", {
                                description: c.name,
                              });
                            }}
                          >
                            Usar
                          </Button>
                        ) : null}

                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => handleDelete(c)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
