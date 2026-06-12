import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../src/App';

describe('Dead Archi Society app', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders an architectural portfolio memorial with mental death causes', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: '死去的建筑毕业生' })).toBeInTheDocument();
    expect(screen.getByAltText('凋零的混凝土建筑与图纸底图')).toHaveAttribute(
      'src',
      '/hero-architecture-memorial.png'
    );
    expect(screen.getByText('ARCHITECTURE AFTER BURNOUT')).toBeInTheDocument();
    expect(screen.getByText('作品集展厅 / 精神墓园 / 转行希望站')).toBeInTheDocument();
    expect(screen.getByText('不是生理意义上的死亡，是某一刻你发现自己再也画不动那根线。')).toBeInTheDocument();
    expect(screen.getByText('精神死亡登记表')).toBeInTheDocument();
    expect(screen.getAllByText('第一次觉得自己精神死亡的时刻')[0]).toBeInTheDocument();
    expect(screen.getAllByText('死亡原因')[0]).toBeInTheDocument();
    expect(screen.getAllByText('死因剖析')[0]).toBeInTheDocument();
    expect(screen.getByText('避难所中已封存的方案遗骸')).toBeInTheDocument();
    expect(screen.getByText('真实姓名')).toBeInTheDocument();
    expect(screen.getAllByText('隐藏')[0]).toBeInTheDocument();

    const bodyText = document.body.textContent ?? '';
    const mojibakePattern = new RegExp(
      ['\\u9435\\u7684', '\\u951b', '\\ufffd', '\\u6d63\\u6ed3\\u935d', '\\u95c5\\u611f\\u68cc'].join('|')
    );
    expect(bodyText).not.toMatch(mojibakePattern);
  });

  it('restores persisted posts, legacy plates, and sticky notes from localStorage', () => {
    const savedPost = {
      id: 'local-saved-plate',
      type: 'relic',
      title: '刷新后仍在的未建成剖面',
      body: '这是刷新之后仍然应该留在避难所里的方案。',
      deathCause: '所有修改意见都指向同一个结论：重来。',
      mentalDeathMoment: '给导师演示前一小时',
      authorId: 'u-a0427',
      tags: ['持久化', '遗物展柜'],
      status: 'rebirthing',
      transitionDirection: 'ux',
      reactions: { resonance: 0, thanks: 0, saves: 0, asks: 0 },
      commentCount: 0,
      usefulScore: 0,
      createdAt: '2026-06-13T00:00:00.000Z',
      updatedAt: '2026-06-13T00:00:00.000Z'
    };
    localStorage.setItem('dead-archi-posts', JSON.stringify([savedPost]));
    localStorage.setItem('dead-archi-legacy-list', JSON.stringify([savedPost]));
    localStorage.setItem(
      'dead-archi-sticky-notes',
      JSON.stringify([{ id: 'note-saved', label: 'PIN 01', body: '刷新后仍在的纸条' }])
    );

    render(<App />);

    expect(screen.getAllByText('刷新后仍在的未建成剖面')[0]).toBeInTheDocument();
    expect(screen.getByText('刷新后仍在的纸条')).toBeInTheDocument();
  });

  it('persists new death-register submissions as posts, legacy plates, and sticky notes', () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('例：重构几何：垂直微缩美术馆'), {
      target: { value: '灰色合同页上的未竟剧场' }
    });
    fireEvent.change(screen.getByPlaceholderText('例：答辩前 48 小时 / 第七版文本被退回时'), {
      target: { value: '第一次发现图纸比人更像活物时' }
    });
    fireEvent.change(screen.getByPlaceholderText('例：甲方中途拿钱去投了剧本杀；评图时老师说不符合地段肌理，前功尽弃...'), {
      target: { value: '被要求保留概念但推倒全部平面。' }
    });
    fireEvent.change(screen.getByPlaceholderText('写下你的作品、转行路线或求助问题。'), {
      target: { value: '这份提交书需要被正式封存。' }
    });
    fireEvent.change(screen.getByPlaceholderText('UX, 作品集, 求助'), {
      target: { value: '遗物展柜, 高级灰' }
    });
    fireEvent.click(screen.getByRole('button', { name: '封存精神墓志铭' }));

    expect(JSON.parse(localStorage.getItem('dead-archi-posts') ?? '[]')[0].title).toBe('灰色合同页上的未竟剧场');
    expect(JSON.parse(localStorage.getItem('dead-archi-legacy-list') ?? '[]')[0].title).toBe('灰色合同页上的未竟剧场');
    expect(JSON.parse(localStorage.getItem('dead-archi-sticky-notes') ?? '[]')[0].body).toContain('第一次发现图纸比人更像活物时');
  });
});
