import {
  ArrowUpRight,
  BookOpen,
  EyeOff,
  FilePlus2,
  Filter,
  GalleryHorizontalEnd,
  MessageCircle,
  Route,
  Search,
  Shield,
  Sparkles,
  UserRound
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { directionLabels, postTypeLabels, seedPosts, seedUsers, statusLabels } from './community/mockData';
import { buildAnonymousIdentity, findPrivacyRisks } from './community/privacy';
import { createCommunityPost, filterPosts, getProfilePosts } from './community/posts';
import type {
  CommunityPost,
  CommunityUser,
  DraftPostInput,
  FeedFilters,
  PostType,
  TransitionDirection,
  UserStatus
} from './community/types';

const defaultFilters: FeedFilters = {
  type: 'all',
  status: 'all',
  direction: 'all',
  sort: 'latest',
  query: ''
};

const portfolioPosts = seedPosts.filter((post) => post.type === 'relic' || post.type === 'rebirth').slice(0, 3);

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
    <main className="studioShell">
      <aside className="sidePanel" aria-label="社区导航">
        <div className="brandBlock">
          <p className="archiveNo">PORTFOLIO AFTERLIFE</p>
          <h1>死去的建筑毕业生</h1>
          <span>Dead Archi Society</span>
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
          <p>
            当前：{currentUser.codename} / {statusLabels[currentUser.status]}
          </p>
          <label>
            代号
            <input name="codename" placeholder="A-0427" />
          </label>
          <label>
            状态
            <select name="status" defaultValue="rebirthing">
              {(Object.entries(statusLabels) as Array<[UserStatus, string]>).map(([status, label]) => (
                <option key={status} value={status}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">生成匿名身份</button>
        </form>
      </aside>

      <section className="mainStage" aria-label="作品集展厅">
        <header className="portfolioHero">
          <div className="heroCopy">
            <p className="eyebrow">作品集展厅 / 转行希望站</p>
            <h2>曾经认真画过的图，应该被好好展示。</h2>
            <p className="heroText">
              这里保留毕业设计、竞赛图纸、模型和那些没有建成的方案，也把离开建筑之后的新路径摊开给后来的人看。
            </p>
            <div className="heroActions">
              <a href="#portfolio-wall">
                <GalleryHorizontalEnd aria-hidden="true" />
                看作品集展墙
              </a>
              <a href="#transition-paths">
                <Route aria-hidden="true" />
                看转行路线
              </a>
            </div>
          </div>

          <div className="portfolioSpread" aria-label="作品集样张">
            {portfolioPosts.map((post, index) => (
              <button
                className="portfolioPlate"
                key={post.id}
                onClick={() => {
                  setSelectedPostId(post.id);
                  setProfileUserId(post.authorId);
                }}
              >
                <span>0{index + 1}</span>
                <PortfolioVisual index={index} />
                <strong>{post.title}</strong>
                <small>{post.tags.join(' / ')}</small>
              </button>
            ))}
          </div>
        </header>

        <section className="hopeBand" id="transition-paths" aria-label="转行路线">
          <div>
            <p className="eyebrow">转行路线</p>
            <h3>转行路线不是逃跑，是把训练过的眼睛带到新地方。</h3>
          </div>
          <div className="pathGrid">
            {(['ux', 'product', 'game-art', 'development'] as TransitionDirection[]).map((direction) => (
              <button key={direction} onClick={() => updateFilter('direction', direction)}>
                <Sparkles aria-hidden="true" />
                <span>{directionLabels[direction]}</span>
                <ArrowUpRight aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        <section className="contentColumns">
          <div className="galleryColumn" id="portfolio-wall">
            <div className="sectionHeader">
              <div>
                <p className="eyebrow">Portfolio Wall</p>
                <h3>作品集展墙</h3>
              </div>
              <span>把遗憾当作作品保存，而不是删掉。</span>
            </div>

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
                <select
                  value={filters.status}
                  onChange={(event) => updateFilter('status', event.target.value as FeedFilters['status'])}
                >
                  <option value="all">全部状态</option>
                  {(Object.entries(statusLabels) as Array<[UserStatus, string]>).map(([status, label]) => (
                    <option key={status} value={status}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                排序
                <select value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value as FeedFilters['sort'])}>
                  <option value="latest">最新</option>
                  <option value="resonance">共鸣最多</option>
                  <option value="discussion">讨论最多</option>
                  <option value="useful">收藏价值</option>
                </select>
              </label>
            </div>

            <div className="archiveGrid">
              {filteredPosts.map((post) => {
                const author = users.find((user) => user.id === post.authorId);
                return (
                  <article className={selectedPost.id === post.id ? 'archiveCard selected' : 'archiveCard'} key={post.id}>
                    <button
                      className="cardButton"
                      onClick={() => {
                        setSelectedPostId(post.id);
                        setProfileUserId(post.authorId);
                      }}
                    >
                      <PortfolioVisual index={post.id.charCodeAt(post.id.length - 1) % 3} />
                      <div className="cardMeta">
                        <span>{postTypeLabels[post.type]}</span>
                        <span>{statusLabels[post.status]}</span>
                      </div>
                      <h4>{post.title}</h4>
                      <p>{post.body}</p>
                      <div className="tagRow">
                        {post.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </button>
                    <button className="authorButton" onClick={() => setProfileUserId(post.authorId)}>
                      <UserRound aria-hidden="true" />
                      {author?.codename ?? '匿名档案'}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="storyColumn" aria-label="详情和个人页面">
            <article className="detailPanel">
              <div className="panelTitle">
                <MessageCircle aria-hidden="true" />
                <span>详情页</span>
              </div>
              <p className="eyebrow">{postTypeLabels[selectedPost.type]}</p>
              <h3>{selectedPost.title}</h3>
              <p>{selectedPost.body}</p>
              <dl className="signalList">
                <div>
                  <dt>共鸣</dt>
                  <dd>{selectedPost.reactions.resonance}</dd>
                </div>
                <div>
                  <dt>感谢</dt>
                  <dd>{selectedPost.reactions.thanks}</dd>
                </div>
                <div>
                  <dt>收藏</dt>
                  <dd>{selectedPost.reactions.saves}</dd>
                </div>
              </dl>
            </article>

            <article className="profilePanel">
              <div className="panelTitle">
                <EyeOff aria-hidden="true" />
                <span>匿名个人页面</span>
              </div>
              <h3>{profileUser.codename}</h3>
              <p>{profileUser.publicBio ?? '这个人暂时只留下作品，不留下真实身份。'}</p>
              <dl className="privacyList">
                <div>
                  <dt>真实姓名</dt>
                  <dd>隐藏</dd>
                </div>
                <div>
                  <dt>联系方式</dt>
                  <dd>{profileUser.privacy.showContact ? '可公开' : '隐藏'}</dd>
                </div>
                <div>
                  <dt>方向</dt>
                  <dd>
                    {profileUser.transitionDirection && profileUser.privacy.showDirection
                      ? directionLabels[profileUser.transitionDirection]
                      : '隐藏'}
                  </dd>
                </div>
              </dl>
              <div className="profileWorks">
                {profilePosts.map((post) => (
                  <button key={post.id} onClick={() => setSelectedPostId(post.id)}>
                    {post.title}
                  </button>
                ))}
              </div>
            </article>

            <form className="composePanel" onSubmit={publishPost}>
              <div className="panelTitle">
                <FilePlus2 aria-hidden="true" />
                <span>新建档案</span>
              </div>
              <label>
                类型
                <select name="type" defaultValue="relic">
                  {(Object.entries(postTypeLabels) as Array<[PostType, string]>).map(([type, label]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                标题
                <input name="title" placeholder="比如：我把毕业设计改成了产品案例" />
              </label>
              <label>
                正文
                <textarea
                  value={composeBody}
                  onChange={(event) => setComposeBody(event.target.value)}
                  placeholder="写下你的作品、转行路线或求助问题。"
                />
              </label>
              <label>
                标签
                <input name="tags" placeholder="UX, 作品集, 求助" />
              </label>
              <p className={privacyRisks.length ? 'privacyWarning active' : 'privacyWarning'}>
                发布前请检查作品图、PDF、截图里是否包含真实姓名、学校、公司、电话、邮箱或二维码。
                {privacyRisks.length ? ` 检测到：${privacyRisks.join('、')}` : ''}
              </p>
              <button type="submit">发布匿名档案</button>
            </form>
          </aside>
        </section>
      </section>
    </main>
  );
}

function PortfolioVisual({ index }: { index: number }) {
  return (
    <div className={`portfolioVisual visual${index + 1}`} aria-hidden="true">
      <span className="planLine lineA" />
      <span className="planLine lineB" />
      <span className="planBlock blockA" />
      <span className="planBlock blockB" />
      <span className="planDot dotA" />
      <span className="planDot dotB" />
    </div>
  );
}
