# Quick Start Guide

## 🎉 Your Claude Subagent Generator is Ready!

The application is now running at: **http://localhost:3000**

## First Steps

### 1. Set Up Your API Key
- Click the **Settings icon (⚙️)** in the top right corner
- Enter your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Click **Save**

### 2. Create Your First Subagent

#### Option A: Use a Template
1. Click on one of the pre-built templates in the left panel:
   - **Code Reviewer** - Reviews code quality and security
   - **Debugger** - Fixes errors and bugs
   - **Data Scientist** - Handles SQL and data analysis
2. Review and customize the configuration
3. Click **Download** to save the `.md` file

#### Option B: Generate with AI
1. Toggle to **AI-Generated** mode
2. Describe your subagent (e.g., "I need a subagent that reviews Python code for security vulnerabilities")
3. Click **Generate with AI**
4. Review and edit the generated configuration
5. Download the file

#### Option C: Manual Creation
1. Click **New Agent**
2. Fill in all the fields:
   - Name (lowercase-with-hyphens)
   - Description (when to use this agent)
   - System Prompt (detailed instructions)
   - Model selection
   - Tools selection
3. Click **Validate Configuration**
4. Download when ready

### 3. Save Your Subagent File

Save the downloaded `.md` file to:
- **Project-specific**: `.claude/agents/` in your project
- **Global**: `~/.claude/agents/` in your home directory

## Features Overview

✨ **AI Generation** - Powered by Gemini 2.0 Flash  
📝 **Manual Mode** - Full control over configuration  
📚 **Templates** - Quick start with pre-built examples  
👀 **Live Preview** - See your markdown in real-time  
💾 **Recent Agents** - Quick access to previously created agents  
🌓 **Dark Mode** - Toggle with the moon/sun icon  
✅ **Validation** - Ensures your config is correct  
📋 **Copy/Download** - Easy export options

## Tips

- Use "proactively" or "MUST BE USED" in descriptions for automatic delegation
- Keep system prompts detailed with step-by-step workflows
- Only select tools that are necessary for the agent's purpose
- Test your agents after creating them

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Need Help?

- Check the README.md for detailed documentation
- All your data is stored locally in your browser
- Your API key is only used to communicate with Google's Gemini API

Enjoy creating powerful Claude subagents! 🚀
