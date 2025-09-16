# Render Deployment Guide for Infera

This guide walks you through deploying your Infera application to Render.

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub (✅ Done!)
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Supabase Project**: Set up your Supabase project for authentication

## Environment Variables Setup

Before deploying, you'll need to set up these environment variables in Render:

### Required Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration  
NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com
NEXT_PUBLIC_APP_NAME=Infera

# Optional Variables
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
GOOGLE_SITE_VERIFICATION=your_verification_code
```

## Deployment Steps

### 1. Connect GitHub Repository

1. Log in to your Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Select your `Infera` repository

### 2. Configure Build Settings

Use these settings when configuring your web service:

- **Name**: `infera` (or your preferred name)
- **Environment**: `Docker`
- **Region**: Choose closest to your users
- **Branch**: `master`
- **Root Directory**: Leave blank
- **Dockerfile Path**: `./Dockerfile`

### 3. Set Environment Variables

In the Render dashboard, add all the environment variables listed above:

1. Go to your service → "Environment"
2. Add each variable one by one
3. **Important**: Set your Supabase URL and ANON_KEY from your Supabase dashboard

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. The build process will take 5-10 minutes

### 5. Configure Custom Domain (Optional)

1. Go to your service → "Settings"
2. Under "Custom Domains", add your domain
3. Update your DNS records as instructed

## Build Configuration

Your project is already configured with:

- ✅ **Dockerfile**: Optimized multi-stage build
- ✅ **render.yaml**: Service configuration
- ✅ **next.config.js**: Production optimizations
- ✅ **Environment handling**: Graceful fallbacks
- ✅ **.gitignore**: Proper exclusions

## Post-Deployment

After successful deployment:

1. **Test the application**: Visit your Render URL
2. **Set up Supabase**: Configure your Supabase project with the correct site URL
3. **Monitor logs**: Use Render's log viewer to debug any issues
4. **Set up monitoring**: Enable health checks and alerts

## Troubleshooting

### Common Issues

1. **Build fails**: Check environment variables are set correctly
2. **Supabase errors**: Verify your Supabase URL and keys
3. **404 errors**: Ensure your `NEXT_PUBLIC_SITE_URL` matches your Render URL

### Support Resources

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

## Performance Optimizations

Your project includes:

- Image optimization
- Bundle compression
- Security headers
- Static page generation
- Optimized Docker layers

## Cost Estimation

- **Free Tier**: 750 hours/month (suitable for testing)
- **Starter**: $7/month (production-ready)
- **Standard**: $25/month (high traffic)

Your application should run perfectly on the free tier for development and testing!