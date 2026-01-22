import { useMemo, useState } from "react";
import Modal from "@/components/Modals/Modal";
import { api } from "@/services/api";
import type { Category } from "@/@types/types";

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
      // DRF costuma mandar { name: ["..."] } ou detail
      const msg =
        e?.response?.data?.name?.[0] ??
        e?.response?.data?.detail ??
        "Não foi possível criar a categoria.";
      setError(String(msg));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Nova categoria"
      onClose={() => {
        if (!saving) onClose();
      }}
      footer={
        <>
          <button style={btn} onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button style={btnPrimary} onClick={save} disabled={!canSave}>
            {saving ? "Salvando…" : "Criar"}
          </button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Nome</span>
          <input
            autoFocus
            placeholder="Ex: Alimentação"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />
        </label>

        {error ? (
          <div
            style={{
              color: "#991b1b",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              padding: 10,
            }}
          >
            {error}
          </div>
        ) : null}

        <div style={{ color: "#666", fontSize: 13 }}>
          Dica: use nomes curtos e consistentes (ex: “Casa”, “Mercado”,
          “Transporte”).
        </div>
      </div>
    </Modal>
  );
}
