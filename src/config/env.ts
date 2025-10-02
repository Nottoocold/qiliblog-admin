// src/config/env.ts
interface EnvConfig {
  VITE_APP_DEBUG: boolean;
  VITE_API_TIMEOUT: number | false | undefined;
  VITE_APP_VERSION: string;
  // 其他环境变量...
}

export const envConfig: EnvConfig = {
  VITE_APP_DEBUG: Boolean(import.meta.env.VITE_APP_DEBUG),
  VITE_API_TIMEOUT:
    import.meta.env.VITE_API_TIMEOUT == 'false'
      ? false
      : Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
  // 其他环境变量的类型转换...
};
