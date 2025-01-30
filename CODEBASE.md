# Flute Project Codebase Structure

This document provides an overview of the project's codebase organization and key files.

## Project Overview

Flute is an Electron-based desktop application built with React, TypeScript, and Vite. The project uses modern web technologies for the frontend and Electron for creating a cross-platform desktop application.

## Directory Structure

### Root Directory
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite configuration for building the application
- `tsconfig.json` - TypeScript configuration for the main application
- `tsconfig.node.json` - TypeScript configuration for Node.js environment
- `postcss.config.cjs` - PostCSS configuration for CSS processing
- `tailwind.config.js` - Tailwind CSS configuration
- `electron-builder.json5` - Electron Builder configuration for packaging
- `.eslintrc.cjs` - ESLint configuration for code linting
- `index.html` - Main HTML entry point

### Source Code (`src/`)
- `app/` - Main application components and layouts
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and shared libraries

### Electron (`electron/`)
- `main.ts` - Main Electron process file
- `preload.ts` - Preload script for Electron
- `electron-env.d.ts` - TypeScript declarations for Electron environment

### Build Output
- `dist-electron/` - Compiled Electron files
- `public/` - Static assets

### Configuration Files
- `.gitignore` - Git ignore rules
- `pnpm-lock.yaml` - PNPM package lock file

## Key Technologies

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Build Tools**: Vite
- **Desktop Runtime**: Electron
- **Package Manager**: PNPM

## Development

The project follows a modern development setup with:
- TypeScript for type safety
- ESLint for code quality
- Electron for desktop capabilities
- Vite for fast development and building
- Tailwind CSS for utility-first styling

## Building and Packaging

The application uses Electron Builder for creating distributable packages, configured through `electron-builder.json5`. The build process is managed through Vite and configured in `vite.config.ts`. 