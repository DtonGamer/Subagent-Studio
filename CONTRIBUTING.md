# Contributing to Subagent Studio

Thank you for your interest in contributing to Subagent Studio! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Subagent-Studio.git
   cd Subagent-Studio
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up your environment** following the [README](README.md)

## 🔧 Development Workflow

1. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly:
   ```bash
   npm run dev
   ```

4. **Commit your changes** with a clear message:
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Avoid `any` types when possible
- Add proper type annotations
- Use interfaces for object shapes

### React
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop typing

### Styling
- Use Tailwind CSS utility classes
- Follow existing dark mode patterns
- Ensure responsive design
- Test on multiple screen sizes

### Code Quality
- Write clean, readable code
- Add comments for complex logic
- Follow existing patterns in the codebase
- Keep functions small and focused

## 🐛 Bug Reports

When reporting bugs, please include:

- **Clear title** describing the issue
- **Steps to reproduce** the bug
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node version)
- **Error messages** from console

## ✨ Feature Requests

For feature requests, please include:

- **Clear description** of the feature
- **Use case** - why is this needed?
- **Proposed solution** if you have one
- **Alternatives** you've considered

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### Features
- New AI model integrations
- Additional agent templates
- Export/import functionality
- Advanced search and filtering
- Collaboration features

### Improvements
- Performance optimizations
- UI/UX enhancements
- Accessibility improvements
- Mobile responsiveness
- Error handling

### Documentation
- Tutorial videos
- Code examples
- API documentation
- Translation to other languages

### Testing
- Unit tests
- Integration tests
- E2E tests
- Bug fixes

## 🔍 Code Review Process

1. **Automated checks** must pass (linting, type checking)
2. **Manual review** by maintainers
3. **Testing** of new features
4. **Documentation** updates if needed
5. **Approval** and merge

## 📋 Commit Message Guidelines

We follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add batch agent generation
fix: resolve authentication redirect issue
docs: update setup instructions
```

## 🏗️ Project Structure

```
subagents/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── lib/           # Utilities and configs
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── types.ts       # TypeScript types
│   ├── store.ts       # Zustand store
│   └── utils.ts       # Helper functions
├── public/            # Static assets
├── supabase-schema.sql # Database schema
└── README.md          # Documentation
```

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct
- Have fun building together!

## 📞 Getting Help

- **GitHub Issues** - For bugs and features
- **Discussions** - For questions and ideas
- **Discord** - For real-time chat (if available)

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Appreciated by the community!

Thank you for contributing to Subagent Studio! 🚀
