# Book Management App

This project is the Book Management application from the [Master Svelte 5 & SvelteKit – Build & Deploy Real-World Apps](https://www.udemy.com/share/10bZyt3@uUjRSezDyWX800hnbHIIihT4mCn4SblOukdKIU1QZ7qX12hNO6aoqyy7WOx3goTpAQ==/) course on Udemy.

## Project Features

- **Authentication & User Management**
  - User registration and login with Supabase
  - Protected routes and authenticated sessions
- **Book Management**
  - Create, read, update, and delete book entries
  - Book cover image upload and management
  - Book categorization and organization
- **AI Integration**
  - OpenAI-powered book cover recognition
  - Automatic book information extraction from images

## Development Setup

1. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn
```

2. Start the development server:

```bash
npm run dev
# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building for Production

Create a production version of the app:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

> Note: For deployment, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Technologies Used

### Core Stack

- Svelte 5 with Rune syntax
- SvelteKit 2
- TypeScript

### External Services

- Supabase (Authentication & Database)
- OpenAI (Image Recognition)

## Learning Objectives

This project demonstrates:

- Building a full-stack application with Svelte 5 and SvelteKit 2
- Implementing user authentication with Supabase
- Managing database operations (CRUD)
- Integrating AI services for image processing
- Using TypeScript in a Svelte project
- Handling file uploads and image processing
