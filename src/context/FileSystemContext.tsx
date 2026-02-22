import React, { createContext, useContext, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'directory'
  content?: string
  language?: string
  children?: FileNode[]
  parent?: string
  path: string
  size: number
  lastModified: Date
  isOpen?: boolean
}

export interface FileSystemContextType {
  files: FileNode[]
  currentFile: FileNode | null
  createFile: (name: string, content: string, language?: string, parentPath?: string) => FileNode
  createDirectory: (name: string, parentPath?: string) => FileNode
  updateFile: (id: string, content: string) => void
  deleteFile: (id: string) => void
  selectFile: (file: FileNode | null) => void
  getFileByPath: (path: string) => FileNode | null
  toggleDirectory: (id: string) => void
  searchFiles: (query: string) => FileNode[]
}

const FileSystemContext = createContext<FileSystemContextType | null>(null)

export const useFileSystem = () => {
  const context = useContext(FileSystemContext)
  if (!context) {
    throw new Error('useFileSystem must be used within a FileSystemProvider')
  }
  return context
}

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileNode[]>([])
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null)

  const createFile = useCallback((name: string, content: string = '', language?: string, parentPath: string = '/') => {
    const id = uuidv4()
    const path = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`
    
    const newFile: FileNode = {
      id,
      name,
      type: 'file',
      content,
      language: language || getLanguageFromExtension(name),
      path,
      size: content.length,
      lastModified: new Date(),
      parent: parentPath
    }

    setFiles(prevFiles => {
      if (parentPath === '/') {
        return [...prevFiles, newFile]
      }
      
      return addToDirectory(prevFiles, parentPath, newFile)
    })

    return newFile
  }, [])

  const createDirectory = useCallback((name: string, parentPath: string = '/') => {
    const id = uuidv4()
    const path = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`
    
    const newDir: FileNode = {
      id,
      name,
      type: 'directory',
      children: [],
      path,
      size: 0,
      lastModified: new Date(),
      parent: parentPath,
      isOpen: false
    }

    setFiles(prevFiles => {
      if (parentPath === '/') {
        return [...prevFiles, newDir]
      }
      
      return addToDirectory(prevFiles, parentPath, newDir)
    })

    return newDir
  }, [])

  const updateFile = useCallback((id: string, content: string) => {
    setFiles(prevFiles => updateFileInTree(prevFiles, id, content))
    
    if (currentFile && currentFile.id === id) {
      setCurrentFile(prev => prev ? { ...prev, content, size: content.length, lastModified: new Date() } : null)
    }
  }, [currentFile])

  const deleteFile = useCallback((id: string) => {
    setFiles(prevFiles => removeFromTree(prevFiles, id))
    
    if (currentFile && currentFile.id === id) {
      setCurrentFile(null)
    }
  }, [currentFile])

  const selectFile = useCallback((file: FileNode | null) => {
    setCurrentFile(file)
  }, [])

  const getFileByPath = useCallback((path: string): FileNode | null => {
    const findInTree = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.path === path) return node
        if (node.children) {
          const found = findInTree(node.children)
          if (found) return found
        }
      }
      return null
    }
    
    return findInTree(files)
  }, [files])

  const toggleDirectory = useCallback((id: string) => {
    setFiles(prevFiles => toggleDirectoryInTree(prevFiles, id))
  }, [])

  const searchFiles = useCallback((query: string): FileNode[] => {
    if (!query.trim()) return []
    
    const results: FileNode[] = []
    const searchInTree = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.name.toLowerCase().includes(query.toLowerCase()) || 
            (node.content && node.content.toLowerCase().includes(query.toLowerCase()))) {
          results.push(node)
        }
        if (node.children) {
          searchInTree(node.children)
        }
      })
    }
    
    searchInTree(files)
    return results
  }, [files])

  const contextValue: FileSystemContextType = {
    files,
    currentFile,
    createFile,
    createDirectory,
    updateFile,
    deleteFile,
    selectFile,
    getFileByPath,
    toggleDirectory,
    searchFiles
  }

  return (
    <FileSystemContext.Provider value={contextValue}>
      {children}
    </FileSystemContext.Provider>
  )
}

// Helper functions
function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'md': 'markdown',
    'yaml': 'yaml',
    'yml': 'yaml',
    'xml': 'xml',
    'sql': 'sql',
    'sh': 'bash',
    'go': 'go',
    'rs': 'rust',
    'cpp': 'cpp',
    'c': 'c',
    'java': 'java',
    'php': 'php'
  }
  return languageMap[ext || ''] || 'text'
}

function addToDirectory(files: FileNode[], parentPath: string, newNode: FileNode): FileNode[] {
  return files.map(file => {
    if (file.path === parentPath && file.type === 'directory') {
      return {
        ...file,
        children: [...(file.children || []), newNode]
      }
    }
    if (file.children) {
      return {
        ...file,
        children: addToDirectory(file.children, parentPath, newNode)
      }
    }
    return file
  })
}

function updateFileInTree(files: FileNode[], id: string, content: string): FileNode[] {
  return files.map(file => {
    if (file.id === id) {
      return {
        ...file,
        content,
        size: content.length,
        lastModified: new Date()
      }
    }
    if (file.children) {
      return {
        ...file,
        children: updateFileInTree(file.children, id, content)
      }
    }
    return file
  })
}

function removeFromTree(files: FileNode[], id: string): FileNode[] {
  return files.filter(file => file.id !== id).map(file => {
    if (file.children) {
      return {
        ...file,
        children: removeFromTree(file.children, id)
      }
    }
    return file
  })
}

function toggleDirectoryInTree(files: FileNode[], id: string): FileNode[] {
  return files.map(file => {
    if (file.id === id && file.type === 'directory') {
      return {
        ...file,
        isOpen: !file.isOpen
      }
    }
    if (file.children) {
      return {
        ...file,
        children: toggleDirectoryInTree(file.children, id)
      }
    }
    return file
  })
}