'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Globe } from 'lucide-react';

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
];

export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  
  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentLanguage = i18n.language || 'zh';

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-2 ${
              currentLanguage === lang.code ? 'text-blue-400' : 'text-gray-300'
            } cursor-pointer hover:bg-gray-800`}
          >
            {currentLanguage === lang.code && <Check className="h-4 w-4" />}
            <span className={currentLanguage === lang.code ? 'ml-0' : 'ml-6'}>
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 