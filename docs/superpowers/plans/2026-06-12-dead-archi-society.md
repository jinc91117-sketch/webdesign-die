# Dead Archi Society Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a front-end interactive prototype of the anonymous Dead Archi Society forum with login, feed filters, post creation, post detail, and privacy-preserving profile pages.

**Architecture:** Replace the current OCR demo UI with a focused React app driven by typed mock community data and local UI state. Keep domain logic in small `src/community/*` modules so filters, identity defaults, and privacy checks can be tested without rendering the whole app.

**Tech Stack:** Vite, React 19, TypeScript, lucide-react, Vitest, Testing Library, localStorage for prototype persistence.

---

## File Structure

- Create `src/community/types.ts`: shared types for users, posts, comments, reactions, filters, statuses, and post categories.
- Create `src/community/mockData.ts`: realistic anonymous seed users, posts, comments, and status/category dictionaries.
- Create `src/community/privacy.ts`: privacy defaults and text scanning helpers for risky identity disclosures.
- Create `src/community/posts.ts`: pure functions for filtering, sorting, creating posts, and looking up detail/profile data.
- Create `tests/community.test.ts`: focused tests for filters, post creation, and privacy helpers.
- Replace `src/App.tsx`: top-level prototype state, routing-like view state, identity creation, feed, detail, compose, and profile panels.
- Replace `src/styles.css`: full visual system for the archive/refuge theme and responsive layout.
- Keep `src/main.tsx` unchanged.

## Task 1: Community Domain Types

**Files:**
- Create: `src/community/types.ts`
- Test: none yet

- [ ] **Step 1: Create community type definitions**

```ts
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
  tags: string[];
  status: UserStatus;
  transitionDirection?: TransitionDirection;
  graduationYear?: number;
  coverImage?: string;
  resourceLinks?: string[];
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run build`

Expected: build fails later because the new file is unused only if existing app has unrelated type errors; otherwise typecheck passes.

- [ ] **Step 3: Commit**

```bash
git add src/community/types.ts
git commit -m "feat: add community domain types"
```

## Task 2: Community Dictionaries And Mock Data

**Files:**
- Create: `src/community/mockData.ts`
- Modify: `src/community/types.ts` only if a missing field is discovered
- Test: none yet

- [ ] **Step 1: Add labels and seed content**

