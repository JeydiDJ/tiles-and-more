type DataTableProps = {
  title: string;
  rows: string[];
};

export function DataTable({ title, rows }: DataTableProps) {
  return (
    <div>
      {title ? <h3 className="text-lg font-semibold">{title}</h3> : null}
      <ul className={`${title ? "mt-4" : "mt-3"} grid gap-0 text-sm text-[var(--muted)]`}>
        {rows.map((row) => (
          <li key={row} className="border-b border-[var(--border)] px-0 py-4">
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}
