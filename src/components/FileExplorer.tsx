import React from 'react'
import { FileText, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react'
import { useFileSystem, FileNode } from '../context/FileSystemContext'

const FileExplorer: React.FC = () => {
  const { files, currentFile, selectFile, toggleDirectory } = useFileSystem()

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ paddingLeft: `${depth * 16}px` }}>
        <div 
          className={`file-item ${node.type} ${currentFile?.id === node.id ? 'selected' : ''}`}
          onClick={() => {
            if (node.type === 'directory') {
              toggleDirectory(node.id)
            } else {
              selectFile(node)
            }
          }}
        >
          <div className="file-icon">
            {node.type === 'directory' ? (
              <>
                {node.isOpen ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
                {node.isOpen ? <FolderOpen size={14} /> : <Folder size={14} />}
              </>
            ) : (
              <FileText size={14} />
            )}
          </div>
          <span className="file-name">{node.name}</span>
          {node.type === 'file' && (
            <span className="file-size">{formatFileSize(node.size)}</span>
          )}
        </div>
        
        {node.type === 'directory' && node.isOpen && node.children && (
          <div className="directory-children">
            {renderFileTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ))
  }

  if (files.length === 0) {
    return (
      <div className="empty-explorer">
        <h4>No files yet</h4>
        <p>
          Create your first file using the <code>+</code> button or the terminal command <code>create &lt;filename&gt;</code>
        </p>
      </div>
    )
  }

  return (
    <div className="file-explorer">
      <div className="file-tree">
        {renderFileTree(files)}
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default FileExplorer