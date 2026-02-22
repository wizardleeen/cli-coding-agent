import React, { createContext, useContext, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface TerminalCommand {
  id: string
  input: string
  output?: string | React.ReactNode
  type: 'command' | 'system' | 'error' | 'success'
  timestamp: Date
  isLoading?: boolean
}

export interface TerminalContextType {
  history: TerminalCommand[]
  currentInput: string
  isProcessing: boolean
  addCommand: (command: Omit<TerminalCommand, 'id' | 'timestamp'>) => string
  updateCommand: (id: string, updates: Partial<TerminalCommand>) => void
  setCurrentInput: (input: string) => void
  executeCommand: (input: string) => Promise<void>
  clearHistory: () => void
  setProcessing: (processing: boolean) => void
}

const TerminalContext = createContext<TerminalContextType | null>(null)

export const useTerminal = () => {
  const context = useContext(TerminalContext)
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider')
  }
  return context
}

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<TerminalCommand[]>([
    {
      id: uuidv4(),
      input: '',
      output: (
        <div className="welcome-message">
          <div className="ascii-art">
            ╭─────────────────────────────────────────╮<br/>
            │  🤖 CLI Coding Agent - Ready to assist! │<br/>
            ╰─────────────────────────────────────────╯
          </div>
          <div className="help-text">
            <p>Available commands:</p>
            <ul>
              <li><code>help</code> - Show available commands</li>
              <li><code>create &lt;filename&gt;</code> - Create a new file</li>
              <li><code>generate &lt;description&gt;</code> - Generate code</li>
              <li><code>explain &lt;filename&gt;</code> - Explain code</li>
              <li><code>refactor &lt;filename&gt;</code> - Refactor code</li>
              <li><code>ls</code> - List files</li>
              <li><code>cat &lt;filename&gt;</code> - View file content</li>
              <li><code>clear</code> - Clear terminal</li>
            </ul>
          </div>
        </div>
      ),
      type: 'system',
      timestamp: new Date()
    }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const addCommand = useCallback((command: Omit<TerminalCommand, 'id' | 'timestamp'>) => {
    const id = uuidv4()
    const newCommand: TerminalCommand = {
      ...command,
      id,
      timestamp: new Date()
    }
    
    setHistory(prev => [...prev, newCommand])
    return id
  }, [])

  const updateCommand = useCallback((id: string, updates: Partial<TerminalCommand>) => {
    setHistory(prev => prev.map(cmd => 
      cmd.id === id ? { ...cmd, ...updates } : cmd
    ))
  }, [])

  const executeCommand = useCallback(async (input: string) => {
    if (!input.trim()) return

    setIsProcessing(true)
    setCurrentInput('')

    // Add the user's command to history
    const commandId = addCommand({
      input,
      type: 'command',
      isLoading: true
    })

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Process the command
      const result = await processCommand(input)
      
      updateCommand(commandId, {
        output: result.output,
        type: result.type,
        isLoading: false
      })
    } catch (error) {
      updateCommand(commandId, {
        output: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
        isLoading: false
      })
    } finally {
      setIsProcessing(false)
    }
  }, [addCommand, updateCommand])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const setProcessing = useCallback((processing: boolean) => {
    setIsProcessing(processing)
  }, [])

  const contextValue: TerminalContextType = {
    history,
    currentInput,
    isProcessing,
    addCommand,
    updateCommand,
    setCurrentInput,
    executeCommand,
    clearHistory,
    setProcessing
  }

  return (
    <TerminalContext.Provider value={contextValue}>
      {children}
    </TerminalContext.Provider>
  )
}

