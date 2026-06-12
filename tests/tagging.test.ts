import { describe, expect, it } from 'vitest';
import { applyTagRules } from '../src/lib/tagging';

describe('applyTagRules', () => {
  it('adds tags when document text matches configured rules', () => {
    const tags = applyTagRules(
      {
        title: 'vendor-invoice.pdf',
        text: 'Invoice #A-102 Total $482.90 ACME Consulting paid by bank transfer'
      },
      [
        { id: 'invoice', label: 'Invoice', mode: 'any', terms: ['invoice', 'receipt'] },
        { id: 'paid', label: 'Paid', mode: 'all', terms: ['paid', 'bank transfer'] },
        { id: 'contract', label: 'Contract', mode: 'exact', terms: ['service agreement'] }
      ]
    );

    expect(tags).toEqual(['Invoice', 'Paid']);
  });

  it('supports regex rules for invoice numbers and tax IDs', () => {
    const tags = applyTagRules(
      { title: 'scan.png', text: 'VAT ID 12-3456789 invoice A-102' },
      [{ id: 'tax', label: 'Tax', mode: 'regex', terms: ['\\d{2}-\\d{7}'] }]
    );

    expect(tags).toEqual(['Tax']);
  });
});
