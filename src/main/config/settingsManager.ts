import type Store from 'electron-store'
import type { AppSettings } from './types'

/**
 * 默认设置
 */
const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'zh-CN',
  autoLaunch: false,
  defaultModel: undefined
}

/**
 * 设置管理器
 */
export class SettingsManager {
  private getStore: () => Promise<Store<any>>

  constructor(getStore: () => Promise<Store<any>>) {
    this.getStore = getStore
  }

  /**
   * 获取所有设置
   */
  async getAllSettings(): Promise<AppSettings> {
    const store = await this.getStore()
    return store.get('settings', defaultSettings)
  }

  /**
   * 获取单个设置
   */
  async getSetting<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    const settings = await this.getAllSettings()
    return settings[key]
  }

  /**
   * 更新设置
   */
  async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    const store = await this.getStore()
    const current = await this.getAllSettings()
    const newSettings = { ...current, ...updates }
    store.set('settings', newSettings)
  }

  /**
   * 设置单个值
   */
  async setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    await this.updateSettings({ [key]: value } as Partial<AppSettings>)
  }

  /**
   * 重置为默认设置
   */
  async resetSettings(): Promise<void> {
    const store = await this.getStore()
    store.set('settings', defaultSettings)
  }

  /**
   * 监听设置变化
   */
  async onSettingsChange(
    callback: (newSettings: AppSettings, oldSettings: AppSettings) => void
  ): Promise<() => void> {
    const store = await this.getStore()
    return store.onDidChange('settings', (newValue, oldValue) => {
      if (newValue && oldValue) {
        callback(newValue, oldValue)
      }
    })
  }
}
