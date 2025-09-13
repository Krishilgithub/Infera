# 🚀 Vercel Deployment Guide for Infera

This guide will help you deploy your Infera application to Vercel with analytics enabled.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Node.js 18+ installed locally

## Step 1: Prepare Your Repository

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Verify Files**:
   Ensure these files are in your repository:
   - `vercel.json` - Vercel configuration
   - `next.config.js` - Next.js configuration with analytics
   - `package.json` - Updated with analytics dependencies
   - `app/layout.tsx` - Root layout with analytics components

## Step 2: Deploy to Vercel

### Option A: Automatic Deployment (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project settings**:

   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

5. **Add Environment Variables**:

   ```
   VERCEL_ANALYTICS_ID=your_analytics_id_here
   NODE_ENV=production
   ```

6. **Click "Deploy"**

### Option B: Manual Deployment with CLI

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   # First deployment (will prompt for configuration)
   vercel

   # Production deployment
   vercel --prod
   ```

## Step 3: Enable Analytics

### Vercel Analytics

1. **Go to your project dashboard**
2. **Navigate to "Analytics" tab**
3. **Enable Web Analytics**
4. **Copy the Analytics ID**
5. **Add to Environment Variables**:
   ```
   VERCEL_ANALYTICS_ID=your_analytics_id
   ```

### Speed Insights

Speed Insights are automatically enabled when you deploy with the `@vercel/speed-insights` package.

## Step 4: Configure Custom Domain (Optional)

1. **Go to Project Settings**
2. **Navigate to "Domains"**
3. **Add your custom domain**
4. **Configure DNS records as instructed**

## Step 5: Monitor Performance

### Analytics Dashboard

Access your analytics at:

- **Vercel Dashboard** → Your Project → Analytics
- **Real-time metrics**: Page views, unique visitors, bounce rate
- **Performance metrics**: Core Web Vitals, loading times

### Speed Insights

Monitor performance at:

- **Vercel Dashboard** → Your Project → Speed Insights
- **Core Web Vitals**: LCP, FID, CLS
- **Performance scores**: Lighthouse metrics

## Environment Variables

Set these in your Vercel project settings:

```bash
# Required
VERCEL_ANALYTICS_ID=your_analytics_id
NODE_ENV=production

# Optional
CUSTOM_KEY=your_custom_key
SITE_URL=https://your-domain.com
```

## Deployment Scripts

Use these npm scripts for deployment:

```bash
# Preview deployment
npm run deploy:preview

# Production deployment
npm run deploy

# Analyze bundle size
npm run analyze
```

## Troubleshooting

### Common Issues

1. **Build Failures**:

   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Analytics Not Working**:

   - Verify `VERCEL_ANALYTICS_ID` is set
   - Check that analytics components are imported
   - Ensure deployment is successful

3. **Performance Issues**:
   - Use `npm run analyze` to check bundle size
   - Optimize images and assets
   - Check Core Web Vitals in Speed Insights

### Getting Help

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Support**: Available in your dashboard

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Analytics are tracking (check Vercel dashboard)
- [ ] Speed Insights are working
- [ ] All pages are accessible
- [ ] Forms and interactions work
- [ ] Mobile responsiveness is good
- [ ] SEO meta tags are present
- [ ] Sitemap is generated (`/sitemap.xml`)

## Performance Optimization

### Automatic Optimizations

The project includes:

- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **Bundle optimization** with webpack
- **Static generation** where possible
- **Security headers** for protection

### Manual Optimizations

1. **Bundle Analysis**:

   ```bash
   npm run analyze
   ```

2. **Lighthouse Audit**:

   - Use Chrome DevTools
   - Check Core Web Vitals
   - Optimize based on recommendations

3. **Image Optimization**:
   - Use WebP format
   - Implement lazy loading
   - Optimize image sizes

## Monitoring and Maintenance

### Regular Checks

- **Analytics Review**: Weekly performance review
- **Speed Insights**: Monitor Core Web Vitals
- **Error Tracking**: Check Vercel function logs
- **Dependency Updates**: Keep packages updated

### Scaling Considerations

- **Vercel Pro**: For higher limits and priority support
- **Edge Functions**: For global performance
- **CDN**: Automatic with Vercel
- **Database**: Consider Vercel Postgres for data storage

---

🎉 **Congratulations!** Your Infera application is now deployed on Vercel with full analytics and performance monitoring.
