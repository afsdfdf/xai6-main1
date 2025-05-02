export const fallbackLng = 'zh';
export const defaultNS = 'common';
export const supportedLngs = ['en', 'zh'];

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // 调试选项
    debug: process.env.NODE_ENV === 'development',
    
    // 支持的语言
    supportedLngs,
    
    // 回退语言
    fallbackLng,
    
    // 默认命名空间
    defaultNS,
    
    // 资源命名空间
    ns,
    
    // 当前语言
    lng,
    
    // 插值配置
    interpolation: {
      escapeValue: false, // 不转义HTML内容
    },
    
    // 加载失败时行为
    returnNull: false,
    returnEmptyString: false,
    
    // React特定配置
    react: {
      useSuspense: false, // 不使用Suspense
    },
  };
} 