```ts
import type { CommunityPost, CommunityUser, PostType, TransitionDirection, UserStatus } from './types';

export const postTypeLabels: Record<PostType, string> = {
  rebirth: '转生档案',
  relic: '遗物展柜',
  'night-room': '深夜画图室',
  'route-map': '路线图',
  help: '求助帖'
};

export const statusLabels: Record<UserStatus, string> = {
  'still-drafting': '仍在画图',
  rebirthing: '正在转生',
  'left-architecture': '已离开建筑',
  'on-site': '留在现场',
  'product-bound': '逃往产品',
  'game-art': '转向游戏美术',
  freelance: '成为自由职业者',
  'temporarily-offline': '暂时失联'
};

export const directionLabels: Record<TransitionDirection, string> = {
  ux: 'UX',
  product: '产品',
  'game-art': '游戏美术',
  visualization: '建筑可视化',
  curation: '策展',
  development: '前端/开发',
  construction: '施工现场',
  'real-estate': '地产',
  undecided: '还没想好'
};

export const seedUsers: CommunityUser[] = [
  {
    id: 'u-a0427',
    codename: 'A-0427',
    status: 'rebirthing',
    graduationYear: 2024,
    formerFocus: '城市更新',
    transitionDirection: 'ux',
    publicBio: '把剖面图改成用户旅程图的第 63 天。',
    privacy: { showGraduationYear: true, showDirection: true, showContact: false }
  },
  {
    id: 'u-section9',
    codename: 'SECTION-9',
    status: 'left-architecture',
    graduationYear: 2021,
    formerFocus: '公共建筑',
    transitionDirection: 'game-art',
    publicBio: '曾经渲染图，现在做关卡里的废墟。',
    privacy: { showGraduationYear: false, showDirection: true, showContact: false }
  },
  {
    id: 'u-basement',
    codename: 'B1-未完成',
    status: 'still-drafting',
    graduationYear: 2026,
    formerFocus: '居住区',
    transitionDirection: 'undecided',
    publicBio: '还在图纸里，但想知道门在哪里。',
    privacy: { showGraduationYear: false, showDirection: true, showContact: false }
  }
];

export const seedPosts: CommunityPost[] = [
  {
    id: 'p-001',
    type: 'rebirth',
    title: '从建筑作品集到 UX 作品集：我删掉了 70% 的图',
    body: '建筑训练给了我空间叙事和系统感，但面试官更想看问题、过程和结果。我把毕业设计拆成调研、假设、验证和交互原型，终于不再只解释一张漂亮总平面。',
    authorId: 'u-a0427',
    tags: ['UX', '作品集重做', '转行复盘'],
    status: 'rebirthing',
    transitionDirection: 'ux',
    graduationYear: 2024,
    reactions: { resonance: 128, thanks: 42, saves: 69, asks: 11 },
    commentCount: 18,
    usefulScore: 91,
    createdAt: '2026-06-10T18:20:00.000Z',
    updatedAt: '2026-06-10T18:20:00.000Z'
  },
  {
    id: 'p-002',
    type: 'relic',
    title: '未建成墓园 03：一个被我画到凌晨四点的图书馆',
    body: '它没有落地，也没有拿奖。但我还是想把它放在这里。模型里那条斜坡，是我当时相信公共空间会改变人的证据。',
    authorId: 'u-section9',
    tags: ['毕业设计', '公共建筑', '遗物展柜'],
    status: 'left-architecture',
    transitionDirection: 'game-art',
    graduationYear: 2021,
    coverImage: 'archive-library',
    reactions: { resonance: 203, thanks: 35, saves: 44, asks: 6 },
    commentCount: 27,
    usefulScore: 66,
    createdAt: '2026-06-09T22:10:00.000Z',
    updatedAt: '2026-06-09T22:10:00.000Z'
  },
  {
    id: 'p-003',
    type: 'night-room',
    title: '我不是不热爱建筑，我只是撑不住这种生活了',
    body: '今天改了第七版文本。老师说还缺一点“建筑性”。我突然不知道自己缺的是建筑性，还是睡眠。',
    authorId: 'u-basement',
    tags: ['匿名倾诉', '深夜画图室'],
    status: 'still-drafting',
    transitionDirection: 'undecided',
    reactions: { resonance: 319, thanks: 88, saves: 20, asks: 41 },
    commentCount: 54,
    usefulScore: 74,
    createdAt: '2026-06-11T01:18:00.000Z',
    updatedAt: '2026-06-11T01:18:00.000Z'
  },
  {
    id: 'p-004',
    type: 'route-map',
    title: '建筑生转产品的 30 天路线：先别急着学 Figma',
    body: '第一周理解岗位，第二周拆产品，第三周写案例，第四周做一个小项目。建筑背景不是废纸，但要翻译成产品语言。',
    authorId: 'u-a0427',
    tags: ['产品', '路线图', '方法'],
    status: 'product-bound',
    transitionDirection: 'product',
    resourceLinks: ['https://www.notion.so/'],
    reactions: { resonance: 96, thanks: 76, saves: 140, asks: 16 },
    commentCount: 21,
    usefulScore: 120,
    createdAt: '2026-06-08T12:00:00.000Z',
    updatedAt: '2026-06-08T12:00:00.000Z'
  },
  {
    id: 'p-005',
    type: 'help',
    title: '作品集里出现学校名和姓名，上传前怎么处理比较安全？',
    body: '想发遗物展柜，但我的 PDF 每页角落都有姓名和学校。大家一般怎么匿名化？',
    authorId: 'u-basement',
    tags: ['隐私', '作品集', '求助'],
    status: 'still-drafting',
    transitionDirection: 'undecided',
    reactions: { resonance: 45, thanks: 12, saves: 31, asks: 22 },
    commentCount: 9,
    usefulScore: 58,
    createdAt: '2026-06-07T09:30:00.000Z',
    updatedAt: '2026-06-07T09:30:00.000Z'
  }
];
```

- [ ] **Step 2: Run typecheck**

Run: `npm run build`

Expected: PASS or only unrelated pre-existing app errors.

- [ ] **Step 3: Commit**

