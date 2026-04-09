type DataTableProps = {
  title: string;
  rows: string[];
};

export function DataTable({ title, rows }: DataTableProps) {
  return (
    <div className="surface-card rounded-md p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
        {rows.map((row) => (
          <li key={row} className="rounded-sm border border-[var(--border)] bg-white px-4 py-3">
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}
