export const splitPanes = (containerWidth: number, sidebarWidth: number) => {
  const minSidebarWidth = 200
  const maxSidebarWidth = containerWidth * 0.5
  const clampedSidebarWidth = Math.max(minSidebarWidth, Math.min(maxSidebarWidth, sidebarWidth))
  const mainWidth = containerWidth - clampedSidebarWidth - 4 // 4px for resize handle
  
  return {
    sidebarWidth: clampedSidebarWidth,
    mainWidth,
    isValidLayout: mainWidth > 300 // Minimum width for terminal
  }
}

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date)
}