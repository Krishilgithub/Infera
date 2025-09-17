# 🚀 Supabase Integration Setup Guide

This guide will help you complete the Supabase integration for your Infera project.

## ✅ What's Already Done

- ✅ Supabase client configuration
- ✅ Authentication context with real Supabase auth
- ✅ Updated login/signup forms
- ✅ Protected routes with middleware
- ✅ Dashboard components updated
- ✅ Password reset functionality
- ✅ Proper TypeScript types

## 🔧 Environment Setup

### 1. Create Environment File

Create a `.env.local` file in your project root with your Supabase credentials:

```bash
# Copy from env.example and add your Supabase details
cp env.example .env.local
```

### 2. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site URL (for redirects)
SITE_URL=http://localhost:3000
```

### 3. Update Supabase Auth Settings

In your Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add these URLs to **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (development)
   - `https://your-domain.com/auth/callback` (production)
   - `http://localhost:3000/reset-password` (password reset)
   - `https://your-domain.com/reset-password` (password reset)

### 4. Configure Google OAuth (Optional)

To enable Google sign-in:

1. **Create Google OAuth App**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Set **Application type** to "Web application"
   - Add **Authorized redirect URIs**:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**

2. **Configure in Supabase**:
   - Go to your Supabase Dashboard
   - Navigate to **Authentication** → **Providers**
   - Enable **Google** provider
   - Enter your Google **Client ID** and **Client Secret**
   - Save the configuration

3. **Test Google Sign-in**:
   - The "Continue with Google" button will now work
   - Users can sign in with their Google accounts

## 🗄️ Database Setup (Optional)

If you want to store user profiles and meeting data, create these tables:

### 1. User Profiles Table

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 2. Meetings Table (for future features)

```sql
-- Create meetings table
CREATE TABLE meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  transcript TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own meetings" ON meetings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meetings" ON meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings" ON meetings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meetings" ON meetings
  FOR DELETE USING (auth.uid() = user_id);
```

## 🔐 Authentication Features

### Available Auth Methods

- ✅ **Email/Password**: Standard signup and login
- ✅ **Password Reset**: Email-based password reset
- ✅ **Google OAuth**: One-click Google sign-in
- ✅ **Protected Routes**: Automatic redirect to login
- ✅ **Session Management**: Persistent sessions
- ✅ **User Profile**: Full name and avatar support

### Future Auth Methods (Easy to Add)

- 🔄 **GitHub OAuth**: Developer-friendly sign-in
- 🔄 **Magic Links**: Passwordless authentication
- 🔄 **Phone Auth**: SMS-based authentication

## 🚀 Testing the Integration

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Authentication Flow

1. **Sign Up**: Go to `/signup` and create a new account
2. **Email Verification**: Check your email for verification link
3. **Sign In**: Go to `/login` and sign in
4. **Dashboard Access**: Should redirect to `/dashboard`
5. **Sign Out**: Use the sign out button in dashboard

### 3. Test Protected Routes

- ✅ `/dashboard/*` - Requires authentication
- ✅ `/login` - Redirects authenticated users to dashboard
- ✅ `/signup` - Redirects authenticated users to dashboard

## 🎯 Next Steps

### Immediate Features to Add

1. **Email Templates**: Customize Supabase email templates
2. **User Profile Page**: Allow users to update their profile
3. **Loading States**: Better loading indicators
4. **Error Handling**: More detailed error messages

### Advanced Features

1. **Real-time Features**: Live meeting updates
2. **File Upload**: Avatar and document uploads
3. **Team Management**: Multi-user workspaces
4. **Analytics**: User behavior tracking

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid API key"**: Check your environment variables
2. **Redirect loops**: Verify redirect URLs in Supabase
3. **CORS errors**: Ensure your domain is in allowed origins
4. **Email not sending**: Check Supabase email settings

### Debug Mode

Add this to see detailed auth logs:

```typescript
// In your auth context, add:
console.log('Auth state changed:', { event, session: !!session })
```

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase TypeScript](https://supabase.com/docs/guides/api/generating-types)

## 🎉 You're All Set!

Your Infera project now has:
- ✅ Real authentication with Supabase
- ✅ Secure user sessions
- ✅ Protected dashboard routes
- ✅ Password reset functionality
- ✅ TypeScript support
- ✅ Production-ready setup

Ready to build amazing meeting intelligence features! 🚀
