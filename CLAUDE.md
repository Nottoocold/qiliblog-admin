# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite admin dashboard application for a blog platform. The application uses Ant Design for UI components and React Router for navigation.

## Project Structure

- `src/App.tsx` - Main application component
- `src/main.tsx` - Entry point
- `src/router/` - Route configuration
- `src/layout/` - Layout components (ManagerLayout, ProtectManagerLayout)
- `src/pages/` - Page components (home, login, user, tag, post)
- `src/components/` - Reusable components
- `src/services/` - API service functions
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions
- `src/store/` - State management (Zustand)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Preview production build
npm run preview
```

## Architecture

1. **Routing**: Uses React Router with a centralized route configuration in `src/router/router.tsx`
2. **Layout**: Main layout with sidebar navigation and header in `src/layout/ManagerLayout.tsx`
3. **Authentication**: Route protection with `ProtectManagerLayout` component
4. **State Management**: Uses Zustand for global state management
5. **UI Framework**: Ant Design components
6. **HTTP Client**: Uses Ky for HTTP requests
7. **Styling**: Uses Less CSS preprocessor
8. **Alias**: Uses `@` alias for src directory (`@/components`, `@/pages`, etc.)

## Authentication & HTTP Client

The application uses JWT-based authentication with automatic token refresh:

- `src/utils/http.tsx` - HTTP client built on Ky with interceptors for:
  - Automatic token attachment to requests
  - Automatic token refresh on 401 responses
  - Business error handling (non-zero errorCode)
  - Support for debug mode and error notifications via Ant Design Message
  - Queue management for concurrent requests during token refresh
- `src/utils/tokenUtils.tsx` - Token storage and management utilities
- `src/services/auth.api.ts` - Authentication API functions
- All API services extend base URL with `/admin` prefix

## Route Protection

- `src/components/AntdAppWrapper/AntdAppWrapper.tsx` - Provides Ant Design context for HTTP client message notifications
- `src/layout/ProtectManagerLayout.tsx` - Wraps ManagerLayout to enforce authentication
- `src/components/Access/RouteGuard.tsx` - Protects routes requiring authentication
- Routes use `meta` configuration with properties like `hideInMenu`, `hideInBreadcrumb`, `icon`, etc.

## Environment Configuration

- `src/config/env.ts` - Centralized environment variable configuration
- `vite.config.ts` - Proxy setup for `/api` to `http://localhost:8080`
- Environment variables include:
  - `VITE_APP_DEBUG`: Enable debug logging
  - `VITE_API_TIMEOUT`: API timeout configuration (default: 30000ms)
  - `VITE_APP_VERSION`: Application version

## State Management Pattern

Zustand stores follow this pattern (see `src/store/userStore.ts`, `src/store/userTheme.ts`):

- Stores use the `persist` middleware for localStorage persistence
- Only necessary state properties are persisted (see `partialize` option)
- Clear functions also clean up localStorage to prevent stale data
- Use `useShallow` from zustand to prevent unnecessary re-renders when selecting state

## Code Quality

- ESLint with TypeScript ESLint plugin
- Prettier for code formatting (run `npm run format` before commits)
- React Hooks linting rules
- Strict TypeScript compiler options
- 对于当前项目，你要基于已有实现，框架的能力或使用的依赖的能力，来解决我提出的问题

## API Service Pattern

API services follow this pattern (see `src/services/tag.api.ts`):

```typescript
import httpClient from '@/utils/http';

export const serviceApi = httpClient.extend(options => ({
  prefixUrl: `${options.prefixUrl}/admin`,
}));

export const functionName = (params) => {
  return serviceApi.get('endpoint', { searchParams }).json<ResponseType>();
};
```

- All API services use the extended httpClient with `/admin` prefix
- API functions accept typed parameters and return typed responses
- URL parameter serialization handled by `serializeParams` utility

## Type Definitions

- Domain-specific types are defined in `src/types/` directory
- API request/response types follow the pattern: `FunctionNameParams`, `FunctionNameResponse`
- Common types include `category.d.ts`, `tag.d.ts`, `post.d.ts`, `user.d.ts`
- Server response types use a common `ApiResult<T>` wrapper with `errorCode`, `errorDesc`, and `data` fields