// Command processing function
async function processCommand(input: string): Promise<{ output: React.ReactNode | string, type: TerminalCommand['type'] }> {
  const [command, ...args] = input.trim().split(' ')
  const argument = args.join(' ')

  switch (command.toLowerCase()) {
    case 'help':
      return {
        output: (
          <div className="help-output">
            <h3>Available Commands:</h3>
            <div className="command-list">
              <div className="command-item">
                <code>help</code> - Show this help message
              </div>
              <div className="command-item">
                <code>create &lt;filename&gt;</code> - Create a new file with AI assistance
              </div>
              <div className="command-item">
                <code>generate &lt;description&gt;</code> - Generate code based on description
              </div>
              <div className="command-item">
                <code>explain &lt;filename&gt;</code> - Get explanation of code in file
              </div>
              <div className="command-item">
                <code>refactor &lt;filename&gt;</code> - Refactor code in file
              </div>
              <div className="command-item">
                <code>ls</code> - List all files in workspace
              </div>
              <div className="command-item">
                <code>cat &lt;filename&gt;</code> - Display file contents
              </div>
              <div className="command-item">
                <code>clear</code> - Clear terminal history
              </div>
              <div className="command-item">
                <code>version</code> - Show version information
              </div>
            </div>
          </div>
        ),
        type: 'system'
      }

    case 'clear':
      // This will be handled by the terminal component
      return { output: '', type: 'system' }

    case 'version':
      return {
        output: (
          <div className="version-info">
            <div>CLI Coding Agent v1.0.0</div>
            <div>Built with React + TypeScript</div>
            <div>Powered by AI assistance</div>
          </div>
        ),
        type: 'system'
      }

    case 'ls':
      return {
        output: (
          <div className="file-list">
            <div>📁 workspace/</div>
            <div>  📄 No files created yet</div>
            <div>  💡 Use 'create &lt;filename&gt;' to create your first file</div>
          </div>
        ),
        type: 'system'
      }

    case 'create':
      if (!argument) {
        return {
          output: 'Usage: create <filename>\nExample: create app.py',
          type: 'error'
        }
      }
      
      return {
        output: (
          <div className="create-output">
            <div>🚀 Creating file: <code>{argument}</code></div>
            <div>💡 File created! You can now edit it in the sidebar.</div>
            <div>🤖 AI suggestions will appear as you type.</div>
          </div>
        ),
        type: 'success'
      }

    case 'generate':
      if (!argument) {
        return {
          output: 'Usage: generate <description>\nExample: generate a React component for user login',
          type: 'error'
        }
      }
      
      return {
        output: (
          <div className="generate-output">
            <div>🤖 Generating code for: <em>{argument}</em></div>
            <div>⚡ This feature will analyze your request and generate appropriate code.</div>
            <div>📝 The generated code will be saved to a new file.</div>
          </div>
        ),
        type: 'success'
      }

    case 'explain':
      if (!argument) {
        return {
          output: 'Usage: explain <filename>\nExample: explain app.py',
          type: 'error'
        }
      }
      
      return {
        output: (
          <div className="explain-output">
            <div>🔍 Analyzing file: <code>{argument}</code></div>
            <div>📖 This feature will provide detailed explanations of your code.</div>
            <div>💡 Including function descriptions, logic flow, and best practices.</div>
          </div>
        ),
        type: 'success'
      }

    case 'refactor':
      if (!argument) {
        return {
          output: 'Usage: refactor <filename>\nExample: refactor app.py',
          type: 'error'
        }
      }
      
      return {
        output: (
          <div className="refactor-output">
            <div>🔧 Refactoring file: <code>{argument}</code></div>
            <div>✨ This feature will suggest improvements to your code.</div>
            <div>🎯 Including performance optimizations and cleaner patterns.</div>
          </div>
        ),
        type: 'success'
      }

    case 'cat':
      if (!argument) {
        return {
          output: 'Usage: cat <filename>\nExample: cat app.py',
          type: 'error'
        }
      }
      
      return {
        output: (
          <div className="cat-output">
            <div>📄 File: <code>{argument}</code></div>
            <div>📝 File content would be displayed here.</div>
            <div>💡 Create some files first using 'create &lt;filename&gt;'</div>
          </div>
        ),
        type: 'system'
      }

    default:
      return {
        output: (
          <div className="error-output">
            <div>❌ Unknown command: <code>{command}</code></div>
            <div>💡 Type <code>help</code> to see available commands.</div>
          </div>
        ),
        type: 'error'
      }
  }
}