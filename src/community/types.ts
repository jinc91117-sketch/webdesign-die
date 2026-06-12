export type PostType = 'rebirth' | 'relic' | 'night-room' | 'route-map' | 'help';

export type UserStatus =
  | 'still-drafting'
  | 'rebirthing'
  | 'left-architecture'
  | 'on-site'
  | 'product-bound'
  | 'game-art'
  | 'freelance'
  | 'temporarily-offline';

export type TransitionDirection =
  | 'ux'
  | 'product'
  | 'game-art'
  | 'visualization'
  | 'curation'
  | 'development'
  | 'construction'
  | 'real-estate'
  | 'undecided';

export type SortMode = 'latest' | 'resonance' | 'discussion' | 'useful';

export interface CommunityUser {
  id: string;
  codename: string;
  status: UserStatus;
  graduationYear?: number;
  formerFocus?: string;
  transitionDirection?: TransitionDirection;
  publicBio?: string;
  privacy: {
    showGraduationYear: boolean;
    showDirection: boolean;
    showContact: boolean;
  };
}

export interface CommentRecord {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface ReactionCounts {
  resonance: number;
  thanks: number;
  saves: number;
  asks: number;
}

export interface CommunityPost {
  id: string;
  type: PostType;
  title: string;
  body: string;
  deathCause?: string;
  mentalDeathMoment?: string;
  authorId: string;
  tags: string[];
  status: UserStatus;
  transitionDirection?: TransitionDirection;
  graduationYear?: number;
  coverImage?: string;
  resourceLinks?: string[];
  reactions: ReactionCounts;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  usefulScore: number;
}

export interface FeedFilters {
  type: 'all' | PostType;
  status: 'all' | UserStatus;
  direction: 'all' | TransitionDirection;
  sort: SortMode;
  query: string;
}

export interface DraftPostInput {
  type: PostType;
  title: string;
  body: string;
  deathCause?: string;
  mentalDeathMoment?: string;
  tags: string[];
  status: UserStatus;
  transitionDirection?: TransitionDirection;
  graduationYear?: number;
  coverImage?: string;
  resourceLinks?: string[];
}
