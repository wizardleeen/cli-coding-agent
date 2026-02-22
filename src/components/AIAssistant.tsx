import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Code2, FileText, Lightbulb } from 'lucide-react'
import { useFileSystem } from '../context/FileSystemContext'
import { useTerminal } from '../context/TerminalContext'

interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'code' | 'suggestion'
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI coding assistant. I can help you:\n\n• Generate code snippets\n• Explain existing code\n• Suggest improvements\n• Debug issues\n• Create project files\n\nWhat would you like to work on?',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { currentFile, createFile } = useFileSystem()
  const { executeCommand } = useTerminal()

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(input)
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        type: response.type
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const quickActions = [
    {
      icon: <Code2 size={12} />,
      label: 'Generate React component',
      action: () => setInput('Create a React component for a user profile card')
    },
    {
      icon: <FileText size={12} />,
      label: 'Explain current file',
      action: () => setInput(currentFile ? `Explain the code in ${currentFile.name}` : 'No file selected')
    },
    {
      icon: <Lightbulb size={12} />,
      label: 'Suggest improvements',
      action: () => setInput('Suggest improvements for better code quality')
    }
  ]

  return (
    <div className="ai-assistant">
      <div className="ai-chat" ref={chatRef}>
        {messages.map((message) => (
          <div key={message.id} className={`ai-message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
            </div>
            <div className="message-content">
              {message.type === 'code' ? (
                <pre><code>{message.content}</code></pre>
              ) : (
                <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
              )}
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="ai-message assistant">
            <div className="message-avatar">
              <Bot size={12} />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="quick-action"
            onClick={action.action}
            disabled={isLoading}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="ai-input">
        <div className="ai-input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about coding..."
            className="ai-input-field"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="ai-send-btn"
            disabled={!input.trim() || isLoading}
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  )
}

function generateAIResponse(input: string): { content: string, type: AIMessage['type'] } {
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.includes('react component')) {
    return {
      content: `Here's a React component based on your request:\n\nconst UserProfile = ({ user }) => {\n  return (\n    <div className="user-profile">\n      <img src={user.avatar} alt={user.name} />\n      <h3>{user.name}</h3>\n      <p>{user.email}</p>\n      <div className="user-bio">\n        {user.bio}\n      </div>\n    </div>\n  )\n}\n\nexport default UserProfile\n\nThis component accepts a user object as props and displays their profile information with avatar, name, email, and bio.`,
      type: 'code'
    }
  }
  
  if (lowerInput.includes('explain')) {
    return {
      content: 'I\'d be happy to explain code for you! To provide the best explanation, please:\n\n1. Select a file from the file explorer, or\n2. Paste the code you want explained\n\nI can break down the logic, explain patterns used, and suggest improvements.',
      type: 'text'
    }
  }
  
  if (lowerInput.includes('python')) {
    return {
      content: `Here's a Python example:\n\ndef fibonacci(n):\n    """Generate fibonacci sequence up to n terms"""\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    elif n == 2:\n        return [0, 1]\n    \n    sequence = [0, 1]\n    for i in range(2, n):\n        sequence.append(sequence[i-1] + sequence[i-2])\n    \n    return sequence\n\n# Example usage\nresult = fibonacci(10)\nprint(result)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
      type: 'code'
    }
  }
  
  if (lowerInput.includes('improve') || lowerInput.includes('better')) {
    return {
      content: 'Here are some general code improvement suggestions:\n\n• Use meaningful variable and function names\n• Keep functions small and focused (single responsibility)\n• Add proper error handling\n• Write comments for complex logic\n• Use consistent formatting and style\n• Implement proper testing\n• Avoid code duplication (DRY principle)\n• Consider performance implications\n\nTo give more specific suggestions, please share the code you\'d like me to review!',
      type: 'text'
    }
  }
  
  // Default responses
  const responses = [
    'I understand you\'re working on something interesting! Could you provide more details about what you\'d like me to help with?',
    'That\'s a great question! To give you the best assistance, could you be more specific about the programming language or framework you\'re using?',
    'I\'m here to help with your coding needs! Whether it\'s debugging, code generation, or explanations - just let me know what you need.',
    'Interesting! Let me help you with that. Could you provide more context about your project or the specific problem you\'re trying to solve?'
  ]
  
  return {
    content: responses[Math.floor(Math.random() * responses.length)],
    type: 'text'
  }
}

export default AIAssistant