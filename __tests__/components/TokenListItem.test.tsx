import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TokenListItem from '@/app/components/token-list/TokenListItem';
import { TokenRanking } from '@/app/types/token';

// 模拟数据
const mockToken: TokenRanking = {
  token: '0xmocktoken',
  chain: 'eth',
  symbol: 'MOCK',
  name: 'Mock Token',
  logo_url: 'https://example.com/mock.png',
  current_price_usd: 1.23,
  price_change_24h: 5.67,
  tx_volume_u_24h: 1000000,
  holders: 5000
};

describe('TokenListItem Component', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with provided data', () => {
    render(
      <TokenListItem 
        token={mockToken} 
        darkMode={true} 
        onClick={mockOnClick} 
      />
    );

    // 检查符号和链显示
    expect(screen.getByText('MOCK')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();

    // 检查价格格式化
    expect(screen.getByText('$1.23')).toBeInTheDocument();

    // 检查价格变化格式化并带正号
    expect(screen.getByText('+5.67%')).toBeInTheDocument();
  });

  test('handles negative price change correctly', () => {
    const negativeToken = {
      ...mockToken,
      price_change_24h: -3.45
    };

    render(
      <TokenListItem 
        token={negativeToken} 
        darkMode={true} 
        onClick={mockOnClick} 
      />
    );

    // 检查负价格变化格式
    expect(screen.getByText('-3.45%')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    render(
      <TokenListItem 
        token={mockToken} 
        darkMode={true} 
        onClick={mockOnClick} 
      />
    );

    // 点击卡片
    fireEvent.click(screen.getByText('MOCK'));

    // 验证点击处理函数被调用
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockToken);
  });

  test('handles missing data gracefully', () => {
    const incompleteToken = {
      ...mockToken,
      logo_url: '',
      price_change_24h: 0
    };

    render(
      <TokenListItem 
        token={incompleteToken} 
        darkMode={true} 
        onClick={mockOnClick} 
      />
    );

    // 验证仍然显示基本信息
    expect(screen.getByText('MOCK')).toBeInTheDocument();
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });
}); 