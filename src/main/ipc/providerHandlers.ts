import { ipcMain } from 'electron'
import * as queries from '../db/queries'
import { ProviderManager } from '../providers/ProviderManager'

/**
 * 注册 Provider 配置相关的 IPC Handlers
 */
export function registerProviderHandlers(providerManager: ProviderManager) {
  ipcMain.handle('save-provider-config', async (_event, config: any) => {
    queries.saveProviderConfig(config.providerName, config.config, config.enabled)
  })

  ipcMain.handle('get-provider-config', async (_event, providerName: string) => {
    return queries.getProviderConfig(providerName)
  })

  ipcMain.handle('get-all-provider-configs', async () => {
    return queries.getAllProviderConfigs()
  })

  ipcMain.handle('validate-provider-config', async (_event, providerName: string, config: any) => {
    const provider = providerManager.getProvider(providerName)
    if (!provider || !provider.validateConfig) {
      return false
    }
    return provider.validateConfig(config)
  })
}
