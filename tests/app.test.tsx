import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';

describe('Dead Archi Society app', () => {
  it('renders the core archive UI copy without mojibake', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: '死去的建筑毕业生' })).toBeInTheDocument();
    expect(screen.getByText('匿名档案馆 / 转行避难所')).toBeInTheDocument();
    expect(screen.getByText('新建档案')).toBeInTheDocument();
    expect(screen.getByText('发布前请检查作品图、PDF、截图里是否包含真实姓名、学校、公司、电话、邮箱或二维码。')).toBeInTheDocument();
    expect(screen.getByText('真实姓名：隐藏')).toBeInTheDocument();
  });
});
