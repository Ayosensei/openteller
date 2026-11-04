export default function Home() {
  return (
    <main className="page-shell">
      <header className="starter-bar">
        <span className="wordmark">openteller</span>
        <span className="starter-label">IMPLEMENTATION STARTER</span>
      </header>
      <section className="starter-content" aria-labelledby="starter-title">
        <p className="starter-label">REAL-WORLD MONEY / INVOICING</p>
        <h1 id="starter-title">An invoice that shows where the money went.</h1>
        <p className="starter-lead">
          Bill in USDC. Let a client pay with a supported crypto asset. Keep a
          record of what they sent and what you received.
        </p>
        <p className="starter-notice" role="status">
          Live payments are not enabled in this implementation baseline.
        </p>
      </section>
    </main>
  );
}