```bash
git add src/community/mockData.ts src/community/types.ts
git commit -m "feat: seed anonymous community data"
```

## Task 3: Privacy Helpers And Tests

**Files:**
- Create: `src/community/privacy.ts`
- Create: `tests/community.test.ts`

- [ ] **Step 1: Write failing privacy tests**

```ts
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
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- tests/community.test.ts`

Expected: FAIL because `src/community/privacy.ts` does not exist.

- [ ] **Step 3: Implement privacy helpers**

```ts
import type { CommunityUser, UserStatus } from './types';

const privacyPatterns: Array<[label: string, pattern: RegExp]> = [
  ['邮箱', /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],
  ['手机号', /1[3-9]\d{9}/],
  ['学校/机构', /(大学|学院|学校|公司|事务所|设计院|集团)/]
];

export function buildAnonymousIdentity(codename: string, status: UserStatus): CommunityUser {
  return {
    id: `local-${codename.trim().toLowerCase().replace(/\s+/g, '-')}`,
    codename: codename.trim() || 'ANON-0000',
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
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- tests/community.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/community/privacy.ts tests/community.test.ts
git commit -m "feat: add anonymous privacy helpers"
```

## Task 4: Post Filtering, Sorting, And Creation

**Files:**
- Create: `src/community/posts.ts`
- Modify: `tests/community.test.ts`

- [ ] **Step 1: Add failing post logic tests**

```ts
import { describe, expect, it } from 'vitest';
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
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- tests/community.test.ts`

Expected: FAIL because `src/community/posts.ts` does not exist.

- [ ] **Step 3: Implement post helpers**

```ts
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

export function createCommunityPost(input: DraftPostInput, authorId: string, now = new Date().toISOString()): CommunityPost {
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
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- tests/community.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/community/posts.ts tests/community.test.ts
git commit -m "feat: add community post helpers"
```

## Task 5: App Shell And Anonymous Identity Flow

**Files:**
- Replace: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Replace `src/App.tsx` with the base app shell**

