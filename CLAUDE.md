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
3. **Authentication**: Route protection with `RouteGuard` component
4. **State Management**: Uses Zustand for global state management
5. **UI Framework**: Ant Design components
6. **HTTP Client**: Uses Ky for HTTP requests
7. **Styling**: Uses Less CSS preprocessor
8. **Alias**: Uses `@` alias for src directory (`@/components`, `@/pages`, etc.)

## TypeScript Configuration

- Uses modern TypeScript with strict mode enabled
- Path aliasing configured for cleaner imports
- Separate configurations for app and node code

## Code Quality

- ESLint with TypeScript ESLint plugin
- Prettier for code formatting
- React Hooks linting rules
- Strict TypeScript compiler options