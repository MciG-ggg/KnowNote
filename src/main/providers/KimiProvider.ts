import { OpenAICompatibleProvider } from './base/OpenAICompatibleProvider'

/**
 * Kimi Provider Implementation
 * 月之暗面(Moonshot AI)的Kimi大模型
 *
 * 使用说明:
 * 1. API Base URL: https://api.moonshot.cn/v1
 * 2. API Key: 需要在 https://platform.moonshot.cn 申请
 * 3. 支持的模型:
 *    - kimi-k2-turbo-preview: K2系列turbo版本,快速响应
 *    - kimi-k2-0905-preview: K2 0905版本
 *    - kimi-k2-thinking-turbo: 带思考链的turbo版本
 *    - kimi-k2-thinking: 深度思考模型
 * 4. 特性:
 *    - 支持超长上下文(128K tokens)
 *    - 支持流式输出
 *    - 部分模型支持思考链(reasoning_content)
 */
export class KimiProvider extends OpenAICompatibleProvider {
  readonly name = 'kimi'

  protected getDefaultBaseUrl(): string {
    return 'https://api.moonshot.cn/v1'
  }

  protected getDefaultModel(): string {
    // 默认使用kimi-k2-turbo-preview模型
    return 'kimi-k2-turbo-preview'
  }

  /**
   * Kimi目前不支持Embedding API
   */
  supportsEmbedding(): boolean {
    return false
  }

  /**
   * Kimi不支持Embedding,抛出错误
   */
  getDefaultEmbeddingModel(): string {
    throw new Error('Kimi Provider does not support embedding')
  }
}
