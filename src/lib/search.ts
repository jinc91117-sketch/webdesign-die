import Fuse from 'fuse.js';
import type { DocumentRecord } from './types';

export function searchDocuments(documents: DocumentRecord[], query: string): DocumentRecord[] {
  const normalizedQuery = query.trim();
  const newestFirst = [...documents].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );

  if (!normalizedQuery) {
    return newestFirst;
  }

  const fuse = new Fuse(newestFirst, {
    keys: [
      { name: 'title', weight: 0.35 },
      { name: 'tags', weight: 0.25 },
      { name: 'text', weight: 0.4 }
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2
  });

  return fuse.search(normalizedQuery).map((result) => result.item);
}
