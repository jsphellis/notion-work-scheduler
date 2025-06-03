# 🚀 Deployment Guide

## Quick Deploy Commands

### 1. Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/notion-work-scheduler.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Railway (Backend)
- Go to [railway.app](https://railway.app)
- Connect GitHub account
- Select this repository
- Copy the deployment URL

### 3. Deploy to Vercel (Frontend)
- Go to [vercel.com](https://vercel.com)
- Connect GitHub account
- Import this repository
- Add environment variable:
  - `VITE_API_URL` = Your Railway URL

## Environment Variables

### For Vercel (Frontend)
```
VITE_API_URL=https://your-app.railway.app
```

### For Railway (Backend)
```
PORT=3001
NODE_ENV=production
```

## Post-Deployment Checklist

- [ ] Backend is running on Railway
- [ ] Frontend is deployed on Vercel
- [ ] Environment variables are set
- [ ] Notion integration is configured
- [ ] Test the connection in the app

## Updating Your Deployment

To update your deployed app:
```bash
git add .
git commit -m "Update: your changes"
git push
```

Both Vercel and Railway will automatically redeploy when you push to GitHub! 