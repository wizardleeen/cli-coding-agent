# CLI Coding Agent 🤖

A powerful web-based CLI coding agent similar to Claude Code, featuring an interactive terminal interface, file management, and AI-powered code assistance.

![CLI Coding Agent](https://img.shields.io/badge/CLI-Coding%20Agent-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4-purple?style=flat-square&logo=vite)

## ✨ Features

### 🖥️ Terminal Interface
- **Interactive CLI** - Full terminal experience with command history and tab completion
- **Syntax Highlighting** - Code blocks with language-specific highlighting
- **Command Processing** - Built-in commands for file operations and code generation
- **Real-time Feedback** - Instant responses with loading indicators

### 📁 File Management
- **File Explorer** - Visual file tree with folders and files
- **Search Functionality** - Quick search across all files and content
- **File Operations** - Create, edit, and manage files and directories
- **Language Detection** - Automatic programming language detection

### 🤖 AI Assistant
- **Code Generation** - Generate code snippets in multiple languages
- **Code Explanation** - Detailed explanations of existing code
- **Smart Suggestions** - Context-aware recommendations and improvements
- **Interactive Chat** - Natural language conversations about coding

### 🎨 Modern UI
- **Dark Theme** - Easy on the eyes with professional styling
- **Responsive Layout** - Resizable panels and adaptive interface
- **Terminal Aesthetics** - Authentic CLI look and feel
- **Smooth Animations** - Polished user experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/wizardleeen/cli-coding-agent.git
cd cli-coding-agent

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### Terminal Commands

| Command | Description | Example |
|---------|-------------|----------|
| `help` | Show all available commands | `help` |
| `create <filename>` | Create a new file | `create app.py` |
| `generate <description>` | Generate code based on description | `generate React login form` |
| `explain <filename>` | Explain code in a file | `explain utils.js` |
| `refactor <filename>` | Suggest code improvements | `refactor components/Header.tsx` |
| `ls` | List all files in workspace | `ls` |
| `cat <filename>` | Display file contents | `cat package.json` |
| `clear` | Clear terminal history | `clear` |
| `version` | Show version information | `version` |

### File Explorer

- **➕ New File** - Click the plus icon to create files
- **📁 New Folder** - Click the folder icon to create directories  
- **🔍 Search** - Use the search bar to find files quickly
- **📄 File Selection** - Click files to view/edit content
- **🗂️ Folder Navigation** - Expand/collapse folders

### AI Assistant

- **💬 Chat Interface** - Natural language conversations
- **⚡ Quick Actions** - Pre-built prompts for common tasks
- **🔧 Code Generation** - Request specific code snippets
- **📚 Explanations** - Get detailed code explanations
- **🎯 Context Awareness** - AI understands your current project

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4
- **Styling**: Custom CSS with CSS Modules
- **Syntax Highlighting**: Prism.js with react-syntax-highlighter
- **Code Editor**: Monaco Editor integration
- **Icons**: Lucide React
- **State Management**: React Context API
- **File Handling**: Custom file system simulation

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── Terminal.tsx         # Main terminal interface
│   ├── TerminalOutput.tsx   # Command output rendering
│   ├── Sidebar.tsx          # File explorer & AI tabs
│   ├── FileExplorer.tsx     # File tree navigation
│   └── AIAssistant.tsx      # AI chat interface
├── context/
│   ├── FileSystemContext.tsx # File management state
│   └── TerminalContext.tsx   # Terminal state & commands
├── utils/
│   └── layout.ts            # Layout utilities
└── App.tsx                  # Main application
```

### Key Features Implementation

- **Terminal Emulation**: Custom command processing with history
- **File System**: Virtual file system with CRUD operations
- **AI Integration**: Simulated AI responses with code generation
- **Syntax Highlighting**: Multi-language code highlighting
- **Responsive Design**: Flexible layout with resizable panels

## 🎯 Supported Languages

- **JavaScript/TypeScript** - React, Node.js, Express
- **Python** - Django, Flask, FastAPI
- **HTML/CSS** - Web development
- **JSON** - Configuration files
- **Markdown** - Documentation
- **Shell/Bash** - Command scripts
- **And many more...**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to your fork: `git push origin feature-name`
5. Create a pull request

### Code Style

- Use TypeScript for all new components
- Follow React hooks patterns
- Maintain consistent CSS naming conventions
- Add comments for complex logic
- Write descriptive commit messages

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Claude Code and similar CLI tools
- Built with modern React and TypeScript best practices
- Styled with a focus on developer experience
- Designed for both beginners and experienced developers

---

**Built with ❤️ for the coding community**

[🚀 Live Demo](https://cli-coding-agent.metavm.tech) | [📧 Support](mailto:support@example.com) | [🐛 Issues](https://github.com/wizardleeen/cli-coding-agent/issues)