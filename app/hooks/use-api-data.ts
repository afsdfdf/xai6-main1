'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserFriendlyErrorMessage } from '@/app/lib/api-utils';

interface UseApiDataOptions<T> {
  /** 初始数据 */
  initialData?: T;
  /** 依赖项，变化时重新获取数据 */
  deps?: any[];
  /** 是否自动获取数据 */
  autoFetch?: boolean;
  /** 是否在组件挂载时自动获取数据 */
  fetchOnMount?: boolean;
  /** 缓存键，用于本地存储缓存 */
  cacheKey?: string;
  /** 缓存有效期（毫秒） */
  cacheTTL?: number;
}

/**
 * 通用数据获取Hook
 * @param fetchFn 获取数据的函数
 * @param options 配置选项
 * @returns 加载状态、数据、错误和刷新函数
 */
export function useApiData<T>(
  fetchFn: () => Promise<T>,
  options: UseApiDataOptions<T> = {}
) {
  const {
    initialData,
    deps = [],
    autoFetch = true,
    fetchOnMount = true,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 默认缓存5分钟
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(fetchOnMount && autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  // 检查本地缓存
  const checkCache = useCallback(() => {
    if (!cacheKey) return null;
    
    try {
      const cached = localStorage.getItem(`api_cache_${cacheKey}`);
      if (!cached) return null;
      
      const { data: cachedData, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // 检查缓存是否过期
      if (now - timestamp < cacheTTL) {
        return cachedData;
      }
      
      // 缓存已过期，删除缓存
      localStorage.removeItem(`api_cache_${cacheKey}`);
      return null;
    } catch (e) {
      console.error('Error reading from cache:', e);
      return null;
    }
  }, [cacheKey, cacheTTL]);

  // 更新缓存
  const updateCache = useCallback((data: T) => {
    if (!cacheKey) return;
    
    try {
      localStorage.setItem(
        `api_cache_${cacheKey}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.error('Error saving to cache:', e);
    }
  }, [cacheKey]);

  // 获取数据
  const fetchData = useCallback(async (ignoreCache = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 检查缓存
      if (!ignoreCache && cacheKey) {
        const cachedData = checkCache();
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          setLastFetched(Date.now());
          return;
        }
      }
      
      // 获取新数据
      const result = await fetchFn();
      
      // 更新状态
      setData(result);
      setLastFetched(Date.now());
      
      // 更新缓存
      if (cacheKey && result) {
        updateCache(result);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, cacheKey, checkCache, updateCache]);

  // 刷新数据
  const refresh = useCallback(() => {
    return fetchData(true); // 忽略缓存强制刷新
  }, [fetchData]);

  // 依赖项变化或组件挂载时获取数据
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [...deps, fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh,
    lastFetched
  };
}

/**
 * 分页数据获取Hook
 * @param fetchFn 获取数据的函数，接收页码和每页条数
 * @param options 配置选项
 * @returns 分页数据、加载状态、错误和分页控制函数
 */
export function usePaginatedData<T>(
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  options: {
    initialPage?: number;
    pageSize?: number;
    deps?: any[];
  } = {}
) {
  const {
    initialPage = 1,
    pageSize = 10,
    deps = [],
  } = options;

  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取数据
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn(page, pageSize);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error('Error fetching paginated data:', err);
      setError(getUserFriendlyErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, page, pageSize]);

  // 翻页
  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 下一页
  const nextPage = useCallback(() => {
    setPage(p => Math.min(p + 1, Math.ceil(total / pageSize)));
  }, [total, pageSize]);

  // 上一页
  const prevPage = useCallback(() => {
    setPage(p => Math.max(p - 1, 1));
  }, []);

  // 依赖项变化或组件挂载时获取数据
  useEffect(() => {
    fetchData();
  }, [page, pageSize, ...deps, fetchData]);

  return {
    data,
    isLoading,
    error,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    goToPage,
    nextPage,
    prevPage,
    refresh: fetchData,
  };
} 