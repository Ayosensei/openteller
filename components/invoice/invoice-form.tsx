"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  FieldError,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
} from "react-aria-components";

import { PlusIcon, TrashIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  calculateLineMinor,
  formatUsdcMinor,
  parseQuantity,
  parseUsdcMinor,
} from "@/lib/money/invoice";
import {
  createInvoice,
  initialInvoiceFormState,
} from "@/app/(freelancer)/invoices/new/actions";

interface EditableItem {
  key: number;
  description: string;
  quantity: string;
  unitPrice: string;
}

export function InvoiceForm({
  receivingAccount,
  submissionKey,
}: {
  receivingAccount: string;
  submissionKey: string;
}) {
  const [state, formAction, pending] = useActionState(
    createInvoice,
    initialInvoiceFormState,
  );
  const [items, setItems] = useState<EditableItem[]>([
    { key: 0, description: "", quantity: "1", unitPrice: "" },
  ]);
  const nextKey = useRef(1);
  const descriptionRefs = useRef(new Map<number, HTMLInputElement>());

  const previewTotal = useMemo(() => {
    try {
      return items.reduce((sum, item) => {
        const quantity = parseQuantity(item.quantity);
        const price = parseUsdcMinor(item.unitPrice);
        return sum + calculateLineMinor(quantity.value, quantity.scale, price);
      }, 0n);
    } catch {
      return null;
    }
  }, [items]);

  function updateItem(key: number, patch: Partial<EditableItem>) {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    if (items.length >= 20) return;
    const key = nextKey.current;
    nextKey.current += 1;
    setItems((current) => [
      ...current,
      { key, description: "", quantity: "1", unitPrice: "" },
    ]);
    requestAnimationFrame(() => descriptionRefs.current.get(key)?.focus());
  }

  function removeItem(key: number) {
    if (items.length === 1) return;
    setItems((current) => current.filter((item) => item.key !== key));
  }

  return (
    <div className="invoice-create-grid">
      <Form action={formAction} className="invoice-form" validationBehavior="native">
        <input type="hidden" name="submissionKey" value={submissionKey} />
        <input type="hidden" name="itemCount" value={items.length} />

        {state.message ? <p className="error-banner" role="alert">{state.message}</p> : null}

        <fieldset className="form-section">
          <legend>CLIENT</legend>
          <TextField
            className="form-field"
            name="clientName"
            isRequired
            isInvalid={Boolean(state.errors.clientName)}
          >
            <Label>Client name</Label>
            <Input maxLength={120} />
            <FieldError>{state.errors.clientName}</FieldError>
          </TextField>
        </fieldset>

        <fieldset className="form-section">
          <legend>INVOICE</legend>
          <div className="date-grid">
            <TextField className="form-field" name="issuedAt" type="date" isRequired isInvalid={Boolean(state.errors.issuedAt)}>
              <Label>Issue date</Label><Input /><FieldError>{state.errors.issuedAt}</FieldError>
            </TextField>
            <TextField className="form-field" name="dueAt" type="date" isRequired isInvalid={Boolean(state.errors.dueAt)}>
              <Label>Due date</Label><Input /><FieldError>{state.errors.dueAt}</FieldError>
            </TextField>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>LINE ITEMS</legend>
          <div className="line-items">
            {items.map((item, index) => (
              <div className="line-item" key={item.key}>
                <TextField className="form-field line-item__description" name={`items.${index}.description`} isRequired isInvalid={Boolean(state.errors[`items.${index}.description`])}>
                  <Label>Description</Label>
                  <Input
                    ref={(node) => {
                      if (node) descriptionRefs.current.set(item.key, node);
                      else descriptionRefs.current.delete(item.key);
                    }}
                    maxLength={200}
                    value={item.description}
                    onChange={(event) => updateItem(item.key, { description: event.target.value })}
                  />
                  <FieldError>{state.errors[`items.${index}.description`]}</FieldError>
                </TextField>
                <TextField className="form-field" name={`items.${index}.quantity`} isRequired isInvalid={Boolean(state.errors[`items.${index}.amount`])}>
                  <Label>Quantity</Label>
                  <Input inputMode="decimal" value={item.quantity} onChange={(event) => updateItem(item.key, { quantity: event.target.value })} />
                </TextField>
                <TextField className="form-field" name={`items.${index}.unitPrice`} isRequired isInvalid={Boolean(state.errors[`items.${index}.amount`])}>
                  <Label>Unit price (USDC)</Label>
                  <Input inputMode="decimal" value={item.unitPrice} onChange={(event) => updateItem(item.key, { unitPrice: event.target.value })} />
                  <FieldError>{state.errors[`items.${index}.amount`]}</FieldError>
                </TextField>
                <Button variant="ghost" className="icon-button" aria-label={`Remove line item ${index + 1}`} isDisabled={items.length === 1} onPress={() => removeItem(item.key)}>
                  <TrashIcon size={16} />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" isDisabled={items.length >= 20} onPress={addItem}>
            <PlusIcon size={16} />Add line item
          </Button>
        </fieldset>

        <fieldset className="form-section">
          <legend>NOTES</legend>
          <TextField className="form-field" name="notes" isInvalid={Boolean(state.errors.notes)}>
            <Label>Notes (optional)</Label>
            <TextArea maxLength={500} rows={5} />
            <FieldError>{state.errors.notes}</FieldError>
          </TextField>
        </fieldset>

        <fieldset className="form-section">
          <legend>PAYMENT DESTINATION</legend>
          <TextField className="form-field" isReadOnly>
            <Label>NEAR account</Label>
            <Input value={receivingAccount} readOnly />
          </TextField>
          <p className="form-help">Invoices request USDC for this verified mainnet account.</p>
        </fieldset>

        <div className="form-footer">
          <Link className="button button--ghost" href="/invoices">Cancel</Link>
          <Button type="submit" isDisabled={pending} isPending={pending}>Create invoice</Button>
        </div>
      </Form>

      <aside className="invoice-summary" aria-label="Invoice summary preview">
        <p className="section-label">INVOICE SUMMARY</p>
        <dl>
          <div><dt>Line items</dt><dd>{items.length}</dd></div>
          <div><dt>Total</dt><dd>{previewTotal === null ? "—" : `${formatUsdcMinor(previewTotal)} USDC`}</dd></div>
          <div><dt>Receives to</dt><dd>{receivingAccount}</dd></div>
        </dl>
        <p>Preview only. This is not a receipt or payment confirmation.</p>
      </aside>
    </div>
  );
}
