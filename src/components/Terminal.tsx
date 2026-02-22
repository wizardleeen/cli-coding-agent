import { useState, useEffect, useRef } from 'react'
import { useTerminal } from '../context/TerminalContext'
import { useFileSystem } from '../context/FileSystemContext'
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react'
import TerminalOutput from './TerminalOutput'
import './Terminal.css'

const Terminal = () => {
  const { history, currentInput, isProcessing, setCurrentInput, executeCommand, clearHistory } = useTerminal()
  const { files } = useFileSystem()
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Auto-focus input and scroll to bottom
  useEffect(() => {
    if (inputRef.current && !isProcessing) {
      inputRef.current.focus()
    }
  }, [isProcessing])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value)
    setHistoryIndex(-1)
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      if (currentInput.trim()) {
        // Handle special commands
        if (currentInput.trim() === 'clear') {
          clearHistory()
          setCurrentInput('')
          return
        }

        // Add to command history
        setCommandHistory(prev => [...prev, currentInput])
        setHistoryIndex(-1)
        
        await executeCommand(currentInput)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Basic tab completion for commands
      const commands = ['help', 'create', 'generate', 'explain', 'refactor', 'ls', 'cat', 'clear', 'version']
      const input = currentInput.toLowerCase()
      const matches = commands.filter(cmd => cmd.startsWith(input))
      if (matches.length === 1) {
        setCurrentInput(matches[0] + ' ')
      }
    }
  }

  const getPrompt = () => {
    return (
      <span className="prompt">
        <span className="prompt-user">agent</span>
        <span className="prompt-separator">@</span>
        <span className="prompt-host">cli</span>
        <span className="prompt-path">:~/workspace</span>
        <span className="prompt-symbol">$</span>
      </span>
    )
  }

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">
          <TerminalIcon size={16} />
          <span>Terminal</span>
        </div>
        <div className="terminal-info">
          <span className="file-count">{files.length} files</span>
          <span className="status">
            {isProcessing ? (
              <span className="status-processing">• Processing...</span>
            ) : (
              <span className="status-ready">• Ready</span>
            )}
          </span>
        </div>
      </div>
      
      <div className="terminal-content" ref={terminalRef}>
        <div className="terminal-history">
          {history.map((command) => (
            <div key={command.id} className={`terminal-entry ${command.type}`}>
              {command.input && (
                <div className="terminal-input">
                  {getPrompt()}
                  <span className="command-text">{command.input}</span>
                  {command.isLoading && (
                    <span className="loading-spinner">
                      <span className="spinner"></span>
                    </span>
                  )}
                </div>
              )}
              {command.output && (
                <div className="terminal-output">
                  <TerminalOutput content={command.output} type={command.type} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="terminal-input-line">
          {getPrompt()}
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="terminal-input-field"
            placeholder="Type a command... (try 'help')"
            disabled={isProcessing}
            spellCheck={false}
            autoComplete="off"
          />
          {isProcessing && (
            <div className="input-spinner">
              <span className="spinner"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Terminal