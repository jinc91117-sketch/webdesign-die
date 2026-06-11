import type { CommunityUser, UserStatus } from './types';

const privacyPatterns: Array<[label: string, pattern: RegExp]> = [
  ['学校/机构', /(大学|学院|学校|公司|事务所|设计院|集团)/],
  ['邮箱', /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],
  ['手机号', /1[3-9]\d{9}/]
];

export function buildAnonymousIdentity(codename: string, status: UserStatus): CommunityUser {
  const normalizedCodename = codename.trim() || 'ANON-0000';

  return {
    id: `local-${normalizedCodename.toLowerCase().replace(/\s+/g, '-')}`,
    codename: normalizedCodename,
    status,
    privacy: {
      showGraduationYear: false,
      showDirection: true,
      showContact: false
    }
  };
}

export function findPrivacyRisks(text: string): string[] {
  return privacyPatterns.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
}
