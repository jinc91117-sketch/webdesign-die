export type TagRuleMode = 'any' | 'all' | 'exact' | 'regex';

export interface TagRule {
  id: string;
  label: string;
  mode: TagRuleMode;
  terms: string[];
}

export interface DocumentRecord {
  id: string;
  title: string;
  text: string;
  tags: string[];
  createdAt: string;
  mimeType: string;
  pageCount?: number;
}

export interface UploadResult {
  text: string;
  pageCount?: number;
}
