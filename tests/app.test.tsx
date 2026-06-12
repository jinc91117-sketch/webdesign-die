import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';

describe('Dead Archi Society app', () => {
  it('renders the portfolio gallery and hopeful transition direction without mojibake', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: '死去的建筑毕业生' })).toBeInTheDocument();
    expect(screen.getByText('作品集展厅 / 转行希望站')).toBeInTheDocument();
    expect(screen.getByText('曾经认真画过的图，应该被好好展示。')).toBeInTheDocument();
    expect(screen.getByText('转行路线不是逃跑，是把训练过的眼睛带到新地方。')).toBeInTheDocument();
    expect(screen.getByText('作品集展墙')).toBeInTheDocument();
    expect(screen.getByText('转行路线')).toBeInTheDocument();
    expect(screen.getByText('新建档案')).toBeInTheDocument();
    expect(screen.getByText('发布前请检查作品图、PDF、截图里是否包含真实姓名、学校、公司、电话、邮箱或二维码。')).toBeInTheDocument();
    expect(screen.getByText('真实姓名：隐藏')).toBeInTheDocument();
  });
});
