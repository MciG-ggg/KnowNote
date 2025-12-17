/**
 * OpenAI Embedding Handler
 * 处理 OpenAI 兼容 API 的嵌入功能
 */

import type { LLMProviderConfig } from '../capabilities/BaseProvider'
import type { EmbeddingConfig, EmbeddingResult } from '../capabilities/EmbeddingCapability'
import Logger from '../../../shared/utils/logger'

/**
 * OpenAIEmbeddingHandler
 * 实现 OpenAI 兼容 API 的嵌入向量生成功能
 */
export class OpenAIEmbeddingHandler {
  private providerName: string
  private config: LLMProviderConfig

  constructor(providerName: string, config: LLMProviderConfig) {
    this.providerName = providerName
    this.config = config
  }

  /**
   * 更新配置
   */
  updateConfig(config: LLMProviderConfig): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * 获取配置的 Embedding 模型
   */
  getDefaultEmbeddingModel(): string {
    if (!this.config.model) {
      throw new Error(`${this.providerName} embedding model not configured`)
    }
    return this.config.model
  }

  /**
   * 生成单个文本的 Embedding
   */
  async createEmbedding(text: string, config?: EmbeddingConfig): Promise<EmbeddingResult> {
    const { apiKey, baseUrl } = this.config
    // 优先级: config.model > this.config.model，不使用默认模型兜底
    const model = config?.model || this.config.model

    if (!model) {
      throw new Error(`${this.providerName} embedding model not configured`)
    }

    Logger.info(
      `${this.providerName}EmbeddingHandler`,
      `Creating embedding with model: ${model} (config.model=${config?.model}, this.config.model=${this.config.model})`
    )

    if (!apiKey) {
      throw new Error(`${this.providerName} API Key not configured`)
    }

    try {
      const requestBody: Record<string, unknown> = {
        model,
        input: text
      }

      // 部分模型支持指定维度
      if (config?.dimensions) {
        requestBody.dimensions = config.dimensions
      }

      const response = await fetch(`${baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `${this.providerName} Embedding API Error: ${response.status} - ${errorText}`
        )
      }

      const data = await response.json()
      const embeddingData = data.data[0].embedding as number[]

      return {
        embedding: new Float32Array(embeddingData),
        model: data.model,
        dimensions: embeddingData.length,
        tokensUsed: data.usage?.total_tokens || 0
      }
    } catch (error) {
      Logger.error(`${this.providerName}EmbeddingHandler`, 'Failed to create embedding:', error)
      throw error
    }
  }

  /**
   * 批量生成 Embedding
   */
  async createEmbeddings(texts: string[], config?: EmbeddingConfig): Promise<EmbeddingResult[]> {
    const { apiKey, baseUrl } = this.config
    // 优先级: config.model > this.config.model，不使用默认模型兜底
    const model = config?.model || this.config.model

    if (!model) {
      throw new Error(`${this.providerName} embedding model not configured`)
    }

    if (!apiKey) {
      throw new Error(`${this.providerName} API Key not configured`)
    }

    if (texts.length === 0) {
      return []
    }

    try {
      const requestBody: Record<string, unknown> = {
        model,
        input: texts
      }

      // 部分模型支持指定维度
      if (config?.dimensions) {
        requestBody.dimensions = config.dimensions
      }

      const response = await fetch(`${baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `${this.providerName} Embedding API Error: ${response.status} - ${errorText}`
        )
      }

      const data = await response.json()
      const tokensPerText = Math.ceil((data.usage?.total_tokens || 0) / texts.length)

      return data.data.map((item: { embedding: number[]; index: number }) => ({
        embedding: new Float32Array(item.embedding),
        model: data.model,
        dimensions: item.embedding.length,
        tokensUsed: tokensPerText
      }))
    } catch (error) {
      Logger.error(`${this.providerName}EmbeddingHandler`, 'Failed to create embeddings:', error)
      throw error
    }
  }
}
