/**
 * 配置管理模块统一导出
 */

export { getStore } from './store'
export { SettingsManager } from './settingsManager'
export { ProvidersManager } from './providersManager'
export type { AppSettings, ProviderConfig, StoreSchema } from './types'

// 导出单例实例
import { getStore } from './store'
import { SettingsManager } from './settingsManager'
import { ProvidersManager } from './providersManager'

export const settingsManager = new SettingsManager(getStore)
export const providersManager = new ProvidersManager(getStore)
