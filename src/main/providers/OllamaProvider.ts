import type { LLMProvider, ChatMessage, StreamChunk, LLMProviderConfig } from './types'

/**
 * Ollama Provider 实现
 * 用于本地运行的 Ollama 服务
 */
export class OllamaProvider implements LLMProvider {
  readonly name = 'ollama'

  private config: LLMProviderConfig = {
    baseUrl: 'http://localhost:11434',
    model: 'llama2',
    temperature: 0.7
  }

  configure(config: LLMProviderConfig): void {
    this.config = { ...this.config, ...config }
  }

  async sendMessageStream(
    messages: ChatMessage[],
    onChunk: (chunk: StreamChunk) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> {
    const { baseUrl, model, temperature } = this.config

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          options: {
            temperature
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Ollama API Error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法读取响应流')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n').filter((line) => line.trim())

        for (const line of lines) {
          try {
            const json = JSON.parse(line)

            // 发送内容片段
            if (json.message?.content) {
              onChunk({
                content: json.message.content,
                done: json.done || false
              })
            }

            // 完成标志
            if (json.done) {
              onChunk({
                content: '',
                done: true,
                metadata: {
                  model: json.model,
                  finishReason: json.done_reason
                }
              })
            }
          } catch (e) {
            console.error('[OllamaProvider] 解析响应失败:', e)
          }
        }
      }

      onComplete()
    } catch (error) {
      onError(error as Error)
    }
  }

  /**
   * 验证 Ollama 服务是否可用
   */
  async validateConfig(config: LLMProviderConfig): Promise<boolean> {
    try {
      const response = await fetch(`${config.baseUrl}/api/tags`)
      return response.ok
    } catch {
      return false
    }
  }
}
