# Habit Tracker PWA

A mobile-first Habit Tracker Progressive Web App (PWA) designed for simplicity, speed, and offline reliability. This application allows users to track their daily habits, maintain streaks, and manage their routines entirely within the browser.

## Project Overview

The Habit Tracker PWA is built to help users establish and maintain daily routines. It features a secure local authentication system, habit management (CRUD), and dynamic streak calculations. The app is designed to be installable and functional offline, ensuring that your progress is never interrupted.

## Setup Instructions

To set up the project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Xavviieerr/habit-tracker.git
    cd habit-tracker
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Run Instructions

To start the application in development mode:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

To build and start the production version:

```bash
npm run build
npm run start
```

## Test Instructions

The project includes a comprehensive test suite covering unit, integration, and end-to-end (E2E) testing.

- **Run all tests**:
  ```bash
  npm test
  ```

- **Run unit tests with coverage**:
  ```bash
  npm run test:unit
  ```

- **Run integration tests**:
  ```bash
  npm run test:integration
  ```

- **Run E2E tests**:
  ```bash
  npm run test:e2e
  ```

## Local Persistence Structure

The application uses `localStorage` for all data persistence, ensuring a deterministic and fast user experience without the need for a remote database.

### Storage Keys

-   `habit-tracker-users`: Stores a JSON array of registered users.
-   `habit-tracker-session`: Stores the current active session or `null`.
-   `habit-tracker-habits`: Stores a JSON array of all habits created by all users.

### Data Shapes

**User Object**:
```typescript
{
  id: string;
  email: string;
  password: string;
  createdAt: string;
}
```

**Session Object**:
```typescript
{
  userId: string;
  email: string;
} | null
```

**Habit Object**:
```typescript
{
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;
  completions: string[]; // ISO dates (YYYY-MM-DD)
}
```

## PWA Support Implementation

PWA support was implemented using a combination of a web manifest, a custom service worker, and the `@ducanh2912/next-pwa` plugin for Next.js.

-   **Web Manifest**: Located at `public/manifest.json`, it defines the app's appearance, icons, and start URL.
-   **Service Worker**: Located at `public/sw.js`, it implements an "App Shell" caching strategy. It pre-caches essential routes (`/`, `/login`, `/signup`, `/dashboard`) during installation and intercepts fetch requests to serve cached content when offline, preventing hard crashes.
-   **Next.js Integration**: Configured in `next.config.ts` to automate service worker generation and registration.

## Trade-offs and Limitations

-   **Local-Only Persistence**: Data is stored locally on the user's device. Clearing browser cache or switching devices will result in data loss unless an export/import mechanism is used (not implemented in this stage).
-   **Storage Limits**: `localStorage` is typically limited to 5-10MB depending on the browser, which is sufficient for thousands of habits but finite.
-   **No Cross-Device Sync**: Without a remote backend, users cannot sync their habits across multiple devices.
-   **Security**: Since passwords are stored in `localStorage` in plain text (for this stage's simplicity), it is not suitable for highly sensitive data on shared computers.

## Test Mapping

The following table maps each required test file to the behavior it verifies:

| Test File | Behavior Verified |
| :--- | :--- |
| `tests/unit/slug.test.ts` | Validates slug generation logic (lowercase, hyphenation, non-alphanumeric removal). |
| `tests/unit/validators.test.ts` | Verifies validation logic for habit names (length/presence), email format, and password length. |
| `tests/unit/streaks.test.ts` | Ensures correct streak calculation including consecutive days, missing days, and duplicates. |
| `tests/unit/habits.test.ts` | Validates the logic for toggling habit completions without mutating original objects. |
| `tests/integration/auth-flow.test.tsx` | Tests the Signup and Login UI flows, including error handling for duplicates and invalid credentials. |
| `tests/integration/habit-form.test.tsx` | Verifies the Habit CRUD UI flows: creating, editing, and deleting habits (with confirmation). |
| `tests/e2e/app.spec.ts` | Full user journeys including authentication, persistence across reloads, and offline App Shell functionality. |
