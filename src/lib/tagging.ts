import type { TagRule } from './types';

interface TaggableDocument {
  title: string;
  text: string;
}

export const defaultTagRules: TagRule[] = [
  { id: 'invoice', label: 'Invoice', mode: 'any', terms: ['invoice', 'receipt', '发票', '收据', '报销'] },
  { id: 'contract', label: 'Contract', mode: 'any', terms: ['contract', 'agreement', '合同', '协议'] },
  { id: 'tax', label: 'Tax', mode: 'regex', terms: ['\\b\\d{2}-\\d{7}\\b', '税号', '统一社会信用代码'] },
  { id: 'paid', label: 'Paid', mode: 'any', terms: ['paid', 'payment received', '已付款', '银行转账'] }
];

export function applyTagRules(document: TaggableDocument, rules: TagRule[]): string[] {
  const haystack = `${document.title}\n${document.text}`.toLowerCase();

  return rules
    .filter((rule) => {
      const terms = rule.terms.map((term) => term.trim()).filter(Boolean);

      if (terms.length === 0) {
        return false;
      }

      if (rule.mode === 'any') {
        return terms.some((term) => haystack.includes(term.toLowerCase()));
      }

      if (rule.mode === 'all') {
        return terms.every((term) => haystack.includes(term.toLowerCase()));
      }

      if (rule.mode === 'exact') {
        return terms.some((term) => haystack === term.toLowerCase());
      }

      return terms.some((term) => {
        try {
          return new RegExp(term, 'i').test(haystack);
        } catch {
          return false;
        }
      });
    })
    .map((rule) => rule.label);
}
