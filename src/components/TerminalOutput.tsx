import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { TerminalCommand } from '../context/TerminalContext'

interface TerminalOutputProps {
  content: string | React.ReactNode
  type: TerminalCommand['type']
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ content, type }) => {
  // If content is already a React node, render it directly
  if (React.isValidElement(content)) {
    return <div className={`output-${type}`}>{content}</div>
  }

  // Handle string content
  const stringContent = content as string
  
  // Check if content looks like code (has common code patterns)
  const isCode = detectCode(stringContent)
  
  if (isCode) {
    const language = detectLanguage(stringContent)
    return (
      <div className={`output-${type}`}>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            background: '#111111',
            border: '1px solid #333333',
            borderRadius: '6px',
            fontSize: '13px',
            margin: '8px 0'
          }}
          showLineNumbers={stringContent.split('\n').length > 5}
        >
          {stringContent}
        </SyntaxHighlighter>
      </div>
    )
  }

  // Regular text output with basic formatting
  return (
    <div className={`output-${type}`}>
      {stringContent.split('\n').map((line, index) => (
        <div key={index}>{formatLine(line)}</div>
      ))}
    </div>
  )
}

// Detect if content is likely code
function detectCode(content: string): boolean {
  const codePatterns = [
    /^\s*(import|export|function|class|interface|type)\s/m,
    /^\s*(const|let|var)\s+\w+\s*=/m,
    /^\s*(def|if|for|while|try|except)\s/m,
    /^\s*(<\w+|<\/\w+)/m, // HTML tags
    /\{[\w\s,.:]+\}/,  // JSON-like objects
    /^\s*[\w-]+:\s*[\w\s#().,]+;/m, // CSS properties
    /^\s*#.*$/m, // Comments
    /^\s*\/\/.*$/m, // JS comments
  ]
  
  return codePatterns.some(pattern => pattern.test(content))
}

// Detect programming language from content
function detectLanguage(content: string): string {
  // JavaScript/TypeScript patterns
  if (/\b(import|export|function|const|let|var|=>|interface|type)\b/.test(content)) {
    return /\b(interface|type|as\s+\w+)\b/.test(content) ? 'typescript' : 'javascript'
  }
  
  // Python patterns
  if (/\b(def|import|from|if __name__|print|class)\b/.test(content)) {
    return 'python'
  }
  
  // HTML patterns
  if (/<\/?\w+[^>]*>/.test(content)) {
    return 'html'
  }
  
  // CSS patterns
  if (/[\w-]+:\s*[\w\s#().,%-]+;/.test(content)) {
    return 'css'
  }
  
  // JSON patterns
  if (/^\s*[{\[]/.test(content.trim()) && /[}\]]\s*$/.test(content.trim())) {
    try {
      JSON.parse(content)
      return 'json'
    } catch {
      // Not valid JSON, continue
    }
  }
  
  // Shell/Bash patterns
  if (/^\s*(#!/bin|ls|cd|mkdir|rm|cp|mv|cat|grep)\b/m.test(content)) {
    return 'bash'
  }
  
  return 'text'
}

// Format a line of text with basic styling
function formatLine(line: string): React.ReactNode {
  // Handle inline code blocks
  if (line.includes('`')) {
    const parts = line.split('`')
    return parts.map((part, index) => 
      index % 2 === 0 ? part : <code key={index}>{part}</code>
    )
  }
  
  return line
}

export default TerminalOutput