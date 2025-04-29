'use client';

import { useEffect, useState } from 'react';
import { useTranslation as useTranslationOriginal } from 'react-i18next';
import { getOptions, supportedLngs, fallbackLng } from './settings';

// 模拟i18next实例
let i18nInstance = {
  language: 'zh',
  resolvedLanguage: 'zh',
  changeLanguage: (lng: string) => {
    i18nInstance.language = lng;
    i18nInstance.resolvedLanguage = lng;
    // 更新本地存储
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
    return Promise.resolve(lng);
  }
};

// 客户端i18next实例初始化
const runsOnServerSide = typeof window === 'undefined';

// 模拟useTranslation钩子
export function useTranslation(ns = 'common') {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // 从localStorage加载语言设置
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('i18nextLng');
      if (storedLang && supportedLngs.includes(storedLang)) {
        i18nInstance.language = storedLang;
        i18nInstance.resolvedLanguage = storedLang;
      }
    }
  }, []);
  
  // 模拟t函数
  const t = (key: string, options?: any) => {
    // 简单实现，仅返回key
    return key;
  };
  
  return {
    t,
    i18n: i18nInstance
  };
} 