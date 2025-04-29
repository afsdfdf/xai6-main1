import { renderHook, act, waitFor } from '@testing-library/react';
import { useApiData } from '@/app/hooks/use-api-data';

// 模拟localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

// 替换原始localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('useApiData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  test('应该在首次加载时获取数据', async () => {
    const mockData = { name: 'Test Data' };
    const mockFetchFn = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useApiData(mockFetchFn));

    // 初始状态应该是加载中
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    // 等待数据加载完成
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 期望数据已加载
    expect(result.current.data).toEqual(mockData);
    expect(mockFetchFn).toHaveBeenCalledTimes(1);
  });

  test('应该从缓存中获取数据', async () => {
    const mockData = { name: 'Cached Data' };
    const cachedData = {
      data: mockData,
      timestamp: Date.now()
    };

    // 设置缓存
    mockLocalStorage.setItem('api_cache_test-key', JSON.stringify(cachedData));

    const mockFetchFn = jest.fn().mockResolvedValue({ name: 'Fresh Data' });

    const { result } = renderHook(() =>
      useApiData(mockFetchFn, {
        cacheKey: 'test-key',
        cacheTTL: 30000 // 30秒缓存有效期
      })
    );

    // 等待hook完成
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 应该使用缓存数据，而不是调用获取函数
    expect(result.current.data).toEqual(mockData);
    expect(mockFetchFn).not.toHaveBeenCalled();
  });

  test('应该处理错误', async () => {
    const mockError = new Error('API Error');
    const mockFetchFn = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useApiData(mockFetchFn));

    // 等待错误处理完成
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 应该显示错误消息
    expect(result.current.error).toBe('API Error');
    expect(result.current.data).toBeUndefined();
  });

  test('refresh方法应该忽略缓存并获取新数据', async () => {
    const cachedData = {
      data: { name: 'Old Data' },
      timestamp: Date.now()
    };

    // 设置缓存
    mockLocalStorage.setItem('api_cache_refresh-test', JSON.stringify(cachedData));

    const mockFreshData = { name: 'Fresh Data' };
    const mockFetchFn = jest.fn().mockResolvedValue(mockFreshData);

    const { result } = renderHook(() =>
      useApiData(mockFetchFn, {
        cacheKey: 'refresh-test',
        cacheTTL: 30000
      })
    );

    // 等待初始加载完成
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 应该使用缓存数据
    expect(result.current.data).toEqual(cachedData.data);
    
    // 刷新数据
    act(() => {
      result.current.refresh();
    });

    // 应该重新进入加载状态
    expect(result.current.isLoading).toBe(true);

    // 等待刷新完成
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 应该获取到新数据
    expect(result.current.data).toEqual(mockFreshData);
    expect(mockFetchFn).toHaveBeenCalledTimes(1);
  });
}); 