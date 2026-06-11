import { describe, expect, it } from 'vitest';
import { buildAnonymousIdentity, findPrivacyRisks } from '../src/community/privacy';
import type { CommunityPost, FeedFilters } from '../src/community/types';
import { createCommunityPost, filterPosts, getProfilePosts } from '../src/community/posts';

const samplePosts: CommunityPost[] = [
  {
    id: 'older',
    type: 'rebirth',
    title: 'UX route',
    body: 'From studio to UX',
    authorId: 'u1',
    tags: ['UX'],
    status: 'rebirthing',
    transitionDirection: 'ux',
    reactions: { resonance: 1, thanks: 0, saves: 0, asks: 0 },
    commentCount: 2,
    usefulScore: 10,
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z'
  },
  {
    id: 'newer',
    type: 'help',
    title: 'Need privacy help',
    body: 'How do I anonymize a portfolio?',
    authorId: 'u2',
    tags: ['隐私'],
    status: 'still-drafting',
    transitionDirection: 'undecided',
    reactions: { resonance: 9, thanks: 0, saves: 0, asks: 0 },
    commentCount: 4,
    usefulScore: 2,
    createdAt: '2026-06-10T00:00:00.000Z',
    updatedAt: '2026-06-10T00:00:00.000Z'
  }
];

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

  it('uses the fallback codename when building ids for blank identities', () => {
    const identity = buildAnonymousIdentity('   ', 'rebirthing');

    expect(identity.codename).toBe('ANON-0000');
    expect(identity.id).toBe('local-anon-0000');
  });

  it('flags text that appears to include identifying contact or institution details', () => {
    const risks = findPrivacyRisks('我的学校是某某大学，邮箱是 test@example.com，电话 13800000000');

    expect(risks).toEqual(['学校/机构', '邮箱', '手机号']);
  });
});

describe('community post helpers', () => {
  it('filters by type, status, direction, and query', () => {
    const filters: FeedFilters = {
      type: 'rebirth',
      status: 'rebirthing',
      direction: 'ux',
      sort: 'latest',
      query: 'studio'
    };

    expect(filterPosts(samplePosts, filters).map((post) => post.id)).toEqual(['older']);
  });

  it('sorts by resonance', () => {
    const filters: FeedFilters = {
      type: 'all',
      status: 'all',
      direction: 'all',
      sort: 'resonance',
      query: ''
    };

    expect(filterPosts(samplePosts, filters).map((post) => post.id)).toEqual(['newer', 'older']);
  });

  it('creates a post with quiet social counters initialized', () => {
    const post = createCommunityPost(
      {
        type: 'help',
        title: 'How to leave safely?',
        body: 'I need a route.',
        tags: ['求助'],
        status: 'rebirthing',
        transitionDirection: 'product'
      },
      'u1',
      '2026-06-12T00:00:00.000Z'
    );

    expect(post.authorId).toBe('u1');
    expect(post.reactions).toEqual({ resonance: 0, thanks: 0, saves: 0, asks: 0 });
    expect(post.commentCount).toBe(0);
  });

  it('returns posts for an anonymous profile newest first', () => {
    expect(getProfilePosts(samplePosts, 'u2').map((post) => post.id)).toEqual(['newer']);
  });
});
