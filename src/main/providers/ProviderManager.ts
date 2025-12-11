import type { LLMProvider } from './types'
import { OpenAIProvider } from './OpenAIProvider'
import { OllamaProvider } from './OllamaProvider'
import * as queries from '../db/queries'

/**
 * Provider Manager
 * 管理所有 AI Provider 实例并提供统一的访问接口
 */
export class ProviderManager {
  private providers: Map<string, LLMProvider> = new Map()

  constructor() {
    // 注册所有 Provider
    this.registerProvider(new OpenAIProvider())
    this.registerProvider(new OllamaProvider())

    // 未来可以在这里注册更多 Provider
    // this.registerProvider(new DeepSeekProvider())
    // this.registerProvider(new KimiProvider())
  }

  /**
   * 注册一个 Provider
   */
  private registerProvider(provider: LLMProvider) {
    this.providers.set(provider.name, provider)
    console.log(`[ProviderManager] 已注册 Provider: ${provider.name}`)
  }

  /**
   * 获取指定名称的 Provider
   */
  getProvider(name: string): LLMProvider | undefined {
    return this.providers.get(name)
  }

  /**
   * 获取当前激活的 Provider
   * 从数据库读取配置，返回第一个启用的 Provider
   * 如果没有启用的 Provider，返回 null
   */
  getActiveProvider(): LLMProvider | null {
    try {
      const configs = queries.getAllProviderConfigs()
      const enabledConfig = configs.find((c) => c.enabled)

      if (!enabledConfig) {
        console.warn('[ProviderManager] 未找到启用的 Provider')
        return null
      }

      const provider = this.providers.get(enabledConfig.providerName)
      if (!provider) {
        console.error(`[ProviderManager] Provider "${enabledConfig.providerName}" 未注册`)
        return null
      }

      // 配置 Provider
      provider.configure(enabledConfig.config)

      console.log(`[ProviderManager] 使用 Provider: ${provider.name}`)
      return provider
    } catch (error) {
      console.error('[ProviderManager] 获取激活 Provider 失败:', error)
      return null
    }
  }

  /**
   * 列出所有已注册的 Provider 名称
   */
  listProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}
