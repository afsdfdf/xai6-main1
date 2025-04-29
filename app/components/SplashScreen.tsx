"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1.05);

  useEffect(() => {
    // 进入动画
    setTimeout(() => {
      setScale(1);
    }, 100);

    // 淡出动画
    setTimeout(() => {
      setOpacity(0);
    }, 2500);

    // 动画完成后调用onComplete
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
  }, [onComplete]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black"
      style={{
        opacity,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      <div 
        className="relative flex flex-col items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transition: 'transform 0.5s ease-out',
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
      >
        <div className="relative w-full max-w-md mx-auto">
          <Image
            src="/images/splash.png"
            alt="XAI Crypto Tracker"
            width={500}
            height={500}
            priority
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain w-full h-auto"
          />
        </div>
        <h1 className="text-white text-2xl md:text-3xl font-bold mt-6">XAI Crypto Tracker</h1>
        <p className="text-gray-300 mt-2">追踪您的加密资产</p>
      </div>
    </div>
  )
}

export default SplashScreen 