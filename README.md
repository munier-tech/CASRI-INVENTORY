# CASRI Electronic Management System

A comprehensive inventory and sales management system with React frontend and Node.js backend.

## Project Structure

```
├── BACKEND/                 # Backend API (Node.js + Express)
│   ├── Controllers/         # API controllers
│   ├── Routes/             # API routes
│   ├── models/             # Database models
│   ├── lib/                # Database connections
│   ├── helpers/            # Helper functions
│   ├── middlewares/        # Express middlewares
│   ├── index.js           # Main server file
│   └── package.json       # Backend dependencies
├── FRONTEND1/              # Frontend (React + Vite)
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── dist/              # Built frontend (generated)
│   └── package.json       # Frontend dependencies
├── package.json           # Root package (minimal)
├── vercel.json           # Vercel deployment config
└── .env                  # Environment variables
```

## Development

### Prerequisites
- Node.js 18+
- MongoDB database
- Redis (optional, for production)

### Local Development

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run development servers:**
   ```bash
   # Run both frontend and backend
   npm run dev:all
   
   # Or run separately:
   npm run dev:backend  # Backend on port 5000
   npm run dev          # Frontend on port 5173
   ```

## Deployment on Vercel

### Automatic Deployment

1. **Connect your GitHub repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

2. **Set environment variables in Vercel dashboard:**
   ```
   MONGO_DB_URL=your_mongodb_connection_string
   TOKEN_SECRET_KEY=your_jwt_secret
   REFRESH_TOKEN_SECRET_KEY=your_refresh_secret
   REDIS_UPSTASH_URL=your_redis_url (optional)
   CORS_ORIGIN=https://your-app.vercel.app
   NODE_ENV=production
   ```

3. **Deploy:**
   - Push to main branch triggers automatic deployment
   - Or manually deploy from Vercel dashboard

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to configure
```

## Features

- **Authentication**: JWT-based user authentication
- **Product Management**: Create, update, delete products
- **Sales Tracking**: Daily sales and historical reports
- **Stock Management**: Inventory tracking with low stock alerts
- **Financial Logging**: Track financial transactions
- **Categories**: Product categorization
- **File Uploads**: Product images and documents
- **Responsive Design**: Mobile-friendly interface

## API Endpoints

- `GET /api` - API status
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/sales` - Get sales data
- `POST /api/sales` - Create sale record

## Environment Variables

```env
# Database
MONGO_DB_URL=mongodb://localhost:27017/your-db

# JWT Secrets
TOKEN_SECRET_KEY=your_access_token_secret
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret

# Redis (optional)
REDIS_UPSTASH_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=http://localhost:5173

# Server
PORT=5000
NODE_ENV=development
```

## Scripts

- `npm run dev:all` - Run both frontend and backend
- `npm run dev:backend` - Run backend only
- `npm run dev` - Run frontend only
- `npm run build:all` - Build both frontend and backend
- `npm run install:all` - Install all dependencies
- `npm run vercel-build` - Build for Vercel deployment