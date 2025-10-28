# Subagent Studio - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - **Name**: subagent-studio (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to you
4. Wait for the project to be created (~2 minutes)

#### Run the Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- `agents` table with all necessary columns
- Indexes for better performance
- Row Level Security policies
- Auto-update trigger for `updated_at` field

#### Get Your API Credentials

1. In your Supabase project, go to **Settings** > **API**
2. Find these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Start the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 5. Configure AI Provider

1. Click the Settings icon (⚙️) in the sidebar
2. Choose your AI provider:
   - **Gemini**: Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **Claude**: Get API key from [Anthropic Console](https://console.anthropic.com/settings/keys)
3. Enter your API key and click Save

## Features Overview

### Navigation

The app uses a collapsible sidebar with four main sections:

- **Library**: Browse templates and recent agents
- **Create**: Build new agents manually or with AI
- **Preview**: Review and export your agent configuration
- **Manage Agents**: View all saved agents, filter by type (Project/User)

### Creating Agents

#### Manual Mode
1. Fill in the form fields:
   - Agent Name (lowercase-with-hyphens)
   - Description (when to invoke)
   - System Prompt (detailed instructions)
   - Model (inherit, sonnet, opus, haiku)
   - Tools (select specific or inherit all)

#### AI-Generated Mode
1. Toggle to "AI-Generated"
2. Describe what you want in natural language
3. Click "Generate with AI"
4. Review and edit the generated configuration

### Saving Agents

You have two options:

1. **Save to Database** (Recommended)
   - Click "Save to Database" in the Preview panel
   - Choose agent type:
     - **Project**: For project-specific agents (`.claude/agents/`)
     - **User**: For global agents (`~/.claude/agents/`)
   - Agent is stored in Supabase and can be managed later

2. **Download as File**
   - Click "Download .md" to get the markdown file
   - Manually place it in `.claude/agents/` or `~/.claude/agents/`

### Managing Agents

Go to **Manage Agents** to:
- View all your saved agents
- Filter by type (All / Project / User)
- Edit existing agents
- Delete agents
- Download agents as markdown files

## Database Schema

The `agents` table structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp (auto-updated) |
| `name` | TEXT | Agent name (lowercase-with-hyphens) |
| `description` | TEXT | When to invoke this agent |
| `system_prompt` | TEXT | Detailed agent instructions |
| `tools` | TEXT[] | Array of tool names |
| `model` | TEXT | Model to use (inherit/sonnet/opus/haiku) |
| `inherit_all_tools` | BOOLEAN | Whether to inherit all tools |
| `agent_type` | TEXT | 'project' or 'user' |
| `user_id` | UUID | Optional user identifier |
| `project_id` | UUID | Optional project identifier |

## Troubleshooting

### Supabase Connection Issues

**Error**: "Failed to fetch agents" or "Failed to save agent"

**Solutions**:
1. Check your `.env` file has correct credentials
2. Verify your Supabase project is active
3. Check the browser console for detailed error messages
4. Ensure the database schema was run successfully

### TypeScript Errors in Development

Some TypeScript errors in `agentService.ts` are expected due to Supabase's strict type inference. These don't affect runtime functionality.

### API Key Issues

**Error**: "Please set your API key in settings"

**Solutions**:
1. Click Settings icon in sidebar
2. Select your AI provider
3. Enter a valid API key
4. Click Save
5. API keys are stored in browser localStorage

## Production Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Recommended Hosting

- **Vercel**: Auto-detects Vite, easy deployment
- **Netlify**: Great for static sites
- **Cloudflare Pages**: Fast global CDN

## Security Notes

1. **API Keys**: Stored in browser localStorage, never sent to your server
2. **Supabase RLS**: Currently allows all operations - customize policies for production
3. **Environment Variables**: Never commit `.env` to version control

## Next Steps

1. Customize the database RLS policies for your use case
2. Add user authentication if needed
3. Extend the agent templates
4. Add more AI providers if desired

## Support

For issues or questions:
1. Check this setup guide
2. Review the main README.md
3. Check browser console for errors
4. Verify Supabase dashboard for database issues
