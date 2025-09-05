# 🚀 Unified Vercel Deployment Guide

Your CASRI Management System is now configured for **unified deployment from the root directory**.

## ✅ What's Changed

- **Single package.json** in root with all dependencies
- **Unified build process** - everything deploys together
- **Simplified Vercel configuration** - no separate deployments needed

## 🚀 How to Deploy to Vercel

### **Method 1: Vercel Dashboard (Recommended)**

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "New Project"** → **"Import Git Repository"**

3. **Select your CASRI repository**

4. **Configure Project:**
   - **Project Name:** `casri-management-system`
   - **Framework Preset:** `Other`
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run vercel-build`
   - **Install Command:** `npm install && npm run install:all`
   - **Output Directory:** `FRONTEND1/dist`

5. **Set Environment Variables:**
   ```
   MONGO_DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database
   TOKEN_SECRET_KEY=your_jwt_secret_key
   REFRESH_TOKEN_SECRET_KEY=your_refresh_secret_key
   REDIS_UPSTASH_URL=your_redis_url (optional)
   CORS_ORIGIN=https://your-app-name.vercel.app
   NODE_ENV=production
   ```

6. **Click "Deploy"** 🎉

### **Method 2: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from your project root
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: casri-management-system
# - Directory: ./
# - Override settings? N
```

## 📁 Project Structure (Unified)

```
├── package.json          # All dependencies (backend + frontend)
├── vercel.json          # Vercel configuration
├── BACKEND/             # Backend code
│   ├── index.js        # Main server file
│   └── ...             # All backend files
├── FRONTEND1/          # Frontend code
│   ├── src/            # React source
│   ├── dist/           # Built frontend (generated)
│   └── package.json    # Frontend-specific config
└── .env                # Environment variables
```

## 🛠️ Development Commands

```bash
# Install all dependencies
npm install && npm run install:all

# Run both frontend and backend
npm run dev

# Run separately
npm run dev:backend   # Backend on port 5000
npm run dev:frontend  # Frontend on port 5173

# Build for production
npm run vercel-build
```

## ✨ Benefits of Unified Deployment

- **Single deployment** - No confusion about multiple apps
- **Simplified configuration** - One vercel.json handles everything
- **Easier management** - All dependencies in one place
- **Faster deployment** - Single build process
- **Cost effective** - One Vercel project instead of multiple

## 🔧 After Deployment

1. **Copy your Vercel URL** (e.g., `https://casri-management-system.vercel.app`)
2. **Update CORS_ORIGIN** in Vercel environment variables
3. **Test your app** - both frontend and API should work

Your app will be live at: `https://your-app-name.vercel.app`

**That's it!** 🎉 Your CASRI Management System is now deployed as a unified application on Vercel.