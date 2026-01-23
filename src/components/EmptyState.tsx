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
    <div className="grid gap-2 rounded-xl border border-dashed bg-muted/30 p-4">
      <div className="text-sm font-semibold">{title}</div>

      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}

      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
