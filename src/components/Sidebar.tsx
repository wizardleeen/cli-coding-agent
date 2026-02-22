import { useState } from 'react'
import { 
  Files, 
  Plus, 
  FolderPlus, 
  Search, 
  Bot, 
  Code2,
  FileText,
  Folder,
  ChevronRight,
  ChevronDown,
  X
} from 'lucide-react'
import { useFileSystem } from '../context/FileSystemContext'
import { useTerminal } from '../context/TerminalContext'
import FileExplorer from './FileExplorer'
import AIAssistant from './AIAssistant'
import './Sidebar.css'

type SidebarTab = 'files' | 'ai'

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('files')
  const [searchQuery, setSearchQuery] = useState('')
  const { files, searchFiles, createFile, createDirectory } = useFileSystem()
  const { executeCommand } = useTerminal()

  const searchResults = searchQuery ? searchFiles(searchQuery) : []

  const handleCreateFile = async () => {
    const fileName = prompt('Enter file name:')
    if (fileName) {
      createFile(fileName, '')
      await executeCommand(`create ${fileName}`)
    }
  }

  const handleCreateFolder = () => {
    const folderName = prompt('Enter folder name:')
    if (folderName) {
      createDirectory(folderName)
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <button
          className={`tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
          title="File Explorer"
        >
          <Files size={16} />
          <span>Files</span>
        </button>
        <button
          className={`tab ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
          title="AI Assistant"
        >
          <Bot size={16} />
          <span>AI</span>
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'files' && (
          <div className="files-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Files size={14} />
                <span>Explorer</span>
              </div>
              <div className="panel-actions">
                <button 
                  className="action-btn" 
                  onClick={handleCreateFile}
                  title="New File"
                >
                  <Plus size={14} />
                </button>
                <button 
                  className="action-btn" 
                  onClick={handleCreateFolder}
                  title="New Folder"
                >
                  <FolderPlus size={14} />
                </button>
              </div>
            </div>

            <div className="search-container">
              <div className="search-input-wrapper">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    className="search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="files-content">
              {searchQuery ? (
                <div className="search-results">
                  <div className="search-header">
                    <span>Search Results ({searchResults.length})</span>
                  </div>
                  {searchResults.length > 0 ? (
                    <div className="search-list">
                      {searchResults.map(file => (
                        <div key={file.id} className="search-item">
                          {file.type === 'file' ? (
                            <FileText size={14} />
                          ) : (
                            <Folder size={14} />
                          )}
                          <span className="search-item-name">{file.name}</span>
                          <span className="search-item-path">{file.path}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-results">
                      <span>No files found</span>
                    </div>
                  )}
                </div>
              ) : (
                <FileExplorer />
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ai-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Bot size={14} />
                <span>AI Assistant</span>
              </div>
            </div>
            <AIAssistant />
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar