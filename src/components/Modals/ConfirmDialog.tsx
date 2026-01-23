import Modal from "@/components/Modals/Modal";
import { Button } from "../ui/button";

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

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
  busy,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={() => {
        if (!busy) onClose();
      }}
      footer={
        <>
          <Button onClick={onClose} disabled={busy}>
            {cancelText}
          </Button>
          <Button variant={"destructive"} onClick={onConfirm} disabled={busy}>
            {busy ? "Aguarde…" : confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ color: "#333" }}>
          {description ?? "Tem certeza? Essa ação não pode ser desfeita."}
        </div>
      </div>
    </Modal>
  );
}
