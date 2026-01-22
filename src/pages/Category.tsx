import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Category } from "@/@types//types";
import CreateCategoryModal from "@/components/Modals/CreateCategoryModal";
import ConfirmDialog from "@/components/Modals/ConfirmDialog";
import { toast } from "sonner";

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

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e5e5",
  background: "#fff",
  cursor: "pointer",
};

const btnDanger: React.CSSProperties = {
  ...btn,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
};

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
    } else {
      setCatToDelete(c);
      setConfirmOpen(true);
    }
  };

  return (
    <div style={panel} className="p-2">
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0 }}>Categorias</h3>
        <button style={btn} onClick={() => setCreateOpen(true)}>
          + Categoria
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        {loading ? (
          <div style={{ color: "#666" }}>Carregando…</div>
        ) : cats.length === 0 ? (
          <div style={{ color: "#666" }}>Sem categorias ainda.</div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {cats.map((c) => (
              <div key={c.id} style={row}>
                <div style={{ display: "grid" }}>
                  <b>{c.name}</b>
                  <span style={{ color: "#666", fontSize: 12 }}>
                    ID: {c.id}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {onSelectCategoryId ? (
                    <button
                      style={btn}
                      onClick={() => {
                        onSelectCategoryId(c.id);
                        toast.info("Categoria selecionada", {
                          description: c.name,
                        });
                      }}
                    >
                      Usar
                    </button>
                  ) : null}

                  <button style={btnDanger} onClick={() => handleDelete(c)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        <button style={btn} onClick={load}>
          Recarregar
        </button>
      </div>
    </div>
  );
}