```tsx
import {
  Archive,
  BookOpen,
  EyeOff,
  FilePlus2,
  Filter,
  MessageCircle,
  Search,
  Shield,
  UserRound
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { directionLabels, postTypeLabels, seedPosts, seedUsers, statusLabels } from './community/mockData';
import { buildAnonymousIdentity } from './community/privacy';
import { filterPosts } from './community/posts';
import type { CommunityPost, CommunityUser, FeedFilters, PostType, TransitionDirection, UserStatus } from './community/types';

const defaultFilters: FeedFilters = {
  type: 'all',
  status: 'all',
  direction: 'all',
  sort: 'latest',
  query: ''
};

export function App() {
  const [users, setUsers] = useState<CommunityUser[]>(seedUsers);
  const [posts, setPosts] = useState<CommunityPost[]>(seedPosts);
  const [currentUser, setCurrentUser] = useState<CommunityUser>(seedUsers[0]);
  const [filters, setFilters] = useState<FeedFilters>(defaultFilters);
  const [selectedPostId, setSelectedPostId] = useState(seedPosts[0].id);
  const [profileUserId, setProfileUserId] = useState(seedUsers[0].id);

  const filteredPosts = useMemo(() => filterPosts(posts, filters), [posts, filters]);
  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? filteredPosts[0] ?? posts[0];
  const selectedAuthor = users.find((user) => user.id === selectedPost.authorId) ?? currentUser;
  const profileUser = users.find((user) => user.id === profileUserId) ?? currentUser;

  function updateFilter<Key extends keyof FeedFilters>(key: Key, value: FeedFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function createIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const identity = buildAnonymousIdentity(
      String(data.get('codename') ?? ''),
      String(data.get('status') ?? 'rebirthing') as UserStatus
    );
    setUsers((current) => [identity, ...current]);
    setCurrentUser(identity);
    setProfileUserId(identity.id);
    event.currentTarget.reset();
  }

  return (
    <main className="archiveShell">
      <aside className="leftRail" aria-label="社区导航">
        <div className="brandBlock">
          <Archive aria-hidden="true" />
          <div>
            <p className="archiveNo">ARCHIVE DAS-000</p>
            <h1>死去的建筑毕业生</h1>
            <span>Dead Archi Society</span>
          </div>
        </div>

        <nav className="sectionNav" aria-label="档案分区">
          {(Object.entries(postTypeLabels) as Array<[PostType, string]>).map(([type, label]) => (
            <button
              key={type}
              className={filters.type === type ? 'isActive' : ''}
              onClick={() => updateFilter('type', filters.type === type ? 'all' : type)}
            >
              <BookOpen aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <form className="identityCard" onSubmit={createIdentity}>
          <div className="panelTitle">
            <Shield aria-hidden="true" />
            <span>匿名身份</span>
          </div>
          <p>当前：{currentUser.codename} · {statusLabels[currentUser.status]}</p>
          <label>
            代号
            <input name="codename" placeholder="A-0427" />
          </label>
          <label>
            状态
            <select name="status" defaultValue="rebirthing">
              {(Object.entries(statusLabels) as Array<[UserStatus, string]>).map(([status, label]) => (
                <option key={status} value={status}>{label}</option>
              ))}
            </select>
          </label>
          <button type="submit">生成匿名身份</button>
        </form>
      </aside>

      <section className="feedColumn" aria-label="档案大厅">
        <header className="heroBand">
          <p>匿名档案馆 / 转行避难所</p>
          <h2>保存那些没有建成的东西，也保存离开的路线。</h2>
        </header>

        <div className="toolbar">
          <label className="searchInput">
            <Search aria-hidden="true" />
            <input
              value={filters.query}
              onChange={(event) => updateFilter('query', event.target.value)}
              placeholder="搜索转行、作品集、深夜求助"
            />
          </label>
          <label>
            <Filter aria-hidden="true" />
            <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value as FeedFilters['status'])}>
              <option value="all">全部状态</option>
              {(Object.entries(statusLabels) as Array<[UserStatus, string]>).map(([status, label]) => (
                <option key={status} value={status}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            方向
            <select value={filters.direction} onChange={(event) => updateFilter('direction', event.target.value as FeedFilters['direction'])}>
              <option value="all">全部方向</option>
              {(Object.entries(directionLabels) as Array<[TransitionDirection, string]>).map(([direction, label]) => (
                <option key={direction} value={direction}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            排序
            <select value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value as FeedFilters['sort'])}>
              <option value="latest">最新</option>
              <option value="resonance">最多共鸣</option>
              <option value="discussion">最多讨论</option>
              <option value="useful">最有用</option>
            </select>
          </label>
        </div>

        <div className="feedList">
          {filteredPosts.map((post) => (
            <button
              key={post.id}
              className={`archiveCard ${selectedPost.id === post.id ? 'isSelected' : ''}`}
              onClick={() => {
                setSelectedPostId(post.id);
                setProfileUserId(post.authorId);
              }}
            >
              <span className="archiveNo">{postTypeLabels[post.type]} · {post.id.toUpperCase()}</span>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <div className="tagRow">{post.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <footer>
                <span>{statusLabels[post.status]}</span>
                <span>{post.reactions.resonance} 共鸣</span>
                <span>{post.commentCount} 追问</span>
              </footer>
            </button>
          ))}
        </div>
      </section>

      <aside className="detailColumn" aria-label="详情和个人页">
        <article className="detailPanel">
          <p className="archiveNo">{postTypeLabels[selectedPost.type]} · {selectedPost.id.toUpperCase()}</p>
          <h2>{selectedPost.title}</h2>
          <button className="authorButton" onClick={() => setProfileUserId(selectedAuthor.id)}>
            <UserRound aria-hidden="true" />
            {selectedAuthor.codename}
          </button>
          <p>{selectedPost.body}</p>
          <div className="reactionGrid">
            <span>共鸣 {selectedPost.reactions.resonance}</span>
            <span>感谢 {selectedPost.reactions.thanks}</span>
            <span>收藏 {selectedPost.reactions.saves}</span>
            <span>追问 {selectedPost.reactions.asks}</span>
          </div>
        </article>

        <section className="profilePanel">
          <div className="panelTitle">
            <EyeOff aria-hidden="true" />
            <span>迁徙档案</span>
          </div>
          <h3>{profileUser.codename}</h3>
          <p>{statusLabels[profileUser.status]}</p>
          {profileUser.transitionDirection ? <p>方向：{directionLabels[profileUser.transitionDirection]}</p> : null}
          {profileUser.publicBio ? <p>{profileUser.publicBio}</p> : null}
          <ul>
            <li>真实姓名：隐藏</li>
            <li>学校：隐藏</li>
            <li>公司：隐藏</li>
            <li>联系方式：隐藏</li>
          </ul>
        </section>
      </aside>
    </main>
  );
}
```

