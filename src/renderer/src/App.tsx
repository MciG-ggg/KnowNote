import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import NotebookLayout from './components/notebook/NotebookLayout'
import NotebookList from './components/pages/NotebookList'
import SettingsWindow from './components/settings/SettingsWindow'
import { setupChatListeners } from './store/chatStore'
import { useThemeStore } from './store/themeStore'

function App(): React.JSX.Element {
  const initTheme = useThemeStore((state) => state.initTheme)

  // 初始化聊天监听器
  useEffect(() => {
    const cleanup = setupChatListeners()
    return cleanup
  }, [])

  // 初始化主题
  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<NotebookList />} />
        <Route path="/notebook/:id" element={<NotebookLayout />} />
        <Route path="/settings" element={<SettingsWindow />} />
      </Routes>
    </HashRouter>
  )
}

export default App
