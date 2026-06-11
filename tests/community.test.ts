import { describe, expect, it } from 'vitest';
import { buildAnonymousIdentity, findPrivacyRisks } from '../src/community/privacy';

describe('community privacy helpers', () => {
  it('creates identities that hide sensitive fields by default', () => {
    const identity = buildAnonymousIdentity('A-0427', 'rebirthing');

    expect(identity.codename).toBe('A-0427');
    expect(identity.status).toBe('rebirthing');
    expect(identity.privacy).toEqual({
      showGraduationYear: false,
      showDirection: true,
      showContact: false
    });
  });

  it('flags text that appears to include identifying contact or institution details', () => {
    const risks = findPrivacyRisks('我的学校是某某大学，邮箱是 test@example.com，电话 13800000000');

    expect(risks).toEqual(['学校/机构', '邮箱', '手机号']);
  });
});
