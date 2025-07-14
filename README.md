# Betting SRL - Italian Casino & Sports Betting Platform

A modern, full-stack web application for Italian casino games and sports betting content management. Built with React, TypeScript, and Express.js.

## 🎯 Features

- **Multilingual Support**: Complete Italian/English localization
- **Casino Games**: Comprehensive casino game reviews and ratings
- **Sports News**: Real-time sports news integration via GNews API
- **User Management**: Role-based authentication system
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui
- **SEO Optimized**: Clean URLs and meta tags for search engines
- **Admin Panel**: Full content management system

## 🚀 Live Demo

The application showcases authentic Italian casino content with:
- **8 Featured Casinos**: Sisal, PokerStars, Snai, Lottomatica, Betfair, Netwin, Eurobet, GoldBet
- **Real-time News**: Authentic sports news from Italian sources
- **Smart Caching**: 20-minute API cache for optimal performance
- **Secure Authentication**: Session-based user management

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** + shadcn/ui for styling
- **TanStack Query** for server state management
- **Framer Motion** for animations
- **Wouter** for routing

### Backend
- **Node.js** with Express.js
- **TypeScript** (ESM modules)
- **PostgreSQL** with Drizzle ORM
- **Passport.js** for authentication
- **Multer** for file uploads
- **SendGrid** for email services

### External APIs
- **GNews API** for sports news content
- **Neon Database** for PostgreSQL hosting
- **SendGrid** for transactional emails

## 📦 Installation

### Prerequisites
- Node.js 20 or higher
- PostgreSQL database
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/betting-srl.git
   cd betting-srl
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/betting_srl"
   SESSION_SECRET="your-secure-session-secret"
   GNEWS_API_KEY="your-gnews-api-key"
   SENDGRID_API_KEY="your-sendgrid-api-key"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🏗️ Project Structure

```
betting-srl/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data layer
│   ├── auth.ts            # Authentication
│   └── services/          # External services
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema
├── public/                # Static assets
└── attached_assets/       # Uploaded images
```

## 🚀 Production Deployment

### Quick Deploy Options

1. **Replit** (Recommended for development)
   - Fork this repository on Replit
   - Configure environment variables
   - Run automatically

2. **Debian/Ubuntu Server**
   - Follow the complete deployment guide in `DEPLOYMENT_GUIDE.md`
   - Includes Nginx, PM2, SSL setup, and monitoring

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm run start

# Database migrations
npm run db:push
```

## 📝 API Endpoints

### Public Routes
- `GET /api/games` - Get all casino games
- `GET /api/games/featured` - Get featured games
- `GET /api/news` - Get news articles
- `GET /api/sports-news` - Get sports news
- `GET /api/outlets` - Get casino outlets

### Admin Routes (Authentication Required)
- `POST /api/games` - Create new game
- `PUT /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game
- `POST /api/news` - Create news article
- `GET /api/users` - Manage users

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption key | Yes |
| `GNEWS_API_KEY` | GNews API key for sports news | Optional |
| `SENDGRID_API_KEY` | SendGrid API key for emails | Optional |
| `NODE_ENV` | Environment (development/production) | Optional |

### Database Schema

The application uses Drizzle ORM with the following main tables:
- `users` - User authentication and roles
- `games` - Casino games and reviews
- `news` - News articles and sports content
- `outlets` - Casino partner information
- `promo_codes` - Promotional offers

## 🎨 Features

### Content Management
- **Multilingual Content**: Full Italian/English support
- **Image Management**: Drag-and-drop image uploads
- **SEO Optimization**: Clean URLs and meta tags
- **Featured Content**: Highlight important games and news

### User Experience
- **Responsive Design**: Mobile-first approach
- **Fast Loading**: Optimized for performance
- **Smooth Animations**: Enhanced user interactions
- **Accessibility**: WCAG compliant components

### Admin Features
- **Role-based Access**: Admin and Site Owner roles
- **Content CRUD**: Full content management
- **User Management**: Approve and manage users
- **Analytics**: Performance monitoring

## 🔒 Security

- **Authentication**: Secure session-based auth
- **Password Hashing**: scrypt for password security
- **Input Validation**: Zod schema validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Session-based security

## 📊 Performance

- **Caching**: 20-minute API cache for news
- **Code Splitting**: Lazy-loaded components
- **Image Optimization**: Optimized asset delivery
- **Database Indexing**: Optimized queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful UI components
- **Tailwind CSS** for the utility-first CSS framework
- **GNews API** for authentic sports news content
- **Neon Database** for PostgreSQL hosting
- **Replit** for development platform

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for Italian casino and sports betting enthusiasts**