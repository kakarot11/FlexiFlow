# FlexCRM: AI-Powered CRM System

## Overview

FlexCRM is an AI-powered Customer Relationship Management (CRM) system designed to automate workflow tasks across different business domains. The application features contact management, workflow automation, AI agents, task tracking, and customizable templates for different business domains.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

FlexCRM follows a modern full-stack JavaScript architecture with clear separation between client and server components:

1. **Frontend**: React-based SPA with TypeScript
2. **Backend**: Express.js API server with TypeScript
3. **Database**: PostgreSQL with Drizzle ORM
4. **State Management**: React Query for server state management
5. **UI Framework**: Tailwind CSS with shadcn/ui components
6. **AI Integration**: OpenAI API for workflow suggestions and content generation

The application follows a modular architecture with clean separation of concerns:

- `client/` - Frontend React application
- `server/` - Express.js API server
- `shared/` - Shared TypeScript types and database schemas
- `migrations/` - Database migration files

## Key Components

### Frontend Components

1. **Page Components** (`client/src/pages/`):
   - Dashboard - Main overview of system metrics and activities
   - Workflows - Create and manage business workflow templates
   - AI Agents - Configure and deploy automated AI assistants
   - Tasks - Track and manage action items
   - Contacts - Manage customer/client relationships
   - Settings - System configuration

2. **UI Components** (`client/src/components/ui/`):
   - Built on shadcn/ui component library
   - Enhanced with custom components for app-specific functionality
   - Theme system supporting light/dark modes

3. **Layout Components** (`client/src/components/layouts/`):
   - App layout with responsive sidebar and topnav
   - Dashboard-specific components for data visualization

4. **Hooks and Utilities** (`client/src/hooks/`, `client/src/lib/`):
   - Custom React hooks for common functionality
   - API utilities for data fetching
   - OpenAI integration utilities

### Backend Components

1. **API Routes** (`server/routes.ts`):
   - RESTful endpoints for data operations
   - Authentication endpoints
   - AI integration endpoints

2. **Storage Layer** (`server/storage.ts`):
   - Database abstraction layer
   - Interface for data operations

3. **Database Schema** (`shared/schema.ts`):
   - Drizzle ORM schema definitions
   - Data validation with Zod

4. **OpenAI Integration** (`server/` and `client/src/lib/openai.ts`):
   - Workflow suggestion generation
   - Email and content generation

## Data Flow

1. **Client-Server Communication**:
   - React components use React Query to fetch data from the Express API
   - API requests are made with proper error handling
   - Responses are cached and invalidated as needed

2. **Database Operations**:
   - Express routes receive requests
   - Storage layer handles database operations through Drizzle ORM
   - Results are returned as JSON responses

3. **AI Integration Flow**:
   - User inputs are processed in the frontend
   - Requests are sent to OpenAI through server endpoints
   - AI-generated content is returned to the frontend for display/use

## External Dependencies

### Frontend

- **React**: Core UI library
- **Wouter**: Lightweight router
- **React Query**: Data fetching and caching
- **shadcn/ui**: Component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Backend

- **Express.js**: Web server framework
- **Drizzle ORM**: Database ORM
- **OpenAI**: AI service integration
- **Zod**: Schema validation

### Database

- **PostgreSQL**: Relational database (via Neon Database serverless)
- **@neondatabase/serverless**: Serverless PostgreSQL client

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**:
   - Frontend: Vite builds static assets
   - Backend: esbuild bundles server code

2. **Runtime Environment**:
   - Node.js 20
   - PostgreSQL 16

3. **Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `OPENAI_API_KEY`: OpenAI API key
   - `NODE_ENV`: Environment mode (development/production)

4. **Replit Configuration**:
   - Configured in `.replit` file
   - Uses replit-specific plugins for error handling and development experience

The deployment process is automated through Replit's deployment system, with separate commands for development and production environments.

## Database Schema

The database schema consists of several primary entities:

1. **Users**: Application users with authentication details
2. **Contacts**: Customer/client information
3. **Workflows**: Business process templates
4. **Workflow Steps**: Individual steps within workflows
5. **AI Agents**: Configured AI assistants
6. **Tasks**: Actionable items associated with workflows and contacts
7. **Activities**: Logs of user and system actions
8. **Domain Templates**: Pre-configured business domain templates

The schema is defined using Drizzle ORM with proper relationships and constraints.
