# Betting SRL - Italian Casino & Sports Betting Platform

## Overview

This is a full-stack web application for an Italian casino games and sports betting platform called "Betting SRL". The application features a modern React frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM. The platform provides casino game reviews, sports news, promotional codes, and user management for Italian players.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for development and production builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for page transitions and animations
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript (ESM modules)
- **Framework**: Express.js REST API
- **Authentication**: Passport.js with local strategy and session management
- **File Upload**: Multer for handling image uploads
- **Email Service**: SendGrid for transactional emails
- **External APIs**: GNews API for sports news integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with schema-first approach
- **Session Storage**: In-memory store for development
- **File Storage**: Local filesystem for uploaded images

## Key Components

### Database Schema
The application uses a multi-table schema with multilingual support:
- `users` - Admin authentication and user management
- `games` - Casino games with English/Italian translations
- `reviews` - Game reviews with multilingual content
- `news` - Sports news articles with translation support
- `guides` - Gaming guides and tutorials
- `promoCodes` - Promotional codes and offers
- `outlets` - Partner casino/betting site information
- `subscribers` - Newsletter subscription management
- `advertisementBanners` - Advertisement management

### Authentication System
- Role-based access control (Admin, Site Owner roles)
- Session-based authentication with password hashing (scrypt)
- Protected routes for admin functionality
- User approval system for new administrator accounts

### Content Management
- Full CRUD operations for all content types
- Image upload and management with drag-and-drop gallery
- Multilingual content support (English/Italian)
- Featured content highlighting system
- SEO-optimized slugs and metadata

### Email Integration
- Welcome emails for new subscribers  
- Promotional code notifications
- Password reset functionality
- Admin invitation system
- Newsletter subscription confirmations

## Data Flow

1. **Client Requests**: React frontend makes API calls via TanStack Query
2. **Authentication**: Express middleware validates sessions for protected routes
3. **Database Operations**: Drizzle ORM handles PostgreSQL queries with type safety
4. **Content Delivery**: Static assets served via Express with proper MIME types
5. **External Data**: GNews API integration for real-time sports news
6. **Email Notifications**: SendGrid processes transactional emails asynchronously

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection pooling
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives
- **@sendgrid/mail**: Email service integration
- **passport**: Authentication middleware

### Development Tools
- **vite**: Fast development server and bundler
- **tsx**: TypeScript execution for server
- **tailwindcss**: Utility-first CSS framework
- **zod**: Runtime type validation
- **framer-motion**: Animation library

### External Services
- **Neon Database**: Serverless PostgreSQL hosting
- **SendGrid**: Email delivery service
- **GNews API**: Sports news content aggregation

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module provisioned
- **Development Server**: Runs on port 5000 via `npm run dev`
- **Hot Reload**: Vite HMR with runtime error overlays

### Production Deployment
- **Target Platform**: Debian 12 VM with Node.js 20
- **Build Process**: Vite builds client assets, esbuild bundles server
- **Process Management**: PM2 with clustering for high availability
- **Reverse Proxy**: Nginx for SSL termination and static file serving
- **Static Assets**: Served from `/dist/public` directory
- **Database**: PostgreSQL (local or Neon serverless recommended)

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SENDGRID_API_KEY`: Email service authentication (optional)
- `GNEWS_API_KEY`: News API integration (optional)
- `SESSION_SECRET`: Session encryption key

### Deployment Documentation
Complete deployment instructions available in `DEPLOYMENT_GUIDE.md` including:
- System prerequisites and setup
- SSL certificate configuration
- Security hardening
- Performance optimization
- Monitoring and backup strategies

## Changelog
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.