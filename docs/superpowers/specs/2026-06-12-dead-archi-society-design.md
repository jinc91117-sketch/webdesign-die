# Dead Archi Society Design

## Summary

Dead Archi Society, Chinese title "死去的建筑毕业生", is an anonymous community for architecture students, architecture graduates, and people who have left or are trying to leave architecture-adjacent careers.

The product is not a portfolio marketplace or a professional resume site. It is a forum-shaped archive and refuge: users can preserve past work, document career transitions, ask for help, vent anonymously, and find routes out of or through the profession.

The emotional tone is tragic but not hopeless. The visual metaphor is an architectural ruin archive with a working shelter inside it.

## Goals

- Provide an anonymous place for architecture students and graduates to speak honestly.
- Collect career transition cases in a browsable, searchable format.
- Let users show past portfolios and projects without turning the site into a self-promotional platform.
- Help users find practical routes, resources, and peers.
- Protect user privacy by default, especially around school, company, location, real name, and contact details.

## Non-Goals

- Do not build a real-name professional network.
- Do not require school, company, city, or legal identity.
- Do not prioritize recruiting workflows in the first version.
- Do not build a full production backend in the initial prototype.
- Do not frame users as failures. The tone should allow mourning without humiliating the people using the platform.

## Audience

Primary users:

- Architecture students who are unsure whether to continue.
- Recent architecture graduates under career pressure.
- Former architecture students who moved into UX, product, game art, visualization, UI, curation, development, construction, real estate, teaching, or freelance work.
- People still in architecture who want a safer place to speak.

Secondary users:

- Applicants considering architecture school.
- Friends and collaborators who want to understand the industry pressure.

## Product Shape

The MVP is a front-end interactive prototype with mock data. It should include:

- Login or identity creation.
- Home feed with filters.
- Post creation.
- Post detail view with comments.
- Privacy-preserving profile page.

The prototype should feel like a usable community, not a static landing page.

## Information Architecture

### Home: Archive Hall

The home page is the main forum feed.

It contains:

- Brand/title area: "死去的建筑毕业生 / Dead Archi Society".
- Short positioning line: an anonymous archive for architecture students who are leaving, staying, or still deciding.
- Primary sections:
  - 转生档案
  - 遗物展柜
  - 深夜画图室
  - 路线图
  - 求助帖
- Filter controls:
  - Post type.
  - Current status.
  - Transition direction.
  - Graduation year range.
  - Sort by latest, most resonant, most discussed, or most useful.
- Content cards:
  - Text post cards.
  - Transition case cards.
  - Portfolio/project cards.
  - Resource cards.

### Login / Identity Creation

Users create an anonymous identity.

Required fields:

- Anonymous codename.
- Current status.

Optional fields:

- Graduation year.
- Former focus area.
- Transition direction.
- Short public note.

Explicitly hidden by default:

- Real name.
- School.
- Company.
- City.
- Phone number.
- Email.
- External contact.

### Create Post

Supported post types:

- 转生档案: career transition story.
- 遗物展柜: portfolio or past project showcase.
- 深夜画图室: anonymous venting or emotional support.
- 路线图: resource, method, course, tool, or skill path.
- 求助帖: asking for feedback, advice, or peer support.

Fields:

- Post type.
- Title.
- Body.
- Tags.
- Current status.
- Transition direction.
- Optional cover image or project thumbnail.
- Optional resource links.
- Visibility controls.

Before publishing, show a privacy reminder:

"发布前请检查：作品图、PDF、截图里是否包含真实姓名、学校、学号、公司、电话、邮箱或二维码。"

### Post Detail

The detail page contains:

- Post title.
- Post type and archive number.
- Anonymous author card.
- Body content.
- Tags.
- Project images or links when relevant.
- Comments.
- Actions:
  - 共鸣
  - 感谢
  - 收藏
  - 追问

The interaction language should avoid loud social metrics. Counts can exist, but they should feel quieter than likes on a social media platform.

### Profile Page

