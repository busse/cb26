# CB26 Editor

A bespoke Electron-based markdown editor for managing the cb26 site content locally. Features an editorial aesthetic matching the main site with a three-panel UI for article management.

## Features

- **Navigator Panel** (left): Browse and search articles by collection (talks, posts, projects, news, photos)
- **Editor Panel** (center): CodeMirror 6 markdown editor with edit/split/preview modes
- **Properties Panel** (right): Schema-driven form for editing frontmatter properties

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd editor
npm install
```

### Development

Run the Vite dev server with Electron:

```bash
npm run electron:dev
```

Or run just the Vite dev server (for UI development):

```bash
npm run dev
```

### Building

Build the Electron app for distribution:

```bash
npm run electron:build
```

## Project Structure

```
editor/
├── electron/              # Electron main process
│   ├── main.ts           # App lifecycle and IPC handlers
│   ├── preload.ts        # Secure bridge to renderer
│   └── fileService.ts    # File system operations
├── shared/               # Shared types and schemas
│   ├── types.ts          # TypeScript interfaces
│   └── schemas.ts        # Zod validation schemas
├── src/                  # React renderer
│   ├── components/
│   │   ├── Navigator/    # Article tree navigation
│   │   ├── Editor/       # Markdown editing
│   │   └── Properties/   # Frontmatter form
│   ├── hooks/
│   │   └── useArticle.ts # Article state management
│   └── styles/
│       └── editor.css    # Editorial aesthetic
└── package.json
```

## Content Directory

The editor reads and writes markdown files from the site's content directory:

```
../site/src/content/
├── talks/
├── posts/
├── projects/
├── news/
└── photos/
```

## Tech Stack

- **Electron** - Desktop app framework
- **Vite** - Fast development and bundling
- **React 18** - UI components
- **CodeMirror 6** - Markdown editor
- **remark/rehype** - Markdown processing
- **gray-matter** - Frontmatter parsing
- **Zod** - Schema validation
