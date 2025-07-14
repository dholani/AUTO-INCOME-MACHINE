# AutoPost Pro - Affiliate Marketing Automation Platform

## Overview

AutoPost Pro is a comprehensive affiliate marketing automation platform that helps users manage affiliate campaigns, schedule social media posts, and track performance analytics. The application is built with a modern full-stack architecture using React, Express.js, PostgreSQL, and Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful endpoints with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage

### Key Components

#### Database Schema
The application uses a comprehensive schema with the following main entities:
- **Users**: Basic user authentication and profile information
- **Affiliate Accounts**: Integration with various affiliate platforms (EarnKaro, Admitad, Impact, JVZoo, WarriorPlus, ClickBank)
- **Social Accounts**: Connected social media platforms (Facebook, Twitter, LinkedIn, Instagram)
- **Campaigns**: Affiliate marketing campaigns with products and commission tracking
- **Content Templates**: Reusable content templates for social media posts
- **Scheduled Posts**: Automated post scheduling across social platforms
- **Links**: Affiliate link management and tracking
- **Analytics**: Performance metrics and engagement data
- **Automation Settings**: User preferences for automated posting and scheduling

#### Frontend Pages
- **Dashboard**: Overview with stats, recent activity, and quick actions
- **Accounts**: Management of affiliate and social media accounts
- **Campaigns**: Campaign creation, editing, and status management
- **Content Library**: Content template management and creation
- **Scheduler**: Post scheduling and calendar view
- **Analytics**: Performance tracking and reporting
- **Link Manager**: Affiliate link generation and tracking
- **Settings**: User preferences and automation configuration

#### API Endpoints
- Dashboard statistics and overview data
- CRUD operations for all major entities
- Bulk operations for content management
- Analytics and reporting endpoints
- Authentication and session management

## Data Flow

1. **User Authentication**: Users authenticate and establish sessions
2. **Account Integration**: Users connect affiliate networks and social media accounts
3. **Campaign Creation**: Users create campaigns with products and content
4. **Content Management**: Templates are created and managed in the content library
5. **Post Scheduling**: Content is scheduled for automated posting
6. **Analytics Collection**: Performance data is collected and analyzed
7. **Automation Engine**: Smart scheduling and posting based on user preferences

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Drizzle ORM**: Type-safe database queries and migrations
- **Connection Pooling**: Efficient database connection management

### UI Framework
- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **React Icons**: Additional social media icons

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production

### Social Media Integration
- Designed to integrate with major social platforms
- Token-based authentication for social accounts
- API integrations for posting and analytics

### Affiliate Network Integration
- Support for multiple affiliate networks
- API key management for secure connections
- Commission tracking and reporting

## Deployment Strategy

### Development
- Local development with Vite dev server
- TypeScript compilation and type checking
- Database schema management with Drizzle migrations

### Production Build
- Frontend assets built with Vite and output to `dist/public`
- Backend compiled with ESBuild to `dist/index.js`
- Environment-based configuration for database and external APIs

### Database Management
- Schema defined in `shared/schema.ts`
- Migrations stored in `./migrations` directory
- Push migrations with `npm run db:push`

### Environment Configuration
- `DATABASE_URL` required for PostgreSQL connection
- API keys for affiliate networks and social platforms
- Session secrets for secure authentication

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety between frontend and backend while maintaining clear separation of concerns.