# 🚀 Deployment Guide - WMS Dashboard to Vercel via GitHub

This guide will walk you through deploying your WMS Inventory Dashboard to Vercel using GitHub integration.

## Prerequisites

- GitHub account ([Sign up here](https://github.com))
- Vercel account ([Sign up here](https://vercel.com))
- Git installed on your computer

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

1. **Create a new repository on GitHub**
   - Go to [github.com/new](https://github.com/new)
   - Name your repository: `wms-inventory-dashboard`
   - Keep it Public or Private (your choice)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Initialize Git in your project** (if not already done)
   ```bash
   cd wms-dashboard
   git init
   ```

3. **Add all files to Git**
   ```bash
   git add .
   ```

4. **Commit your files**
   ```bash
   git commit -m "Initial commit: WMS Inventory Dashboard"
   ```

5. **Add GitHub as remote**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/wms-inventory-dashboard.git
   ```
   Replace `YOUR_USERNAME` with your GitHub username

6. **Push to GitHub**
   ```bash
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Find `wms-inventory-dashboard`
   - Click "Import"

3. **Configure Project**
   Vercel will auto-detect the configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for deployment
   - 🎉 Your site is live!

### Step 3: Access Your Dashboard

After deployment completes:
- You'll get a URL like: `https://wms-inventory-dashboard-xyz.vercel.app`
- Click on it to see your live dashboard!
- You can customize this URL in Vercel settings

## Automatic Deployments

Great news! Every time you push to GitHub, Vercel automatically:
1. Detects the changes
2. Builds your project
3. Deploys the new version
4. Creates a unique preview URL

### Making Updates

```bash
# Make your changes to the code
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically deploy your changes in ~1-2 minutes!

## Environment Variables (for API Integration)

When you connect your backend API:

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Settings"
   - Click "Environment Variables"

2. **Add Variables**
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-api-domain.com
   ```

3. **Redeploy**
   - Go to "Deployments"
   - Click "..." on latest deployment
   - Click "Redeploy"

## Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

## Troubleshooting

### Build Fails

**Problem**: Build fails with "command not found"
```bash
Solution: Check package.json has correct scripts
"scripts": {
  "build": "vite build"
}
```

**Problem**: "Module not found" errors
```bash
Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Deployment Issues

**Problem**: Site shows blank page
```bash
Solution: Check browser console for errors
Usually fixed by:
1. Verifying build output directory is "dist"
2. Checking vercel.json routing rules
```

**Problem**: Changes not appearing
```bash
Solution: Hard refresh browser
- Windows: Ctrl + Shift + R
- Mac: Cmd + Shift + R
```

## Performance Optimization

1. **Enable Compression** (Auto-enabled by Vercel)
2. **Image Optimization** (Use Vercel Image Optimization)
3. **Caching** (Configured in vercel.json)

## Security Best Practices

1. **Never commit API keys**
   - Always use environment variables
   - Add `.env` to `.gitignore`

2. **Use HTTPS**
   - Vercel provides free SSL certificates
   - All traffic is automatically encrypted

3. **Configure CORS**
   - Set up proper CORS headers on your API
   - Whitelist only your Vercel domain

## Monitoring

Vercel provides built-in monitoring:
- **Analytics**: Track page views and performance
- **Logs**: View build and runtime logs
- **Speed Insights**: Monitor Core Web Vitals

Access in your project dashboard under "Analytics" and "Logs"

## Cost

Vercel Free Tier includes:
- ✅ Unlimited personal projects
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics

Perfect for your WMS Dashboard!

## Next Steps

1. ✅ Deploy to Vercel
2. ⏳ Connect backend API (see README.md)
3. ⏳ Add authentication
4. ⏳ Set up monitoring
5. ⏳ Configure custom domain

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)
- **React Docs**: [react.dev](https://react.dev)

---

Need help? Check the logs in Vercel dashboard or open an issue on GitHub!
