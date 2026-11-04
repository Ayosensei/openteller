import { TriangleIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

function SectionLabel({ children }: { children: string }) {
  return <p className="section-label"><TriangleIcon />{children}</p>;
}

function ExampleSlab() {
  return (
    <aside className="proof-slab" aria-label="Example payment proof">
      <span className="example-chip">EXAMPLE</span>
      <div className="proof-zone">
        <span className="proof-label">FROM THE CLIENT</span>
        <strong className="proof-amount">1,250.00</strong>
        <span className="proof-unit">USDC VALUE</span>
      </div>
      <div className="proof-rule" aria-hidden="true" />
      <div className="proof-zone">
        <span className="proof-label">FREELANCER RECEIVES</span>
        <strong className="proof-amount">—</strong>
        <span className="proof-unit">AWAITING VERIFIED PAYMENT</span>
      </div>
    </aside>
  );
}

export default function Home() {
  return (
    <main className="landing-shell">
      <header className="landing-bar">
        <span className="wordmark">openteller</span>
        <Button isDisabled aria-describedby="build-status">Create an invoice</Button>
      </header>

      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="hero-copy">
          <SectionLabel>REAL-WORLD MONEY / INVOICING</SectionLabel>
          <h1 id="landing-title">An invoice that shows where the money went.</h1>
          <p className="hero-lead">Preview how Openteller will bill in USDC and preserve a verified record of what a client sends and a freelancer receives.</p>
          <div className="hero-actions">
            <Button isDisabled aria-describedby="build-status">Create an invoice</Button>
            <a className="text-link" href="#how-it-works">See how it works</a>
          </div>
          <p id="build-status" className="build-status" role="status">Invoice creation and live payments are not enabled yet.</p>
        </div>
        <ExampleSlab />
      </section>

      <Reveal>
        <section id="how-it-works" className="landing-section">
          <SectionLabel>FROM INVOICE TO PROOF</SectionLabel>
          <h2>One record, from request to receipt.</h2>
          <ol className="steps-grid">
            <li><span>01</span><h3>Create the invoice</h3><p>Set the work, amount, due date and receiving account.</p></li>
            <li><span>02</span><h3>Your client pays</h3><p>They use a supported crypto route with their own wallet.</p></li>
            <li><span>03</span><h3>Keep the trail</h3><p>Verified source and destination evidence stays with the invoice.</p></li>
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section className="landing-section">
          <SectionLabel>WHAT THE RECORD INCLUDES</SectionLabel>
          <h2>Useful evidence, without invented details.</h2>
          <div className="example-tape">
            <span className="example-chip example-chip--light">EXAMPLE</span>
            <dl>
              <div><dt>Invoice</dt><dd>OT-EXAMPLE</dd></div>
              <div><dt>Status</dt><dd>OPEN</dd></div>
              <div><dt>Sent</dt><dd>BLANK UNTIL VERIFIED</dd></div>
              <div><dt>Received</dt><dd>BLANK UNTIL VERIFIED</dd></div>
            </dl>
          </div>
        </section>
      </Reveal>

      <section className="final-band">
        <div><SectionLabel>OPENTELLER</SectionLabel><h2>Build the invoice. Keep the payment trail.</h2></div>
        <Button variant="inverse" isDisabled aria-describedby="build-status">Create an invoice</Button>
      </section>

      <footer className="landing-footer">
        <span className="wordmark">openteller</span>
        <span>Hackathon implementation in progress.</span>
      </footer>
    </main>
  );
}
