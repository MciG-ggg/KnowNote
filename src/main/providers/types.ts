/**
 * AI Provider 接口定义
 * 所有 AI Provider 必须实现此接口
 */

import type { APIMessage, StreamChunk } from '../../shared/types/chat'

// 重新导出共享类型，方便其他地方使用
export type { APIMessage as ChatMessage, StreamChunk }

/**
 * Provider 配置
 */
export interface LLMProviderConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
  temperature?: number
  maxTokens?: number
  [key: string]: any
}

/**
 * AI Provider 接口
 */
export interface LLMProvider {
  /**
   * Provider 名称
   */
  readonly name: string

  /**
   * 配置 Provider
   * @param config - Provider 配置项
   */
  configure(config: LLMProviderConfig): void

  /**
   * 流式发送消息
   * @param messages - 聊天消息历史
   * @param onChunk - 接收到新 chunk 时的回调
   * @param onError - 发生错误时的回调
   * @param onComplete - 完成时的回调
   */
  sendMessageStream(
    messages: APIMessage[],
    onChunk: (chunk: StreamChunk) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void>

  /**
   * 验证配置是否有效（可选）
   * @param config - 需要验证的配置
   * @returns Promise<boolean> - 配置是否有效
   */
  validateConfig?(config: LLMProviderConfig): Promise<boolean>
}
