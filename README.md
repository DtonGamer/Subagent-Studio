# Subagent Studio

A modern, full-featured web application for creating, managing, and organizing Claude Code subagent configuration files with AI assistance, cloud storage, and user authentication.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ Features

### 🤖 AI-Powered Generation
- **Multiple AI Providers**: Choose from Gemini, Claude, or OpenRouter
- **Latest Models**: Support for Gemini 2.5, Claude 4.5, and 100+ models via OpenRouter
- **Batch Generation**: Create multiple agents sequentially with progress tracking
- **Smart Model Selection**: Pick the best model for your use case

### 🔐 Authentication & Security
- **GitHub OAuth**: Secure authentication via Supabase
- **Row Level Security**: Users only see their own agents
- **API Key Storage**: Secure local storage of API keys

### 💾 Cloud Storage & Management
- **Supabase PostgreSQL**: Full CRUD operations with cloud sync
- **Agent Types**: Organize by Project vs User agents
- **Real-time Updates**: Instant sync across devices
- **Search & Filter**: Find agents quickly

### 🎨 Modern UI/UX
- **Collapsible Sidebar**: Clean, space-efficient navigation
- **Dark Mode**: Full dark mode support
- **Live Preview**: See markdown in real-time
- **Responsive Design**: Works on desktop and mobile

### 📝 Flexible Creation
- **Manual Configuration**: Full control with user-friendly forms
- **Template Library**: Pre-built templates for common use cases
- **AI Generation**: Natural language to agent configuration
- **Validation**: Built-in checks for correct configurations
- **Easy Export**: Download as `.md` or copy to clipboard

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- A Supabase account and project ([Sign up free](https://supabase.com))
- An AI API key (choose one):
  - **Gemini**: [Google AI Studio](https://aistudio.google.com/app/apikey) (Free tier available)
  - **Claude**: [Anthropic Console](https://console.anthropic.com) (Paid)
  - **OpenRouter**: [OpenRouter](https://openrouter.ai/keys) (Pay-per-use, free models available)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the schema from `supabase-schema.sql`
   - Enable GitHub OAuth provider (see `GITHUB_AUTH_SETUP.md` for detailed instructions)
   - Get your project URL and anon key from Settings > API

4. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   
5. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open your browser to `http://localhost:5173`

### First-Time Setup

1. **Sign in with GitHub**
   - Click "Continue with GitHub" on the login page
   - Authorize the application

2. **Configure AI Provider**
   - Click the Settings icon (⚙️) in the sidebar
   - Choose your AI provider (Gemini, Claude, or OpenRouter)
   - Select your preferred AI model
   - Enter your API key
   - Click Save

> 🔒 **Security Note**: Your API keys are stored locally in your browser and are only used to communicate with your chosen AI provider. They are never sent to our servers.

## Usage

### Manual Mode

1. Click "New Agent" or select a template
2. Fill in the form fields:
   - **Agent Name**: Lowercase with hyphens (e.g., `my-agent`)
   - **Description**: When the agent should be invoked
   - **System Prompt**: Detailed instructions for the agent
   - **Model**: Choose the Claude model (inherit, sonnet, opus, haiku, qwen-coder)
   - **Tools**: Select required tools or inherit all
3. Click "Validate Configuration" to check for errors
4. Download or copy the generated markdown file

### AI-Generated Mode

#### Single Agent
1. Toggle to "AI-Generated" mode
2. Describe what you want your subagent to do
3. Click "Generate with AI"
4. Review and edit the generated configuration
5. Save to database or download

#### Batch Generation
1. Toggle to "AI-Generated" mode
2. Enable "Batch Mode"
3. Enter multiple agent descriptions (one per line, max 10)
4. Click "Generate All Agents"
5. Watch real-time progress as agents are created
6. Review and save generated agents

### Saving Agents

**Cloud Storage (Recommended)**:
- Click "Save to Database" to store in Supabase
- Access from any device
- Automatic sync
- Organized by type (Project/User)

**Local Files**:
Download `.md` files and save to:
- **Project-specific**: `.claude/agents/` in your project root
- **Global**: `~/.claude/agents/` in your home directory

## Templates

### Code Reviewer
Reviews code for quality, security, and maintainability. Automatically invoked after code changes.

### Debugger
Specialized in identifying and fixing errors, test failures, and unexpected behavior.

### Data Scientist
Expert in SQL queries, BigQuery operations, and data analysis tasks.

## Configuration Format

Generated files follow this format:

```markdown
---
name: agent-name
description: When to invoke this agent
tools: Read, Write, Bash
model: sonnet
---

System prompt content goes here...
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Vite** - Lightning-fast build tool

### Backend & Services
- **Supabase** - PostgreSQL database, authentication, RLS
- **Gemini 2.5** - Google's latest AI models
- **Claude 4.5** - Anthropic's advanced AI
- **OpenRouter** - Access to 100+ AI models

### AI Models Supported
- **Gemini**: 2.5 Flash, 2.5 Pro, 2.5 Flash-Lite, 2.0 Flash
- **Claude**: Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 3.7
- **OpenRouter**: Claude, Gemini, Qwen Coder, DeepSeek, Llama, GPT-4o, and more

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Documentation

- **[GitHub Auth Setup](GITHUB_AUTH_SETUP.md)** - Complete guide for setting up GitHub OAuth
- **[Supabase Schema](supabase-schema.sql)** - Database schema with RLS policies
- **[Setup Guide](SETUP.md)** - Detailed setup instructions

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

## 📝 License

MIT License - feel free to use this tool for any purpose.

See [LICENSE](LICENSE) for more information.

## 🙏 Acknowledgments

- Built with [Claude](https://claude.ai) assistance
- Powered by [Supabase](https://supabase.com)
- AI models from [Google](https://ai.google.dev), [Anthropic](https://anthropic.com), and [OpenRouter](https://openrouter.ai)

## 📧 Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/DtonGamer/Subagent-Studio/issues)
- Check existing issues for solutions
- Provide detailed information for bug reports

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Made with ❤️ for the Claude Code community**
