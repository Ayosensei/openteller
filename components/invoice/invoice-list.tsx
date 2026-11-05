"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Input, Label, SearchField } from "react-aria-components";

import { SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { InvoiceStatus } from "@/lib/domain/invoice";

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  clientName: string;
  dueAt: string;
  status: InvoiceStatus;
  amount: string;
}

const statuses: Array<"all" | InvoiceStatus> = [
  "all",
  "open",
  "pending",
  "paid",
  "underpaid",
  "refunded",
  "void",
];

export function InvoiceList({ rows }: { rows: readonly InvoiceRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | InvoiceStatus>("all");
  const [visibleCount, setVisibleCount] = useState(25);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return rows.filter((row) => {
      const matchesStatus = status === "all" || row.status === status;
      const matchesSearch =
        !normalized ||
        row.clientName.toLocaleLowerCase().includes(normalized) ||
        row.invoiceNumber.toLocaleLowerCase().includes(normalized);
      return matchesStatus && matchesSearch;
    });
  }, [query, rows, status]);

  function resetFilters(nextStatus: "all" | InvoiceStatus = status) {
    setStatus(nextStatus);
    setVisibleCount(25);
  }

  return (
    <section className="invoice-list-section" aria-label="Invoice records">
      <div className="invoice-filters">
        <SearchField
          className="invoice-search"
          value={query}
          onChange={(value) => {
            setQuery(value);
            setVisibleCount(25);
          }}
        >
          <Label>Search invoices</Label>
          <div><SearchIcon size={20} /><Input placeholder="Client or invoice number" /></div>
        </SearchField>
        <div className="status-filters" aria-label="Filter by status">
          {statuses.map((value) => (
            <Button
              key={value}
              variant="secondary"
              aria-pressed={status === value}
              onPress={() => resetFilters(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-filter">
          <h2>Nothing matches this view.</h2>
          <p>Try another status or clear your search.</p>
          <Button variant="ghost" onPress={() => { setQuery(""); resetFilters("all"); }}>Clear filters</Button>
        </div>
      ) : (
        <>
          <div className="invoice-table-wrap">
            <table className="invoice-table">
              <thead><tr><th>Invoice</th><th>Client</th><th>Due</th><th>Status</th><th>Amount</th></tr></thead>
              <tbody>
                {filtered.slice(0, visibleCount).map((invoice) => (
                  <tr key={invoice.id}>
                    <td><Link href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link></td>
                    <td>{invoice.clientName}</td>
                    <td><time dateTime={invoice.dueAt}>{invoice.dueAt}</time></td>
                    <td><span className={`status-pill status-pill--${invoice.status}`}>{invoice.status}</span></td>
                    <td>{invoice.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="invoice-card-list">
            {filtered.slice(0, visibleCount).map((invoice) => (
              <Link className="invoice-card" href={`/invoices/${invoice.id}`} key={invoice.id}>
                <span>{invoice.invoiceNumber}</span><span className={`status-pill status-pill--${invoice.status}`}>{invoice.status}</span>
                <strong>{invoice.clientName}</strong>
                <span>Due {invoice.dueAt}</span><span>{invoice.amount}</span>
              </Link>
            ))}
          </div>
          {visibleCount < filtered.length ? (
            <Button variant="secondary" onPress={() => setVisibleCount((count) => count + 25)}>Show more</Button>
          ) : null}
        </>
      )}
    </section>
  );
}
