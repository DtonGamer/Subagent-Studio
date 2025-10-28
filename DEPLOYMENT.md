# Deployment Guide

This guide covers deploying Subagent Studio to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ A Supabase project set up
- ✅ GitHub OAuth configured in Supabase
- ✅ Database schema applied (`supabase-schema.sql`)
- ✅ Environment variables ready

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

Netlify offers free hosting with automatic deployments from GitHub.

#### Quick Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/DtonGamer/Subagent-Studio)

#### Manual Deployment

1. **Connect to GitHub**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`
   
   (These are already configured in `netlify.toml`)

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add the following:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `your-site-name.netlify.app`

5. **Update Supabase Redirect URLs**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Netlify URL to "Site URL" and "Redirect URLs":
     ```
     https://your-site-name.netlify.app
     https://your-site-name.netlify.app/**
     ```

#### Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow instructions to configure DNS
4. Update Supabase redirect URLs with your custom domain

---

### Option 2: Pxxl

Pxxl provides simple deployment with automatic configuration.

#### Deployment Steps

1. **Install Pxxl CLI** (if not already installed)
   ```bash
   npm install -g pxxl
   ```

2. **Login to Pxxl**
   ```bash
   pxxl login
   ```

3. **Deploy**
   ```bash
   pxxl deploy
   ```
   
   The `pxxl.yaml` file contains all necessary configuration.

4. **Set Environment Variables**
   ```bash
   pxxl env:set VITE_SUPABASE_URL=your_supabase_project_url
   pxxl env:set VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Update Supabase Redirect URLs**
   - Add your Pxxl URL to Supabase redirect URLs

---

### Option 3: Vercel

Vercel offers excellent performance and automatic deployments.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DtonGamer/Subagent-Studio)

#### Manual Deployment

1. **Import Project**
   - Go to [Vercel](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Build**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Update Supabase redirect URLs with your Vercel URL

---

### Option 4: GitHub Pages

GitHub Pages is free but requires some additional configuration.

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/Subagent-Studio"
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/Subagent-Studio/',
     // ... rest of config
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

---

## 🔧 Post-Deployment Configuration

### 1. Update Supabase Settings

After deploying, update these Supabase settings:

**Authentication → URL Configuration**:
- Site URL: `https://your-deployed-url.com`
- Redirect URLs:
  ```
  https://your-deployed-url.com
  https://your-deployed-url.com/**
  http://localhost:5173/**  (for local development)
  ```

### 2. Update GitHub OAuth App

If using a custom domain:
- Go to GitHub OAuth App settings
- Update "Homepage URL" and "Authorization callback URL"

### 3. Test Authentication

1. Visit your deployed site
2. Click "Continue with GitHub"
3. Verify successful login
4. Test creating and saving agents

---

## 🐛 Troubleshooting

### Issue: 404 on Page Refresh

**Cause**: Server doesn't redirect all routes to `index.html`

**Solution**: 
- Netlify: `_redirects` file is already in `public/` folder
- Vercel: Add `vercel.json` with rewrites
- Other platforms: Configure SPA routing

### Issue: Authentication Redirect Fails

**Cause**: Redirect URL not configured in Supabase

**Solution**:
1. Check Supabase → Authentication → URL Configuration
2. Ensure your deployed URL is in "Redirect URLs"
3. Include both with and without trailing slash

### Issue: Environment Variables Not Working

**Cause**: Variables not set in deployment platform

**Solution**:
1. Check platform's environment variable settings
2. Ensure variables start with `VITE_`
3. Redeploy after adding variables

### Issue: Build Fails

**Cause**: Missing dependencies or Node version mismatch

**Solution**:
1. Ensure Node 18+ is specified
2. Check build logs for specific errors
3. Verify all dependencies are in `package.json`

---

## 📊 Performance Optimization

### Enable Caching

Most platforms automatically cache static assets. Verify:
- CSS/JS files have long cache headers
- Images are optimized
- Fonts are preloaded

### Enable Compression

Ensure gzip/brotli compression is enabled:
- Netlify: Automatic
- Vercel: Automatic
- Others: Check platform documentation

### Monitor Performance

Use these tools:
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- Platform-specific analytics

---

## 🔒 Security Checklist

Before going live:

- ✅ Environment variables are set correctly
- ✅ Supabase RLS policies are enabled
- ✅ HTTPS is enforced
- ✅ Security headers are configured
- ✅ API keys are not exposed in client code
- ✅ GitHub OAuth is properly configured
- ✅ CORS is configured correctly

---

## 📈 Monitoring

### Netlify Analytics
- Enable in Site settings → Analytics
- Track page views, unique visitors, bandwidth

### Supabase Monitoring
- Check Database → Logs
- Monitor API usage
- Review authentication logs

### Error Tracking (Optional)

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [PostHog](https://posthog.com) for analytics

---

## 🔄 Continuous Deployment

### Automatic Deployments

Most platforms support automatic deployments:

1. **Netlify/Vercel**:
   - Automatically deploys on push to `main` branch
   - Preview deployments for pull requests

2. **GitHub Actions** (for other platforms):
   ```yaml
   name: Deploy
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - run: npm run deploy
   ```

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review platform-specific documentation
3. Open an issue on [GitHub](https://github.com/DtonGamer/Subagent-Studio/issues)

---

**Happy Deploying! 🚀**
