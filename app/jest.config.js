const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 指向Next.js应用的目录
  dir: './',
});

// 自定义Jest配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // 处理模块别名
    '^@/(.*)$': '<rootDir>/$1',
  },
  // 收集测试覆盖率信息
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/_*.{js,jsx,ts,tsx}',
    '!app/**/layout.{js,jsx,ts,tsx}',
    '!app/**/not-found.{js,jsx,ts,tsx}',
    '!app/**/*.stories.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  // 指定测试文件路径模式
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx|js|jsx)',
  ],
  // 转换器配置
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // 转换忽略模式
  transformIgnorePatterns: [
    '/node_modules/(?!(@swc/core|next)/)',
  ],
};

// 创建配置
module.exports = createJestConfig(customJestConfig); 