The profile page is an anonymous migration archive.

Visible by default:

- Codename.
- Status.
- Transition direction.
- Graduation year if the user chose to show it.
- Public bio.
- Public posts.
- Public portfolio entries.
- Saved route notes if the user chooses to share them.

Hidden by default:

- Real name.
- School.
- Company.
- City.
- Contact details.
- Exact timeline details that could identify the person.

Optional disclosure must be deliberate and reversible.

## Content Model

### User

- id
- codename
- status
- graduationYear optional
- formerFocus optional
- transitionDirection optional
- publicBio optional
- privacySettings
- createdAt

### Post

- id
- type
- title
- body
- authorId
- tags
- status
- transitionDirection optional
- graduationYear optional
- coverImage optional
- attachments optional
- resourceLinks optional
- reactions
- commentCount
- createdAt
- updatedAt

### Comment

- id
- postId
- authorId
- body
- createdAt

### Reaction

- postId
- userId
- type: resonance, thanks, save, ask

## Status Vocabulary

Suggested user statuses:

- 仍在画图
- 正在转生
- 已离开建筑
- 留在现场
- 逃往产品
- 转向游戏美术
- 成为自由职业者
- 暂时失联

The labels should be expressive but not cruel. Users should feel seen, not mocked.

## Visual Direction

The design combines "建筑废墟档案馆" and "转行避难所".

Visual language:

- Architectural drawing grid.
- Archive cards.
- File numbers.
- Redline annotations.
- Scanned paper texture.
- Monochrome base with controlled accent color.

Palette:

- Charcoal black.
- Concrete gray.
- Paper white.
- Red annotation accent.
- One hope accent, preferably warm amber or signal green.

Typography:

- Use clear UI text for product controls.
- Use stronger display typography only for the title and section identity.
- Do not let concept styling reduce readability.

Layout:

- Dense enough to feel like a working forum.
- Structured enough to feel like an archive.
- Avoid marketing landing-page composition.
- Avoid oversized decorative cards.

## Privacy Rules

- The platform is anonymous by default.
- The product should never ask for real name during MVP onboarding.
- School, company, city, and contact details are optional and hidden by default.
- Portfolio uploads should trigger a privacy checklist.
- Profile pages should avoid resume-style identity exposure.
- Public identity should center on codename, status, direction, and chosen posts.

## Core User Flows

### Browse

1. User lands on the Archive Hall.
2. User selects a section or filter.
3. Feed updates to matching archive entries.
4. User opens a post detail page.

### Join

1. User opens login or identity creation.
2. User creates a codename and status.
3. User optionally adds direction and graduation year.
4. User enters the community as an anonymous profile.

### Publish

1. User chooses a post type.
2. User writes title and body.
3. User adds tags and optional images or links.
4. User reviews privacy reminder.
5. User publishes.

### View Profile

1. User opens an anonymous author profile.
2. Page shows public status, direction, posts, and works.
3. Hidden identity fields remain hidden.

## MVP Acceptance Criteria

- Users can create or switch to an anonymous local identity.
- Users can browse a mock feed of multiple post types.
- Users can filter posts by type, status, direction, and sort order.
- Users can create a new post in the prototype.
- Users can open a post detail page.
- Users can view an anonymous profile page.
- The profile page does not expose real name, school, company, city, or contact details by default.
- The UI clearly communicates the archive/refuge theme while remaining usable.

## Implementation Notes

The existing workspace is a Vite, React, and TypeScript project. The first implementation plan should use the current stack rather than introducing a new framework.

Initial data can live in local TypeScript mock modules or local storage. A production backend is outside the MVP.

Because this is a forum-like product, components should be split around product concepts:

- identity
- posts
- filters
- profile
- reactions
- privacy reminders

## Open Decisions

- Final product name can remain "死去的建筑毕业生" or be paired with "Dead Archi Society".
- The hope accent color should be selected during visual implementation.
- Comment moderation is important for production, but not part of the first prototype.
