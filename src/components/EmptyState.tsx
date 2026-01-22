export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px dashed #ddd",
        borderRadius: 14,
        padding: 16,
        background: "#fafafa",
        display: "grid",
        gap: 6,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 14 }}>{title}</div>
      {description ? (
        <div style={{ color: "#666", fontSize: 13 }}>{description}</div>
      ) : null}
      {action ? <div style={{ marginTop: 6 }}>{action}</div> : null}
    </div>
  );
}
