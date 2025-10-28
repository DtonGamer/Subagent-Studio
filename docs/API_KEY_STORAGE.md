# API Key Storage Implementation

## Overview
API keys are now stored securely in the database with client-side encryption. You no longer need to re-enter your API keys every session.

## How It Works

### 1. **Database Schema** (`supabase-schema.sql`)
- New `api_keys` table stores encrypted API keys
- Columns: `id`, `user_id`, `provider`, `encrypted_key`, `created_at`, `updated_at`
- Row Level Security (RLS) ensures users can only access their own keys
- Unique constraint on `(user_id, provider)` prevents duplicates

### 2. **Encryption Service** (`src/services/apiKeyService.ts`)
- **Client-side encryption** using Web Crypto API (AES-256-GCM)
- Encryption key derived from user's session ID using PBKDF2
- Keys are encrypted before being sent to database
- Only you can decrypt your keys when logged in

**Key Functions:**
- `saveApiKey(provider, apiKey)` - Save/update an API key
- `getApiKey(provider)` - Retrieve and decrypt an API key
- `getSavedProviders()` - Get list of providers with saved keys
- `deleteApiKey(provider)` - Delete a specific API key
- `deleteAllApiKeys()` - Delete all API keys for current user

### 3. **Settings Page** (`src/pages/SettingsPage.tsx`)
New dedicated page at `/settings` to manage API keys:
- View which providers have saved keys
- Save new API keys (Gemini, Claude, OpenRouter)
- Load saved keys to view them
- Delete individual keys
- Password visibility toggle
- Security information display

### 4. **Auto-Loading** (`src/App.tsx`, `src/store.ts`)
- API keys automatically load from database when you log in
- Store updated with `loadApiKeys()` and `saveApiKeyToDb()` methods
- Keys populate automatically in the Create page

### 5. **Navigation** (`src/components/Sidebar.tsx`)
- New "API Keys" link in sidebar navigation
- Navigates to `/settings` page

## Usage

### First Time Setup
1. Navigate to **API Keys** in the sidebar
2. Enter your API key for each provider you want to use
3. Click **Save API Key**
4. Keys are encrypted and stored securely

### Using Saved Keys
- Keys automatically load when you log in
- No need to re-enter them in the Create page
- They persist across sessions

### Managing Keys
- Go to **API Keys** page
- Click **Load Key** to view a saved key
- Click **Delete** to remove a saved key
- Keys are tied to your user account

## Security Features

✅ **AES-256-GCM encryption** - Military-grade encryption  
✅ **Client-side encryption** - Keys encrypted before leaving your browser  
✅ **Session-based key derivation** - Only decryptable when logged in  
✅ **Row Level Security** - Database-level access control  
✅ **No plaintext storage** - Keys never stored unencrypted  
✅ **User isolation** - Can't access other users' keys  

## Database Migration

Run the updated `supabase-schema.sql` in your Supabase SQL editor to create the `api_keys` table:

```sql
-- The schema includes:
-- 1. api_keys table creation
-- 2. Indexes for performance
-- 3. RLS policies
-- 4. Updated_at trigger
```

## Technical Details

**Encryption Algorithm:** AES-GCM  
**Key Length:** 256 bits  
**Key Derivation:** PBKDF2 with 100,000 iterations  
**IV:** Random 12-byte initialization vector per encryption  
**Storage Format:** Base64-encoded (IV + encrypted data)

## Notes

- API keys stored in localStorage (old method) will still work
- New encrypted storage is more secure and persistent
- Keys are tied to your Supabase auth session
- If you sign out, keys remain encrypted in database
- When you sign back in, they auto-load and decrypt
