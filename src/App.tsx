import {
  ArrowRight,
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

const showcasePosts = seedPosts.filter((post) => post.type === 'relic' || post.type === 'rebirth').slice(0, 4);

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
      title: String(data.get('title') ?? '').trim() || '未命名方案遗骸',
      body: composeBody.trim() || '这份档案还没有正文。',
      deathCause: String(data.get('deathCause') ?? '').trim() || '尚未填写死因。',
      mentalDeathMoment: String(data.get('mentalDeathMoment') ?? '').trim() || '某个无法再画下去的晚上',
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
    <main className="siteShell">
      <header className="topBar">
        <a className="wordmark" href="#top" aria-label="死去的建筑毕业生首页">
          <strong>FORMA</strong>
          <span>DEAD ARCHI SOCIETY</span>
        </a>
        <nav aria-label="主导航">
          <a href="#portfolio-wall">作品</a>
          <a href="#death-register">死因</a>
          <a href="#transition-paths">转行</a>
          <a href="#profile">匿名</a>
        </nav>
        <span className="language">CN</span>
      </header>

      <aside className="verticalRail" aria-label="情绪坐标">
        <span>SPACES</span>
        <span>/</span>
        <span>BURNOUT</span>
        <span>/</span>
        <span>HOPE</span>
      </aside>

      <section className="heroGrid" id="top" aria-label="建筑作品集式首页">
        <div className="heroCopy">
          <p className="eyebrow">ARCHITECTURE AFTER BURNOUT</p>
          <h1>死去的建筑毕业生</h1>
          <p className="heroKicker">作品集展厅 / 精神墓园 / 转行希望站</p>
          <p className="heroText">不是生理意义上的死亡，是某一刻你发现自己再也画不动那根线。</p>
          <div className="heroActions">
            <a href="#death-register">
              登记死因
              <ArrowRight aria-hidden="true" />
            </a>
            <a href="#portfolio-wall">
              看方案遗骸
              <GalleryHorizontalEnd aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="heroImage" aria-hidden="true">
          <div className="concreteMass massA" />
          <div className="concreteMass massB" />
          <div className="deadTree" />
          <div className="waterline" />
          <div className="planOverlay" />
        </div>
      </section>

      <section className="selectedStrip" aria-label="精选档案">
        <div className="selectedIndex">
          <span>SELECTED ARCHIVE</span>
          <strong>01</strong>
        </div>
        <div className="selectedInfo">
          <span>{postTypeLabels[selectedPost.type]}</span>
          <strong>{selectedPost.title}</strong>
          <button onClick={() => setProfileUserId(selectedPost.authorId)}>
            查看档案
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <BlueprintPreview />
      </section>

      <section className="studioBody">
        <aside className="sidePanel" aria-label="社区导航">
          <div className="brandBlock">
            <p className="archiveNo">ARCHIVE INDEX</p>
            <h2>匿名入口</h2>
            <span>不公开姓名、学校、公司和联系方式。</span>
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
          <section className="showcaseSection" id="portfolio-wall">
            <div className="sectionHeader">
              <div>
                <p className="eyebrow">Featured Work</p>
                <h2>避难所中已封存的方案遗骸</h2>
              </div>
              <span>把遗憾当作作品保存，而不是删掉。</span>
            </div>

            <div className="showcaseGrid">
              {showcasePosts.map((post, index) => (
                <button
                  className="projectCard"
                  key={post.id}
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setProfileUserId(post.authorId);
                  }}
                >
                  <PortfolioVisual index={index} />
                  <div>
                    <strong>{post.title}</strong>
                    <span>0{index + 1}</span>
                  </div>
                  <small>{post.tags.join(' / ')}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="approachBand" id="transition-paths" aria-label="转行路线">
            <div className="approachIntro">
              <p className="eyebrow">Our Approach</p>
              <h2>在凋零之后重新组织生活</h2>
              <p>转行不是逃跑，是把训练过的眼睛带到新地方。</p>
            </div>
            <div className="pathGrid">
              {(['ux', 'product', 'game-art', 'development'] as TransitionDirection[]).map((direction, index) => (
                <button key={direction} onClick={() => updateFilter('direction', direction)}>
                  <Sparkles aria-hidden="true" />
                  <span>{directionLabels[direction]}</span>
                  <small>0{index + 1}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="contentColumns">
            <div className="galleryColumn">
              <div className="sectionHeader compact">
                <div>
                  <p className="eyebrow">Archive Feed</p>
                  <h2>所有匿名档案</h2>
                </div>
              </div>

              <div className="toolbar">
                <label className="searchInput">
                  <Search aria-hidden="true" />
                  <input
                    value={filters.query}
                    onChange={(event) => updateFilter('query', event.target.value)}
                    placeholder="搜索转行、死因、作品集"
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
                        <div className="cardMeta">
                          <span>{postTypeLabels[post.type]}</span>
                          <span>{post.mentalDeathMoment ?? '精神死亡时刻未登记'}</span>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                        <div className="deathSnippet">
                          <strong>死因剖析</strong>
                          <span>{post.deathCause ?? '暂未登记。'}</span>
                        </div>
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
                <h2>{selectedPost.title}</h2>
                <p>{selectedPost.body}</p>
                <div className="deathReport">
                  <span>第一次觉得自己精神死亡的时刻</span>
                  <strong>{selectedPost.mentalDeathMoment ?? '未登记'}</strong>
                  <span>死亡原因</span>
                  <p>{selectedPost.deathCause ?? '未登记'}</p>
                </div>
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

              <article className="profilePanel" id="profile">
                <div className="panelTitle">
                  <EyeOff aria-hidden="true" />
                  <span>匿名个人页面</span>
                </div>
                <h2>{profileUser.codename}</h2>
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

              <form className="composePanel" id="death-register" onSubmit={publishPost}>
                <div className="panelTitle">
                  <FilePlus2 aria-hidden="true" />
                  <span>精神死亡登记表</span>
                </div>
                <label>
                  方案/项目名称
                  <input name="title" placeholder="例：重构几何：垂直微缩美术馆" />
                </label>
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
                  第一次觉得自己精神死亡的时刻
                  <input name="mentalDeathMoment" placeholder="例：答辩前 48 小时 / 第七版文本被退回时" />
                </label>
                <label>
                  死亡原因
                  <textarea name="deathCause" placeholder="例：甲方中途拿钱去投了剧本杀；评图时老师说不符合地段肌理，前功尽弃..." />
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
                <button type="submit">封存精神墓志铭</button>
              </form>
            </aside>
          </section>
        </section>
      </section>
    </main>
  );
}

function BlueprintPreview() {
  return (
    <div className="blueprintPreview" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
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
