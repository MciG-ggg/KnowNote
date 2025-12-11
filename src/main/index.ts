import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { initDatabase, runMigrations, closeDatabase } from './db'
import { ProviderManager } from './providers/ProviderManager'
import { SessionAutoSwitchService } from './services/SessionAutoSwitchService'
import { createMainWindow, createSettingsWindow, destroySettingsWindow } from './windows'
import { registerAllHandlers } from './ipc'

let providerManager: ProviderManager | null = null
let sessionAutoSwitchService: SessionAutoSwitchService | null = null

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // 初始化数据库
  console.log('[Main] 初始化数据库...')
  initDatabase()
  runMigrations()
  console.log('[Main] 数据库初始化完成')

  // 初始化 Provider Manager
  console.log('[Main] 初始化 Provider Manager...')
  providerManager = new ProviderManager()
  console.log('[Main] Provider Manager 初始化完成')

  // 初始化 Session 自动切换服务
  console.log('[Main] 初始化 Session 自动切换服务...')
  sessionAutoSwitchService = new SessionAutoSwitchService(providerManager)
  console.log('[Main] Session 自动切换服务初始化完成')

  // 注册所有 IPC Handlers
  registerAllHandlers(providerManager, sessionAutoSwitchService)

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 处理打开设置窗口的请求
  ipcMain.handle('open-settings', () => {
    createSettingsWindow()
  })

  // 创建主窗口
  createMainWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 确保在应用退出前关闭所有窗口和数据库连接
app.on('before-quit', () => {
  destroySettingsWindow()

  // 关闭数据库连接
  console.log('[Main] 关闭数据库连接...')
  closeDatabase()
})
