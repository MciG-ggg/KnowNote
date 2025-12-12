/**
 * 应用设置接口
 */
export interface AppSettings {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US'
  autoLaunch: boolean
  defaultModel?: string
}

/**
 * 提供商配置接口
 */
export interface ProviderConfig {
  providerName: string
  config: Record<string, any>
  enabled: boolean
  updatedAt: number
}

/**
 * Store Schema 定义
 */
export interface StoreSchema {
  settings: AppSettings
  providers: Record<string, ProviderConfig>
}
