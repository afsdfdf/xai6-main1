/**
 * React性能优化工具
 */
import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * 防抖钩子 - 延迟执行函数，在一定时间内多次调用只执行最后一次
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 * @param deps 依赖数组
 * @returns 防抖函数
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 清除防抖定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [...deps, delay]);
}

/**
 * 节流钩子 - 限制函数在一定时间内最多执行一次
 * @param fn 要执行的函数
 * @param limit 时间限制（毫秒）
 * @param deps 依赖数组
 * @returns 节流函数
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 清除节流定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const elapsed = now - lastRunRef.current;
    
    lastArgsRef.current = args;
    
    const execute = () => {
      lastRunRef.current = Date.now();
      lastArgsRef.current = null;
      fn(...args);
    };

    if (elapsed >= limit) {
      execute();
    } else if (!timeoutRef.current) {
      // 设置一个定时器来执行剩余时间后的函数
      timeoutRef.current = setTimeout(() => {
        if (lastArgsRef.current) {
          execute();
        }
        timeoutRef.current = null;
      }, limit - elapsed);
    }
  }, [...deps, limit]);
}

/**
 * 测量组件渲染性能
 * @param componentName 组件名称
 * @returns 带有启动和停止方法的对象
 */
export function useRenderTracking(componentName: string) {
  const startTimeRef = useRef<number>(0);
  
  const start = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);
  
  const stop = useCallback(() => {
    if (startTimeRef.current) {
      const endTime = performance.now();
      const elapsed = endTime - startTimeRef.current;
      console.log(`[性能] ${componentName} 渲染耗时: ${elapsed.toFixed(2)}ms`);
      startTimeRef.current = 0;
    }
  }, [componentName]);
  
  return { start, stop };
}

/**
 * 图片懒加载 - 用于优化图片加载性能
 * @param src 图片URL
 * @param placeholder 占位图URL
 * @returns 当前应该显示的图片URL
 */
export function useImageLazyLoad(src: string, placeholder: string = '') {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    let observer: IntersectionObserver;
    let isUnmounted = false;
    
    if (imgRef.current && !isLoaded) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isUnmounted) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              if (!isUnmounted) {
                setImageSrc(src);
                setIsLoaded(true);
              }
            };
            observer.disconnect();
          }
        });
      });
      
      observer.observe(imgRef.current);
    }
    
    return () => {
      isUnmounted = true;
      if (observer) {
        observer.disconnect();
      }
    };
  }, [src, isLoaded]);
  
  return { imageSrc, isLoaded, imgRef };
} 