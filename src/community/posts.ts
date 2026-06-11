import type { CommunityPost, DraftPostInput, FeedFilters } from './types';

export function filterPosts(posts: CommunityPost[], filters: FeedFilters): CommunityPost[] {
  const query = filters.query.trim().toLowerCase();

  return posts
    .filter((post) => filters.type === 'all' || post.type === filters.type)
    .filter((post) => filters.status === 'all' || post.status === filters.status)
    .filter((post) => filters.direction === 'all' || post.transitionDirection === filters.direction)
    .filter((post) => {
      if (!query) {
        return true;
      }

      return [post.title, post.body, post.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => comparePosts(a, b, filters.sort));
}

export function createCommunityPost(
  input: DraftPostInput,
  authorId: string,
  now = new Date().toISOString()
): CommunityPost {
  return {
    id: `local-${crypto.randomUUID()}`,
    ...input,
    authorId,
    reactions: { resonance: 0, thanks: 0, saves: 0, asks: 0 },
    commentCount: 0,
    usefulScore: 0,
    createdAt: now,
    updatedAt: now
  };
}

export function getProfilePosts(posts: CommunityPost[], authorId: string): CommunityPost[] {
  return posts
    .filter((post) => post.authorId === authorId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function comparePosts(a: CommunityPost, b: CommunityPost, sort: FeedFilters['sort']): number {
  if (sort === 'resonance') {
    return b.reactions.resonance - a.reactions.resonance;
  }

  if (sort === 'discussion') {
    return b.commentCount - a.commentCount;
  }

  if (sort === 'useful') {
    return b.usefulScore - a.usefulScore;
  }

  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}
