import { useState, useRef, useEffect } from 'react'
import Terminal from './components/Terminal'
import Sidebar from './components/Sidebar'
import { FileSystemProvider } from './context/FileSystemContext'
import { TerminalProvider } from './context/TerminalContext'
import { splitPanes } from './utils/layout'
import './App.css'

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const newWidth = e.clientX
      const minWidth = 200
      const maxWidth = window.innerWidth * 0.5
      
      setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <FileSystemProvider>
      <TerminalProvider>
        <div className="app" ref={containerRef}>
          <div className="app-header">
            <div className="title-bar">
              <div className="window-controls">
                <div className="window-control close"></div>
                <div className="window-control minimize"></div>
                <div className="window-control maximize"></div>
              </div>
              <div className="app-title">
                <span className="title-icon">⚡</span>
                CLI Coding Agent
              </div>
              <div className="app-info">
                <span className="version">v1.0.0</span>
              </div>
            </div>
          </div>
          
          <div className="app-content">
            <div className="sidebar" style={{ width: sidebarWidth }}>
              <Sidebar />
            </div>
            
            <div 
              className={`resize-handle ${isDragging ? 'dragging' : ''}`}
              onMouseDown={handleMouseDown}
            >
              <div className="resize-line"></div>
            </div>
            
            <div className="main-content" style={{ width: `calc(100% - ${sidebarWidth + 4}px)` }}>
              <Terminal />
            </div>
          </div>
        </div>
      </TerminalProvider>
    </FileSystemProvider>
  )
}

export default App