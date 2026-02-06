# Copilot Instructions - IT Portfolio Manager Frontend

## Project Overview
This is a Qwik-based SPA for managing IT project efforts and skills at Claranet. Features hybrid encryption (RSA+AES), role-based access control, and multi-provider authentication.

## Architecture Essentials

### State Management
- **AppContext** (`src/app.tsx`): Global state for configuration, notifications, loading state
- **CipherContext** (`src/context/cipherContext.ts`): State machine tracking encryption initialization (`uninitialized` → `companyCodeNotCreated` → `dataEncryptionRequired` → `companyCodeRequired` → `initialized`)
- Use Qwik's `useStore()` + `useContextProvider()` for reactive state (no Redux)

### Routing Pattern
- Manual routing in `src/router.tsx` - maps route strings to JSX components
- Navigate with `navigateTo(route, params?)` - pushes history and dispatches popstate
- Route params parsed from query strings: `getRouteParams()` returns `Record<string, string[]>`
- Public routes (auth, privacy_policy, etc.) bypass layout; private routes require authentication + cipher initialization

### Authentication & Security
- Multi-provider auth via Auth0 (`src/hooks/useAuth.ts`): Claranet, Google, Microsoft
- JWT stored in localStorage (`authToken`), auto-injected in all HTTP requests (`src/network/httpRequest.ts`)
- **Encryption**: Company data encrypted client-side using hybrid cipher (`src/utils/cipher.ts`)
  - Password stored as `company_code` in localStorage
  - Cipher initialization blocks app until completed (see `app.tsx` useTask$)
- 401 errors trigger auto-logout redirect to `/auth?msg=401` via `addHttpErrorListener()`

### HTTP Communication
- All backend calls go through `src/network/httpRequest.ts` helpers:
  - `getHttpResponse<T>()` - JSON response parsing
  - `multipartHttpRequest()` - FormData uploads
- Services layer (`src/services/`) wraps endpoints (e.g., `cipher.ts`, `configuration.ts`, `effort.ts`)
- Base URL from `VITE_BACKEND_URL` environment variable

## Development Workflow

### Commands
```bash
pnpm install            # Install dependencies (required first time)
pnpm run dev            # Start dev server (localhost:5173)
pnpm run build          # TypeScript compile + Vite build → dist/
pnpm run test           # Run Vitest tests
pnpm run test:watch     # Run tests in watch mode
pnpm run fmt            # Format with Prettier
pnpm run preview        # Serve production build locally
```

### Component Patterns
- Use `component$()` wrapper for all components
- Event handlers wrapped in `$()` for code-splitting: `onClick$={}`
- Use `useSignal()` for local reactive state, `useStore()` for object state
- `useTask$()` for mount-time logic, `useVisibleTask$()` for browser-only/visible logic
- Wrap non-serializable objects with `NoSerialize<T>` (cipher functions, WebCrypto APIs)

### Code Style
- Tabs (width 4), single quotes, semicolons, 100-char line width (see `.prettierrc`)
- Tailwind classes for styling + Flowbite components (initialized via `initFlowbite()`)
- Pre-commit hook auto-formats staged files via husky + lint-staged

## Common Patterns

### Adding a New Route
1. Create page component in `src/pages/YourPage.tsx`
2. Add route entry in `src/router.tsx` routes object
3. Update `PUBLIC_ROUTES` constant if public, or add menu item in `src/components/Header.tsx` if private
4. Handle role-based access via `getRoleBasedMenu()` if restricted

### Role-Based Access
- Role hierarchy: `SUPERADMIN` > `ADMIN` > `TEAM_LEADER` > `USER` (see `src/utils/acl.ts`)
- Check access: `const { role } = await getACLValues()` then compare via `roleHierarchy[requiredRole] <= roleHierarchy[role]`
- Menu items auto-hide based on role in `getRoleBasedMenu()`

### Notifications
- Use `useNotification()` hook to show toasts: `showNotification(message, type)`
- Types: `success`, `error`, `info`, `warning`
- HTTP errors auto-trigger error toasts via `addHttpErrorListener()`

### Form Components
- Custom form components in `src/components/form/` (Autocomplete, Multiselect, DateRange, etc.)
- Integrate with Flowbite for consistent UI patterns

## Testing
- Vitest + jsdom + @testing-library/jest-dom
- Test files in `src/test/` directory
- Setup file: `vitest.setup.ts` initializes Qwik globals
- Mock localStorage: `vi.spyOn(Storage.prototype, 'getItem')`
- Run with `pnpm test` or `pnpm test:watch`

## Key Files Reference
- `src/app.tsx` - Root component, context providers, auth/cipher initialization
- `src/router.tsx` - Custom routing logic
- `src/network/httpRequest.ts` - HTTP utilities with auto token injection
- `src/utils/cipher.ts` - Hybrid encryption wrapper
- `src/utils/token.ts` - JWT management
- `src/utils/acl.ts` - Role-based access control
- `src/hooks/useAuth.ts` - Multi-provider authentication
- `src/hooks/useCipher.ts` - Cipher state machine
