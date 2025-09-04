# Single Repository Vercel Deployment Guide

This project is configured for single repository deployment on Vercel, combining both frontend and backend in one deployment.

## 🚀 Deployment Steps

### 1. Environment Variables
Set up these environment variables in your Vercel dashboard:

**Required:**
- `MONGO_DB_URL` - Your MongoDB connection string
- `TOKEN_SECRET_KEY` - Secret key for access tokens
- `REFRESH_TOKEN_SECRET_KEY` - Secret key for refresh tokens
- `NODE_ENV=production`

**Optional:**
- `REDIS_UPSTASH_URL` - Redis connection string (if using Redis)
- `CORS_ORIGIN` - Frontend URL for CORS (will auto-detect from VERCEL_URL if not set)

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Import the project
3. Vercel will automatically detect the configuration from `vercel.json`
4. Add environment variables in the dashboard
5. Deploy!

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add MONGO_DB_URL
vercel env add TOKEN_SECRET_KEY
vercel env add REFRESH_TOKEN_SECRET_KEY
vercel env add REDIS_UPSTASH_URL
vercel env add CORS_ORIGIN
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

## 📁 Project Structure

```
/
├── BACKEND/           # Express.js API
│   ├── index.js      # Main server file (exported for Vercel)
│   ├── Routes/       # API routes
│   ├── Controllers/  # Route controllers
│   └── models/       # Database models
├── FRONTEND1/        # React frontend
│   ├── src/          # Source files
│   ├── dist/         # Built files (generated)
│   └── package.json  # Frontend dependencies
├── uploads/          # File uploads directory
├── vercel.json       # Vercel configuration
└── package.json      # Root dependencies & build scripts
```

## 🔧 How It Works

### Build Process
1. `npm install` - Install root dependencies
2. `npm run build` - Builds frontend to `FRONTEND1/dist/`

### Routing
- `/api/*` → Backend (serverless function)
- `/uploads/*` → Static file uploads
- `/*` → Frontend (React SPA)

### Environment Detection
- Development: Uses `http://localhost:3000` for API calls
- Production: Uses relative URLs (`/api/*`)

## 🛠️ Local Development

```bash
# Install all dependencies
npm run install:all

# Start backend (development)
npm run dev

# Start frontend (in another terminal)
npm run dev:frontend
```

## 📝 Configuration Details

### vercel.json
- Configures serverless function for backend
- Sets up routing for API and static files
- Handles SPA routing for React

### Backend Changes
- Exports Express app for Vercel serverless
- Auto-detects production environment
- Handles CORS for Vercel domains

### Frontend Changes
- Uses environment-aware API URLs
- Builds to `dist/` directory
- Configured for SPA routing

## 🔍 Troubleshooting

### Common Issues:
1. **CORS Errors**: Check environment variables and CORS configuration
2. **API Not Found**: Ensure routes start with `/api/`
3. **Static Files**: Check upload directory permissions
4. **Build Failures**: Verify all dependencies are installed

### Logs:
```bash
# View deployment logs
vercel logs [deployment-url]

# View function logs
vercel logs --follow
```

## 🎯 Production Checklist

- [ ] Environment variables set in Vercel dashboard
- [ ] MongoDB connection string is correct
- [ ] JWT secret is secure and set
- [ ] CORS origins include your domain
- [ ] Build completes successfully
- [ ] API endpoints respond correctly
- [ ] Frontend loads and can communicate with backend
- [ ] File uploads work (if applicable)

Your app should now be deployed and accessible via your Vercel domain!