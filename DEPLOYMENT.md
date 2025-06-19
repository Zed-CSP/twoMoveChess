# Deployment Guide for Two-Move Chess

This guide will help you deploy the Two-Move Chess app to Vercel (free hosting).

## Option 1: Deploy with Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Run the deployment command:
```bash
vercel
```

3. Follow the prompts:
   - Login/create account when prompted
   - Confirm project settings (defaults should work)
   - Choose a project name or use the suggested one

4. Your app will be deployed and you'll get a URL like: `https://your-project-name.vercel.app`

## Option 2: Deploy via GitHub

1. Push your code to a GitHub repository

2. Go to [vercel.com](https://vercel.com)

3. Sign up/login with your GitHub account

4. Click "New Project"

5. Import your GitHub repository

6. Vercel will auto-detect the settings (Vite framework)

7. Click "Deploy"

## Option 3: Deploy via Git

1. Initialize git if not already done:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Install Vercel CLI and deploy:
```bash
npx vercel --prod
```

## After Deployment

- Your app will be available at the provided URL
- Vercel provides automatic HTTPS
- Future pushes to your main branch will trigger automatic deployments
- You can add a custom domain later if desired

## Environment Variables

This app doesn't require any environment variables, so deployment is straightforward!

## Troubleshooting

If you encounter issues:
1. Make sure `npm run build` works locally
2. Check that all dependencies are in `package.json` (not just devDependencies)
3. Verify the `vercel.json` configuration is correct 