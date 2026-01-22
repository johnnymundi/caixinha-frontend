import type { TxType } from "@/@types/types";

export default function Badge({ type }: { type: TxType }) {
  const isIn = type === "IN";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        border: "1px solid",
        borderColor: isIn ? "#bbf7d0" : "#fecaca",
        background: isIn ? "#dcfce7" : "#fee2e2",
        color: isIn ? "#166534" : "#991b1b",
        whiteSpace: "nowrap",
      }}
      title={isIn ? "Entrada" : "Saída"}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: isIn ? "#22c55e" : "#ef4444",
        }}
      />
      {isIn ? "Entrada" : "Saída"}
    </span>
  );
}