- [ ] **Step 2: Replace CSS with a basic responsive archive layout**

```css
:root {
  color: #ece7dc;
  background: #151515;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* { box-sizing: border-box; }
body { margin: 0; }
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }

.archiveShell {
  display: grid;
  grid-template-columns: 280px minmax(380px, 1fr) 380px;
  min-height: 100vh;
  background:
    linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px),
    #151515;
  background-size: 28px 28px;
}

.leftRail, .feedColumn, .detailColumn {
  min-width: 0;
  border-color: rgba(236, 231, 220, .16);
}

.leftRail {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-right: 1px solid rgba(236, 231, 220, .16);
  padding: 22px;
}

.brandBlock, .panelTitle, .authorButton, .toolbar label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brandBlock svg { color: #ff7043; width: 32px; height: 32px; }
h1, h2, h3, p { margin: 0; }
.brandBlock h1 { font-size: 22px; line-height: 1.1; }
.brandBlock span, .archiveNo { color: #a7a197; }
.archiveNo { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }

.sectionNav { display: grid; gap: 8px; }
.sectionNav button, .identityCard, .archiveCard, .detailPanel, .profilePanel {
  border: 1px solid rgba(236, 231, 220, .16);
  border-radius: 8px;
  background: rgba(28, 28, 28, .92);
  color: inherit;
}

.sectionNav button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  text-align: left;
}
.sectionNav button.isActive, .archiveCard.isSelected {
  border-color: #ff7043;
  box-shadow: inset 3px 0 0 #ff7043;
}

.identityCard, .detailPanel, .profilePanel {
  display: grid;
  gap: 13px;
  padding: 16px;
}

.identityCard label, .toolbar label {
  color: #cfc8ba;
  font-size: 13px;
}

input, select {
  width: 100%;
  border: 1px solid rgba(236, 231, 220, .18);
  border-radius: 6px;
  background: #101010;
  color: #ece7dc;
  padding: 9px 10px;
}

.identityCard button {
  border: 0;
  border-radius: 6px;
  background: #d9ff66;
  color: #151515;
  padding: 10px 12px;
  font-weight: 700;
}

.feedColumn {
  padding: 24px;
  border-right: 1px solid rgba(236, 231, 220, .16);
}

.heroBand {
  display: grid;
  gap: 8px;
  border-bottom: 1px solid rgba(236, 231, 220, .16);
  padding-bottom: 20px;
}
.heroBand p { color: #ff7043; }
.heroBand h2 { max-width: 820px; font-size: 34px; line-height: 1.08; }

.toolbar {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) repeat(3, minmax(130px, 170px));
  gap: 10px;
  margin: 18px 0;
}
.searchInput { grid-column: span 1; }

.feedList { display: grid; gap: 12px; }
.archiveCard {
  display: grid;
  gap: 10px;
  width: 100%;
  padding: 16px;
  text-align: left;
}
.archiveCard h3 { font-size: 18px; }
.archiveCard p {
  color: #cfc8ba;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.tagRow { display: flex; flex-wrap: wrap; gap: 7px; }
.tagRow span {
  border: 1px solid rgba(217, 255, 102, .28);
  border-radius: 999px;
  color: #d9ff66;
  padding: 4px 8px;
  font-size: 12px;
}
.archiveCard footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #a7a197;
  font-size: 13px;
}

.detailColumn {
  display: grid;
  align-content: start;
  gap: 16px;
  padding: 24px;
}
.detailPanel h2 { font-size: 25px; line-height: 1.15; }
.detailPanel p { color: #d8d0c2; line-height: 1.65; }
.authorButton {
  width: fit-content;
  border: 1px solid rgba(236, 231, 220, .16);
  border-radius: 999px;
  background: transparent;
  color: #ece7dc;
  padding: 7px 10px;
}
.reactionGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.reactionGrid span {
  border: 1px solid rgba(236, 231, 220, .12);
  border-radius: 6px;
  padding: 10px;
  color: #cfc8ba;
}
.profilePanel ul {
  margin: 0;
  padding-left: 18px;
  color: #a7a197;
  line-height: 1.7;
}

@media (max-width: 1120px) {
  .archiveShell { grid-template-columns: 240px 1fr; }
  .detailColumn { grid-column: 1 / -1; border-top: 1px solid rgba(236, 231, 220, .16); }
}

@media (max-width: 760px) {
  .archiveShell { grid-template-columns: 1fr; }
  .leftRail, .feedColumn { border-right: 0; border-bottom: 1px solid rgba(236, 231, 220, .16); }
  .toolbar { grid-template-columns: 1fr; }
  .heroBand h2 { font-size: 27px; }
}
```

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: build archive community shell"
```

## Task 6: Compose Post Flow And Privacy Warning

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add compose state and form to `App.tsx`**

Add imports:

```tsx
import { findPrivacyRisks } from './community/privacy';
import { createCommunityPost } from './community/posts';
import type { DraftPostInput } from './community/types';
```

Add state inside `App`:

```tsx
const [composeBody, setComposeBody] = useState('');
const privacyRisks = findPrivacyRisks(composeBody);
```

Add handler inside `App`:

```tsx
function publishPost(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const type = String(data.get('type') ?? 'help') as PostType;
  const tags = String(data.get('tags') ?? '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const input: DraftPostInput = {
    type,
    title: String(data.get('title') ?? '').trim() || '未命名档案',
    body: composeBody.trim() || '这份档案还没有正文。',
    tags,
    status: currentUser.status,
    transitionDirection: currentUser.transitionDirection
  };
  const post = createCommunityPost(input, currentUser.id);
  setPosts((current) => [post, ...current]);
  setSelectedPostId(post.id);
  setProfileUserId(currentUser.id);
  setComposeBody('');
  event.currentTarget.reset();
}
```

Add compose panel below the hero:

```tsx
<form className="composePanel" onSubmit={publishPost}>
  <div className="panelTitle">
    <FilePlus2 aria-hidden="true" />
    <span>新建档案</span>
  </div>
  <div className="composeGrid">
    <label>
      类型
      <select name="type" defaultValue="rebirth">
        {(Object.entries(postTypeLabels) as Array<[PostType, string]>).map(([type, label]) => (
          <option key={type} value={type}>{label}</option>
        ))}
      </select>
    </label>
    <label>
      标签
      <input name="tags" placeholder="UX, 作品集, 求助" />
    </label>
  </div>
  <label>
    标题
    <input name="title" placeholder="给这份档案一个名字" />
  </label>
  <label>
    正文
    <textarea value={composeBody} onChange={(event) => setComposeBody(event.target.value)} placeholder="写下路线、作品、问题或深夜里的那句话。" />
  </label>
  <div className={privacyRisks.length ? 'privacyNotice isWarning' : 'privacyNotice'}>
    <EyeOff aria-hidden="true" />
    <span>{privacyRisks.length ? `可能包含：${privacyRisks.join('、')}` : '发布前请检查作品图、PDF、截图里是否包含真实姓名、学校、公司、电话、邮箱或二维码。'}</span>
  </div>
  <button type="submit">封存到档案馆</button>
