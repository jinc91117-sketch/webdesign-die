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
import { buildAnonymousIdentity, findPrivacyRisks } from './community/privacy';
import { createCommunityPost, filterPosts, getProfilePosts } from './community/posts';
import type { CommunityPost, CommunityUser, DraftPostInput, FeedFilters, PostType, TransitionDirection, UserStatus } from './community/types';

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
  const [composeBody, setComposeBody] = useState('');
  const privacyRisks = findPrivacyRisks(composeBody);

  const filteredPosts = useMemo(() => filterPosts(posts, filters), [posts, filters]);
  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? filteredPosts[0] ?? posts[0];
  const selectedAuthor = users.find((user) => user.id === selectedPost.authorId) ?? currentUser;
  const profileUser = users.find((user) => user.id === profileUserId) ?? currentUser;
  const profilePosts = getProfilePosts(posts, profileUser.id);

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
          {filteredPosts.length === 0 ? (
            <div className="emptyState">
              <MessageCircle aria-hidden="true" />
              <h3>这排档案柜还是空的</h3>
              <p>换一个筛选，或者把第一份档案放进来。</p>
            </div>
          ) : null}
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
          <div className="profilePosts">
            <span className="archiveNo">公开档案</span>
            {profilePosts.map((post) => (
              <button key={post.id} onClick={() => setSelectedPostId(post.id)}>
                {post.title}
              </button>
            ))}
          </div>
        </section>
      </aside>
    </main>
  );
}
