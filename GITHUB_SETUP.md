# GitHub Setup Guide for Betting SRL

## Prerequisites
- GitHub account
- Git installed on your local machine
- Access to the Replit project

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `betting-srl`
   - **Description**: `Italian Casino & Sports Betting Platform - Full-stack React/Node.js application`
   - **Visibility**: Choose Public or Private
   - **Initialize**: Do NOT initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Export Project from Replit

### Option A: Download ZIP (Recommended)
1. In Replit, go to **Tools** → **Export**
2. Click **Download as ZIP**
3. Extract the ZIP file on your local machine

### Option B: Clone via Git (Alternative)
1. In Replit, get the Git URL from the **Version Control** tab
2. Clone to your local machine:
   ```bash
   git clone <replit-git-url> betting-srl
   cd betting-srl
   ```

## Step 3: Setup Local Repository

Open terminal/command prompt in your project directory:

```bash
# Navigate to your project directory
cd betting-srl

# Initialize git (if not already done)
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Complete Betting SRL platform

- Full-stack React/TypeScript frontend
- Express.js backend with PostgreSQL
- Multilingual support (Italian/English)
- GNews API integration for sports news
- Complete admin panel and user management
- Responsive design with Tailwind CSS
- Production-ready with deployment guide"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/betting-srl.git

# Push to GitHub
git push -u origin main
```

## Step 4: Verify Upload

1. Go to your GitHub repository
2. Verify all files are uploaded correctly
3. Check that the README.md displays properly

## Step 5: Set Repository Description and Topics

1. In your GitHub repository, click the gear icon (⚙️) next to "About"
2. Add description: `Italian Casino & Sports Betting Platform - Full-stack React/Node.js application`
3. Add topics (tags): `react`, `typescript`, `nodejs`, `express`, `postgresql`, `tailwindcss`, `casino`, `sports-betting`, `italian`, `full-stack`
4. Add website URL (if deployed)

## Step 6: Create Release (Optional)

1. Go to **Releases** tab in your repository
2. Click **Create a new release**
3. Tag version: `v1.0.0`
4. Release title: `Initial Release - Complete Betting SRL Platform`
5. Add release notes:
   ```markdown
   ## 🎉 Initial Release - Betting SRL Platform
   
   Complete Italian casino and sports betting platform with:
   
   ### ✨ Features
   - Full-stack React + Node.js application
   - Multilingual support (Italian/English)
   - 8 featured casinos with authentic branding
   - Real-time sports news via GNews API
   - Complete admin panel
   - Responsive design
   
   ### 🛠️ Technical Stack
   - Frontend: React 18, TypeScript, Tailwind CSS
   - Backend: Express.js, PostgreSQL, Drizzle ORM
   - Authentication: Passport.js with sessions
   - APIs: GNews, SendGrid integration
   
   ### 🚀 Deployment
   - Complete deployment guide included
   - Debian 12 production setup
   - Docker configuration ready
   - PM2 process management
   
   Ready for production deployment!
   ```

## Step 7: Configure Repository Settings

### Branch Protection (Recommended)
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks
   - Restrict pushes to main

### Collaborators (If team project)
1. Go to **Settings** → **Collaborators**
2. Add team members with appropriate permissions

## Step 8: Set Up GitHub Actions (Optional)

Create `.github/workflows/ci.yml` for automated testing:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run type checking
      run: npm run check
    
    - name: Build application
      run: npm run build
```

## Troubleshooting

### If you get authentication errors:
1. Use GitHub CLI: `gh auth login`
2. Or use personal access token instead of password
3. Or use SSH key authentication

### If repository already exists:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/betting-srl.git
```

### If files are too large:
1. Check .gitignore includes `node_modules/`, `dist/`, `.env*`
2. Remove large files: `git rm --cached large-file.ext`
3. Use Git LFS for large assets if needed

## Next Steps

1. **Set up CI/CD**: Configure GitHub Actions for automatic deployment
2. **Documentation**: Keep README.md updated with any changes
3. **Issues**: Use GitHub Issues for bug tracking and feature requests
4. **Wiki**: Create detailed documentation in repository wiki
5. **Security**: Enable security advisories and dependency scanning

## Repository Structure

Your GitHub repository will contain:
```
betting-srl/
├── README.md              # Project documentation
├── DEPLOYMENT_GUIDE.md    # Production deployment guide
├── GITHUB_SETUP.md        # This file
├── package.json           # Dependencies and scripts
├── .gitignore            # Git ignore rules
├── client/               # React frontend
├── server/               # Express backend
├── shared/               # Shared types and schemas
├── attached_assets/      # Static assets
└── public/               # Public files
```

## Support

If you encounter any issues:
1. Check GitHub's documentation
2. Verify your Git configuration
3. Ensure all files are properly committed
4. Check repository permissions

Your Betting SRL platform is now ready for collaborative development and deployment!