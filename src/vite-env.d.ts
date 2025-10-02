/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DEBUG: boolean;
  readonly VITE_API_TIMEOUT: false | number | undefined;
}
