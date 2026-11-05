import { TriangleIcon } from "@/components/icons";

export default function ExportsPage() {
  return (
    <main className="app-content">
      <header className="page-header">
        <div>
          <p className="section-label"><TriangleIcon />EXPORTS</p>
          <h1>Export your records</h1>
        </div>
      </header>
      <p className="page-lead">CSV export will be enabled after verified payment records are implemented.</p>
    </main>
  );
}
