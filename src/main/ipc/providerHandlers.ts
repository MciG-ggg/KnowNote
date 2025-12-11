import { ipcMain } from 'electron'
import { providersManager } from '../config/store'
import { ProviderManager } from '../providers/ProviderManager'

/**
 * 注册 Provider 配置相关的 IPC Handlers
 */
export function registerProviderHandlers(providerManager: ProviderManager) {
  // 保存提供商配置
  ipcMain.handle('save-provider-config', async (_event, config: any) => {
    await providersManager.saveProviderConfig(config.providerName, config.config, config.enabled)
  })

  // 获取单个提供商配置
  ipcMain.handle('get-provider-config', async (_event, providerName: string) => {
    return await providersManager.getProviderConfig(providerName)
  })

  // 获取所有提供商配置
  ipcMain.handle('get-all-provider-configs', async () => {
    return await providersManager.getAllProviderConfigs()
  })

  // 验证提供商配置
  ipcMain.handle('validate-provider-config', async (_event, providerName: string, config: any) => {
    const provider = providerManager.getProvider(providerName)
    if (!provider || !provider.validateConfig) {
      return false
    }
    return provider.validateConfig(config)
  })

  console.log('[IPC] Provider handlers registered')
}
