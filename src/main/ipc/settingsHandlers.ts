import { ipcMain, BrowserWindow } from 'electron'
import { settingsManager, AppSettings } from '../config/store'

/**
 * 向所有窗口广播设置变化
 */
function broadcastSettingsChange(newSettings: AppSettings, oldSettings: AppSettings): void {
  BrowserWindow.getAllWindows().forEach((window) => {
    if (!window.isDestroyed()) {
      window.webContents.send('settings:changed', newSettings, oldSettings)
    }
  })
}

/**
 * 注册设置相关的 IPC Handlers
 */
export function registerSettingsHandlers(): void {
  // 获取所有设置
  ipcMain.handle('settings:getAll', async () => {
    return await settingsManager.getAllSettings()
  })

  // 获取单个设置
  ipcMain.handle('settings:get', async (_event, key: keyof AppSettings) => {
    return await settingsManager.getSetting(key)
  })

  // 更新设置
  ipcMain.handle('settings:update', async (_event, updates: Partial<AppSettings>) => {
    await settingsManager.updateSettings(updates)
    return await settingsManager.getAllSettings()
  })

  // 设置单个值
  ipcMain.handle('settings:set', async (_event, key: keyof AppSettings, value: any) => {
    await settingsManager.setSetting(key, value)
    return await settingsManager.getSetting(key)
  })

  // 重置设置
  ipcMain.handle('settings:reset', async () => {
    await settingsManager.resetSettings()
    return await settingsManager.getAllSettings()
  })

  // 监听设置变化并广播到所有窗口
  settingsManager.onSettingsChange((newSettings, oldSettings) => {
    console.log('[IPC] Settings changed, broadcasting to all windows')
    broadcastSettingsChange(newSettings, oldSettings)
  })

  console.log('[IPC] Settings handlers registered')
}
