# GitHub Authentication Setup Guide

## Step 1: Enable GitHub Provider in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **GitHub** in the list and click to enable it
4. You'll need to configure it with GitHub OAuth credentials (see Step 2)

## Step 2: Create GitHub OAuth App

1. Go to GitHub Settings:
   - Visit https://github.com/settings/developers
   - Or: Click your profile → Settings → Developer settings → OAuth Apps

2. Click **"New OAuth App"**

3. Fill in the application details:
   - **Application name**: `Subagent Studio` (or your preferred name)
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Authorization callback URL**: Get this from Supabase (see below)

4. Get the callback URL from Supabase:
   - In Supabase Dashboard → Authentication → Providers → GitHub
   - Copy the **Callback URL (for OAuth)** 
   - It looks like: `https://your-project.supabase.co/auth/v1/callback`
   - Paste this into GitHub's **Authorization callback URL** field

5. Click **"Register application"**

6. You'll see your **Client ID** - copy this

7. Click **"Generate a new client secret"** - copy this secret

## Step 3: Configure Supabase with GitHub Credentials

1. Back in Supabase Dashboard → Authentication → Providers → GitHub

2. Paste your credentials:
   - **Client ID**: (from GitHub)
   - **Client Secret**: (from GitHub)

3. Click **Save**

4. GitHub provider is now enabled! ✅

## Step 4: Update Database Schema

Run the updated SQL schema in your Supabase SQL Editor:

```sql
-- This updates the agents table with proper user_id foreign key
-- and Row Level Security policies

-- The schema is in: supabase-schema.sql
```

Just copy the entire contents of `supabase-schema.sql` and run it in the SQL Editor. It will:
- Add proper foreign key constraint on `user_id`
- Create RLS policies so users only see their own agents
- Add index on `user_id` for better performance

## Step 5: Test the Authentication

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. You should see the login page

4. Click "Continue with GitHub"

5. You'll be redirected to GitHub to authorize the app

6. After authorization, you'll be redirected back to your app, logged in!

## Production Setup

When deploying to production:

1. Create a **new GitHub OAuth App** for production:
   - Homepage URL: `https://yourdomain.com`
   - Callback URL: `https://your-project.supabase.co/auth/v1/callback` (same as dev)

2. Update Supabase with production credentials

3. Optionally, you can use the same GitHub OAuth app for both dev and prod by adding multiple callback URLs (GitHub allows this)

## Troubleshooting

### "Redirect URI mismatch" error

**Problem**: GitHub shows an error about redirect URI not matching

**Solution**: 
- Make sure the callback URL in GitHub exactly matches the one from Supabase
- Check for trailing slashes
- Ensure you're using the correct Supabase project

### Users can't see their agents

**Problem**: After logging in, the Manage Agents page is empty

**Solution**:
- Make sure you ran the updated `supabase-schema.sql`
- Check that RLS policies are enabled
- Verify agents have `user_id` set (new agents will automatically get it)

### "Failed to sign in" error

**Problem**: Error when clicking "Continue with GitHub"

**Solution**:
- Check browser console for detailed error
- Verify GitHub OAuth app is active
- Ensure Supabase credentials are correct
- Check that your Supabase project URL and anon key are in `.env`

## How It Works

1. **User clicks "Continue with GitHub"**
   - App calls `supabase.auth.signInWithOAuth({ provider: 'github' })`
   
2. **Redirect to GitHub**
   - User authorizes the app on GitHub
   
3. **GitHub redirects back**
   - Callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - Supabase handles the OAuth flow
   
4. **User is authenticated**
   - Supabase creates/updates user in `auth.users` table
   - Session is created and stored
   - App detects auth state change and shows main UI

5. **Creating agents**
   - When saving an agent, `user_id` is automatically set to current user
   - RLS policies ensure users only see their own agents

## Security Notes

- **Client Secret**: Keep this secret! Never commit it to version control
- **RLS Policies**: Currently set to user-specific access only
- **Callback URL**: Must be HTTPS in production (Supabase handles this)
- **Session Management**: Supabase handles token refresh automatically

## Additional Providers

Want to add more auth providers? Supabase supports:
- Google
- Discord
- Twitter
- Facebook
- And many more!

Just enable them in the Supabase Dashboard and they'll work with the same auth flow.
