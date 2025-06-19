# Deployment Guide for Two-Move Chess

This guide will help you deploy the Two-Move Chess app to Render.com as a Static Site.

## Deploy to Render

### Prerequisites
- A GitHub account with your code pushed to a repository
- A Render account (free at [render.com](https://render.com))

### Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### Step 2: Create a Static Site on Render

1. Go to your [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Static Site**
3. Connect your GitHub account if not already connected
4. Select your `twomovechess` repository
5. Configure the deployment settings:

   - **Name**: `twomovechess` (or your preferred name)
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Yes (for automatic deployments on git push)

6. Click **Create Static Site**

### Step 3: Wait for Deployment

Render will:
- Clone your repository
- Run `npm install && npm run build`
- Serve the `dist` folder as a static site
- Provide you with a URL like: `https://twomovechess.onrender.com`

### Client-Side Routing Support

Since this is a single-page React app, you may need to configure redirects for client-side routing:

1. After deployment, go to your service's **Redirects/Rewrites** tab
2. Add a rewrite rule:
   - **Source Path**: `/*`
   - **Destination Path**: `/index.html`
   - **Action**: Rewrite

This ensures all routes are handled by your React app.

## Alternative: Deploy to Vercel

If you prefer Vercel over Render:

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

## After Deployment

- Your app will be live at the provided URL
- Render provides automatic HTTPS
- Future pushes to main will trigger automatic deployments
- You can add a custom domain in the Settings tab

## Troubleshooting

If deployment fails:
1. Check the build logs in Render dashboard
2. Ensure `npm run build` works locally
3. Verify all dependencies are in `package.json`
4. Check that the `dist` folder is created after build
5. Make sure you're not committing the `dist` folder (it should be in .gitignore) 