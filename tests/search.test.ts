import { describe, expect, it } from 'vitest';
import { searchDocuments } from '../src/lib/search';

describe('searchDocuments', () => {
  it('finds documents by OCR text, title, and tags', () => {
    const results = searchDocuments(
      [
        {
          id: '1',
          title: 'ACME receipt',
          text: 'Lunch receipt paid by card',
          tags: ['Receipt'],
          createdAt: '2026-06-09T00:00:00.000Z',
          mimeType: 'image/png'
        },
        {
          id: '2',
          title: 'Q2 master services agreement',
          text: 'Contract with indemnity clause',
          tags: ['Contract'],
          createdAt: '2026-06-09T00:00:00.000Z',
          mimeType: 'application/pdf'
        }
      ],
      'indemnity'
    );

    expect(results.map((document) => document.id)).toEqual(['2']);
  });

  it('returns newest documents first when the query is empty', () => {
    const results = searchDocuments(
      [
        {
          id: 'old',
          title: 'Old',
          text: '',
          tags: [],
          createdAt: '2026-06-08T00:00:00.000Z',
          mimeType: 'image/png'
        },
        {
          id: 'new',
          title: 'New',
          text: '',
          tags: [],
          createdAt: '2026-06-09T00:00:00.000Z',
          mimeType: 'image/png'
        }
      ],
      ''
    );

    expect(results.map((document) => document.id)).toEqual(['new', 'old']);
  });
});
