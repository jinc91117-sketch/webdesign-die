import type { DocumentRecord } from './types';

const storageKey = 'ocr-document-library-demo.documents';

export function loadDocuments(): DocumentRecord[] {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as DocumentRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveDocuments(documents: DocumentRecord[]): void {
  localStorage.setItem(storageKey, JSON.stringify(documents));
}
