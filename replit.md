# Betting SRL - Gaming Review Platform

## Overview

Betting SRL is a comprehensive Italian gaming review platform built with a modern full-stack architecture. The application provides casino reviews, sports betting insights, news aggregation, and promotional content for Italian players. It features a multilingual interface (English/Italian), admin dashboard, and integrated email services.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for global state
- **Routing**: Wouter for lightweight client-side routing
- **Animation**: Framer Motion for smooth page transitions and interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local strategy and express-session
- **File Uploads**: Multer for handling image uploads
- **Email Service**: SendGrid for transactional emails

### Development Environment
- **Platform**: Replit with autoscale deployment
- **Database**: PostgreSQL 16 module
- **Package Manager**: npm with lockfile version 3
- **Development Server**: Hot reloading with Vite HMR

## Key Components

### Database Schema
- **Users**: Admin authentication with role-based permissions
- **Games**: Multilingual game catalog with ratings and metadata
- **Reviews**: Detailed game reviews with localized content
- **News**: Sports betting news aggregation from external APIs
- **Guides**: Gaming guides and tutorials
- **Outlets**: Partner casino/betting site information
- **Promo Codes**: Exclusive promotional offers
- **Advertisement Banners**: Marketing content management

### Authentication System
- Local authentication strategy with hashed passwords
- Session-based authentication with memory store
- Role-based access control (admin/user)
- User approval workflow for new administrators

### Content Management
- Full CRUD operations for all content types
- Image upload and management system
- Drag-and-drop gallery interface for media
- Multilingual content support (English/Italian)
- SEO-optimized URLs with slug generation

### External Integrations
- **GNews API**: Automated sports news aggregation
- **SendGrid**: Email notifications and marketing
- **Stripe**: Payment processing (configured but not implemented)

## Data Flow

### Content Creation Flow
1. Admin creates content through dashboard forms
2. Content is validated using Zod schemas
3. Images are uploaded to local file system
4. Database records are created with multilingual fields
5. Content is immediately available on public site

### Authentication Flow
1. User submits credentials via login form
2. Passport.js validates against database
3. Session is created and stored in memory
4. Protected routes check session validity
5. Admin routes require additional role verification

### News Aggregation Flow
1. GNews API is called periodically for sports content
2. Articles are cached for 10 minutes to reduce API calls
3. Content is converted to internal news format
4. News items are served through unified API

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **Authentication**: passport, express-session for auth
- **Email**: @sendgrid/mail for email delivery
- **File Upload**: multer for handling multipart forms
- **Validation**: zod for runtime type checking

### UI Dependencies
- **Component Library**: @radix-ui components for accessibility
- **Styling**: tailwindcss with @tailwindcss/vite
- **Icons**: lucide-react for consistent iconography
- **Animations**: framer-motion for smooth transitions
- **Drag & Drop**: @dnd-kit for sortable interfaces

### Development Dependencies
- **Build**: esbuild for server bundling
- **Runtime**: tsx for TypeScript execution
- **Types**: @types packages for Node.js and other libraries

## Deployment Strategy

### Production Build
- Client assets built with Vite to `dist/public`
- Server bundled with esbuild to `dist/index.js`
- Static assets served from Express with proper MIME types
- Database migrations applied via `drizzle-kit push`

### Environment Configuration
- **DATABASE_URL**: Required for PostgreSQL connection
- **SENDGRID_API_KEY**: Optional for email functionality
- **GNEWS_API_KEY**: Optional for news aggregation
- **NODE_ENV**: Controls development/production behavior

### File Structure
- `/client`: React frontend application
- `/server`: Express backend application
- `/shared`: Shared TypeScript types and schemas
- `/public`: Static assets and uploaded files
- `/migrations`: Database migration files

### Replit Configuration
- Autoscale deployment target for production
- Port 5000 mapped to external port 80
- Automatic dependency installation and server startup
- Development workflow with hot reloading

## Changelog
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.