</form>
```

- [ ] **Step 2: Add compose styles**

```css
.composePanel {
  display: grid;
  gap: 12px;
  border: 1px solid rgba(236, 231, 220, .16);
  border-radius: 8px;
  background: rgba(28, 28, 28, .92);
  margin: 18px 0;
  padding: 16px;
}
.composeGrid {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 10px;
}
.composePanel label {
  display: grid;
  gap: 7px;
  color: #cfc8ba;
  font-size: 13px;
}
textarea {
  min-height: 110px;
  resize: vertical;
  border: 1px solid rgba(236, 231, 220, .18);
  border-radius: 6px;
  background: #101010;
  color: #ece7dc;
  padding: 10px;
  line-height: 1.55;
}
.privacyNotice {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  border: 1px solid rgba(217, 255, 102, .25);
  border-radius: 6px;
  color: #d9ff66;
  padding: 10px;
  font-size: 13px;
}
.privacyNotice.isWarning {
  border-color: rgba(255, 112, 67, .5);
  color: #ff7043;
}
.composePanel button {
  width: fit-content;
  border: 0;
  border-radius: 6px;
  background: #ff7043;
  color: #151515;
  padding: 10px 14px;
  font-weight: 800;
}
@media (max-width: 760px) {
  .composeGrid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Run tests and build**

Run: `npm test -- tests/community.test.ts && npm run build`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: add anonymous post composer"
```

## Task 7: Detail, Profile, And Empty States Polish

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add profile post list and feed empty state**

In `App.tsx`, import `getProfilePosts`:

```tsx
import { filterPosts, getProfilePosts } from './community/posts';
```

Add derived state:

```tsx
const profilePosts = getProfilePosts(posts, profileUser.id);
```

After `.feedList` opening, render:

```tsx
{filteredPosts.length === 0 ? (
  <div className="emptyState">
    <MessageCircle aria-hidden="true" />
    <h3>这排档案柜还是空的</h3>
    <p>换一个筛选，或者把第一份档案放进来。</p>
  </div>
) : null}
```

Inside `.profilePanel`, after the hidden identity list, add:

```tsx
<div className="profilePosts">
  <span className="archiveNo">公开档案</span>
  {profilePosts.map((post) => (
    <button key={post.id} onClick={() => setSelectedPostId(post.id)}>
      {post.title}
    </button>
  ))}
</div>
```

- [ ] **Step 2: Add styles for empty and profile post states**

```css
.emptyState {
  display: grid;
  place-items: center;
  gap: 10px;
  border: 1px dashed rgba(236, 231, 220, .22);
  border-radius: 8px;
  color: #a7a197;
  padding: 34px;
  text-align: center;
}
.emptyState svg {
  color: #ff7043;
}
.profilePosts {
  display: grid;
  gap: 8px;
  border-top: 1px solid rgba(236, 231, 220, .12);
  padding-top: 12px;
}
.profilePosts button {
  border: 1px solid rgba(236, 231, 220, .12);
  border-radius: 6px;
  background: #101010;
  color: #ece7dc;
  padding: 9px;
  text-align: left;
}
```

- [ ] **Step 3: Run tests and build**

Run: `npm test -- tests/community.test.ts && npm run build`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: polish archive detail and profile views"
```

## Task 8: Browser Verification

**Files:**
- No source changes expected unless verification finds a UI issue

- [ ] **Step 1: Start dev server**

Run: `npm run dev -- --port 5173`

Expected: Vite serves the app at `http://127.0.0.1:5173/`.

- [ ] **Step 2: Verify desktop layout**

Open `http://127.0.0.1:5173/`.

Check:

- Left rail shows brand, sections, and anonymous identity form.
- Center feed shows hero, compose form, filters, and archive cards.
- Right panel shows detail and privacy-preserving profile.
- No text overlaps at 1440px width.

- [ ] **Step 3: Verify mobile layout**

Resize to around 390px width.

Check:

- Columns stack vertically.
- Filters become one column.
- Compose textarea and buttons fit.
- Long Chinese titles wrap without overlapping.

- [ ] **Step 4: Verify interactions**

Use the page to:

- Create an anonymous identity.
- Filter by one post type.
- Search for `UX`.
- Open a post detail.
- Create a post with an email or phone number and confirm the privacy warning changes.
- Open the current profile and confirm real name, school, company, and contact remain hidden.

- [ ] **Step 5: Run final verification**

Run: `npm test && npm run build`

Expected: PASS.

- [ ] **Step 6: Commit verification fixes if any**

```bash
git add src/App.tsx src/styles.css tests/community.test.ts
git commit -m "fix: refine Dead Archi Society prototype"
```

## Self-Review

- Spec coverage: The plan covers login/identity creation, feed browsing, filters, post creation, detail view, profile view, privacy defaults, privacy reminder, visual theme, and mock-data MVP.
- Known gap: Production moderation is intentionally outside MVP, matching the design spec.
- Placeholder scan: No TBD/TODO/fill-in placeholders remain.
- Type consistency: `PostType`, `UserStatus`, `TransitionDirection`, `FeedFilters`, `CommunityUser`, and `CommunityPost` are introduced in Task 1 and reused consistently in later tasks.
