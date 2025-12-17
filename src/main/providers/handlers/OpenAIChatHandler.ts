/**
 * OpenAI Chat Handler
 * 处理 OpenAI 兼容 API 的对话功能
 */

import type { APIMessage, StreamChunk } from '../../../shared/types/chat'
import type { LLMProviderConfig } from '../capabilities/BaseProvider'
import Logger from '../../../shared/utils/logger'

/**
 * OpenAIChatHandler
 * 实现 OpenAI 兼容 API 的流式对话功能
 */
export class OpenAIChatHandler {
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
   * 获取配置的对话模型
   */
  getDefaultChatModel(): string {
    if (!this.config.model) {
      throw new Error(`${this.providerName} chat model not configured`)
    }
    return this.config.model
  }

  /**
   * 流式发送消息
   */
  async sendMessageStream(
    messages: APIMessage[],
    onChunk: (chunk: StreamChunk) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<AbortController> {
    const { apiKey, baseUrl, model, temperature, maxTokens } = this.config

    // 创建 AbortController
    const abortController = new AbortController()

    if (!apiKey) {
      onError(new Error(`${this.providerName} API Key not configured`))
      abortController.abort()
      return abortController
    }

    if (!model) {
      onError(new Error(`${this.providerName} chat model not configured`))
      abortController.abort()
      return abortController
    }

    // 异步执行流读取,不阻塞返回
    ;(async () => {
      try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream: true
          }),
          signal: abortController.signal // 关键: 传递 abort signal
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`${this.providerName} API Error: ${response.status} - ${errorText}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('Unable to read response stream')
        }

        const decoder = new TextDecoder()
        let buffer = ''
        let hasReceivedReasoning = false // Track if reasoning content has been received
        let reasoningComplete = false // Track if reasoning is complete

        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          // Decode bytes to text and append to buffer
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')

          // Keep the last incomplete line
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()

            // Skip empty lines and comments
            if (!trimmed || trimmed === 'data: [DONE]') continue

            // Parse SSE data
            if (trimmed.startsWith('data: ')) {
              try {
                const json = JSON.parse(trimmed.slice(6))
                const delta = json.choices?.[0]?.delta
                const finishReason = json.choices?.[0]?.finish_reason

                // Track reasoning content status
                if (delta?.reasoning_content) {
                  hasReceivedReasoning = true
                } else if (hasReceivedReasoning && !reasoningComplete) {
                  // Had reasoning content before, now none, means reasoning phase is over
                  reasoningComplete = true
                }

                // Send content chunk (including reasoning content)
                if (delta?.content || delta?.reasoning_content) {
                  onChunk({
                    content: delta.content || '',
                    reasoningContent: delta.reasoning_content,
                    done: false,
                    reasoningDone: reasoningComplete
                  })
                }

                // Completion marker
                if (finishReason) {
                  onChunk({
                    content: '',
                    reasoningContent: undefined,
                    done: true,
                    reasoningDone: true,
                    metadata: {
                      model: json.model,
                      finishReason,
                      usage: json.usage
                        ? {
                            promptTokens: json.usage.prompt_tokens,
                            completionTokens: json.usage.completion_tokens,
                            totalTokens: json.usage.total_tokens
                          }
                        : undefined
                    }
                  })
                }
              } catch (e) {
                Logger.error(`${this.providerName}ChatHandler`, 'Failed to parse SSE data:', e)
              }
            }
          }
        }

        onComplete()
      } catch (error: any) {
        // 区分 AbortError 和其他错误
        if (error.name === 'AbortError') {
          Logger.info(`${this.providerName}ChatHandler`, 'Stream aborted by user')
          // 用户中断时仍然调用 onComplete,确保流程完整
          onComplete()
        } else {
          onError(error)
        }
      }
    })()

    // 立即返回 AbortController
    return abortController
  }
}
