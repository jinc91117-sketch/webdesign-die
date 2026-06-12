import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';

describe('Dead Archi Society app', () => {
  it('renders an architectural portfolio memorial with mental death causes', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: '死去的建筑毕业生' })).toBeInTheDocument();
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
});
