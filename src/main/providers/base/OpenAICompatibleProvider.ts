/**
 * OpenAI Compatible Provider
 * 基于组合模式的统一 Provider 实现
 * 支持所有 OpenAI 兼容的 API(OpenAI, DeepSeek, Qwen, Kimi, SiliconFlow 等)
 */

import type { BaseProvider, LLMProviderConfig } from '../capabilities/BaseProvider'
import type { ChatCapability } from '../capabilities/ChatCapability'
import type { EmbeddingCapability } from '../capabilities/EmbeddingCapability'
import type { APIMessage, StreamChunk } from '../../../shared/types/chat'
import type { EmbeddingConfig, EmbeddingResult } from '../capabilities/EmbeddingCapability'
import type { ProviderDescriptor } from '../registry/ProviderDescriptor'
import { OpenAIChatHandler } from '../handlers/OpenAIChatHandler'
import { OpenAIEmbeddingHandler } from '../handlers/OpenAIEmbeddingHandler'
import Logger from '../../../shared/utils/logger'

/**
 * OpenAICompatibleProvider
 * 统一的 OpenAI 兼容 Provider 实现
 * 根据 ProviderDescriptor 的能力配置动态组合功能
 */
export class OpenAICompatibleProvider implements BaseProvider {
  readonly name: string
  private descriptor: ProviderDescriptor
  protected config: LLMProviderConfig

  // 能力 Handler(根据 descriptor.capabilities 初始化)
  private chatHandler?: OpenAIChatHandler
  private embeddingHandler?: OpenAIEmbeddingHandler

  constructor(descriptor: ProviderDescriptor) {
    this.name = descriptor.name
    this.descriptor = descriptor

    // 初始化默认配置
    this.config = {
      baseUrl: descriptor.defaultBaseUrl,
      model: descriptor.defaultChatModel || descriptor.defaultEmbeddingModel,
      temperature: 0.7,
      maxTokens: 2048
    }

    // 根据能力初始化对应的 handler
    if (descriptor.capabilities.chat) {
      this.chatHandler = new OpenAIChatHandler(this.name, this.config)
      Logger.debug('OpenAICompatibleProvider', `Initialized chat handler for ${this.name}`)
    }

    if (descriptor.capabilities.embedding) {
      this.embeddingHandler = new OpenAIEmbeddingHandler(this.name, this.config)
      Logger.debug('OpenAICompatibleProvider', `Initialized embedding handler for ${this.name}`)
    }

    Logger.info('OpenAICompatibleProvider', `Provider ${this.name} initialized`)
  }

  /**
   * 配置 Provider
   */
  configure(config: LLMProviderConfig): void {
    this.config = { ...this.config, ...config }

    // 更新 handlers 的配置
    this.chatHandler?.updateConfig(this.config)
    this.embeddingHandler?.updateConfig(this.config)

    Logger.debug('OpenAICompatibleProvider', `Provider ${this.name} configured`)
  }

  /**
   * 验证配置是否有效
   */
  async validateConfig(config: LLMProviderConfig): Promise<boolean> {
    try {
      const response = await fetch(`${config.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  // ==================== 能力检查方法 ====================

  /**
   * 检查是否支持对话能力
   * TypeScript 类型守卫
   */
  hasChatCapability(): this is BaseProvider & ChatCapability {
    return this.chatHandler !== undefined
  }

  /**
   * 检查是否支持嵌入能力
   * TypeScript 类型守卫
   */
  hasEmbeddingCapability(): this is BaseProvider & EmbeddingCapability {
    return this.embeddingHandler !== undefined
  }

  // ==================== 对话能力方法 ====================

  /**
   * 流式发送消息
   * 如果不支持对话能力会抛出错误
   */
  async sendMessageStream(
    messages: APIMessage[],
    onChunk: (chunk: StreamChunk) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<AbortController> {
    if (!this.chatHandler) {
      const error = new Error(`Provider ${this.name} does not support chat capability`)
      onError(error)
      const abortController = new AbortController()
      abortController.abort()
      return abortController
    }

    return this.chatHandler.sendMessageStream(messages, onChunk, onError, onComplete)
  }

  /**
   * 获取默认对话模型
   */
  getDefaultChatModel(): string {
    if (!this.chatHandler) {
      throw new Error(`Provider ${this.name} does not support chat capability`)
    }
    return this.descriptor.defaultChatModel || this.chatHandler.getDefaultChatModel()
  }

  // ==================== 嵌入能力方法 ====================

  /**
   * 生成单个文本的 Embedding
   * 如果不支持嵌入能力会抛出错误
   */
  async createEmbedding(text: string, config?: EmbeddingConfig): Promise<EmbeddingResult> {
    if (!this.embeddingHandler) {
      throw new Error(`Provider ${this.name} does not support embedding capability`)
    }

    return this.embeddingHandler.createEmbedding(text, config)
  }

  /**
   * 批量生成 Embedding
   * 如果不支持嵌入能力会抛出错误
   */
  async createEmbeddings(texts: string[], config?: EmbeddingConfig): Promise<EmbeddingResult[]> {
    if (!this.embeddingHandler) {
      throw new Error(`Provider ${this.name} does not support embedding capability`)
    }

    return this.embeddingHandler.createEmbeddings(texts, config)
  }

  /**
   * 获取默认 Embedding 模型
   */
  getDefaultEmbeddingModel(): string {
    if (!this.embeddingHandler) {
      throw new Error(`Provider ${this.name} does not support embedding capability`)
    }
    return this.descriptor.defaultEmbeddingModel || this.embeddingHandler.getDefaultEmbeddingModel()
  }

  // ==================== 向后兼容方法(已废弃) ====================

  /**
   * @deprecated 使用 hasChatCapability() 或 hasEmbeddingCapability() 替代
   * 检查是否支持 Embedding
   */
  supportsEmbedding(): boolean {
    return this.hasEmbeddingCapability()
  }
}
