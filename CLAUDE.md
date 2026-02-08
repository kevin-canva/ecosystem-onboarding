# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Canva App that generates jokes and adds them to designs. It demonstrates a clean architecture following SOLID principles, with clear separation between UI components, state management hooks, and service layers.

## Tech Stack

- React 19.1.1 with TypeScript
- Canva Apps SDK (@canva/* packages)
- Webpack for bundling
- Jest for testing
- pnpm for package management

## Development Commands

### Setup
```bash
pnpm i                    # Install dependencies
```

### Development
```bash
pnpm start               # Start local dev server (default mode)
pnpm start:preview       # Start in preview mode
```

### Code Quality
```bash
pnpm lint                # Run ESLint
pnpm lint:fix            # Auto-fix ESLint issues
pnpm lint:types          # Type check with TypeScript
pnpm format              # Format all CSS/TS/TSX files
pnpm format:check        # Check formatting without changes
```

### Testing
```bash
pnpm test                # Run all tests
pnpm test:watch          # Run tests in watch mode
pnpm test:update         # Update test snapshots
```

### Build
```bash
pnpm build               # Production build + extract i18n messages
```

## Architecture

The codebase follows SOLID principles with clear separation of concerns:

### Directory Structure
```
src/
├── app.tsx              # Main orchestrator component
├── types/               # TypeScript interfaces and type definitions
├── services/            # Business logic (JokeApiService, JokeManagerService)
├── hooks/               # React hooks for state management (useJokeFetcher, useJokeHistory)
└── components/          # Reusable UI components (presentational)

utils/                   # Canva SDK utility hooks (use_add_element, use_selection_hook, etc.)
styles/                  # CSS modules
```

### Key Architectural Patterns

**Single Responsibility Principle**: Each file has one clear purpose:
- Services handle external APIs and business logic
- Hooks manage state and side effects
- Components handle presentation only
- Types define contracts

**Dependency Injection**: The app uses composition rather than tight coupling:
- Services are instantiated in components
- Hooks encapsulate state logic
- Components receive data via props

**Service Layer Pattern**:
- `JokeApiService`: Fetches jokes from external API
- `JokeManagerService`: Manages joke operations with Canva elements
- Both implement interfaces for easy swapping/testing

**Custom Hooks Pattern**:
- `useJokeFetcher`: Handles joke fetching with loading states
- `useJokeHistory`: Manages joke history operations

### Canva SDK Integration

The app uses several Canva SDK utilities from the `utils/` directory:
- `useAddElement()`: Adds elements to Canva designs
- `useSelection("plaintext")`: Manages text selection in designs

### Environment Configuration

The app requires environment variables in `.env`:
- `CANVA_BACKEND_HOST`: Backend server URL
- See `.env.template` for required variables

### Webpack Configuration

The `webpack.config.ts` uses path aliases:
- `assets`: Maps to `./assets`
- `utils`: Maps to `./utils`
- `styles`: Maps to `./styles`
- `src`: Maps to `./src`

Use these aliases in imports instead of relative paths.

### TypeScript Configuration

- Target: ES2019
- Strict mode enabled
- `noImplicitAny` disabled
- CSS modules support via path mapping

## Testing

Tests are located in `src/tests/` with snapshot testing enabled. The test setup uses:
- `ts-jest` for TypeScript support
- `jsdom` for DOM testing
- `@testing-library/react` for component testing
- `jest-css-modules-transform` for CSS module handling

## Canva App Manifest

The `canva-app.json` defines required permissions:
- `canva:design:content:read` (mandatory)
- `canva:design:content:write` (mandatory)

These allow the app to read and write content in Canva designs.

## Development Notes

- Node.js version: v18 or v20.10.0+ (see `.nvmrc`)
- Package manager: pnpm only (not npm/yarn)
- The app uses React 19's automatic JSX runtime
- CSS modules are enabled by default
- Source maps are generated in development mode
