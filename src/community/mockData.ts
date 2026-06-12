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
    title: '未建成墓图 03：一个被我画到凌晨四点的图书馆',
    body: '它没有落地，也没有拿奖。但我还是想把它放在这里。模型里那条斜坡，是我当时相信公共空间会改变人的证据。',
    authorId: 'u-section9',
    tags: ['毕业设计', '公共建筑', '遗物展柜'],
    status: 'left-architecture',
    transitionDirection: 'game-art',
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
