import { OpenAICompatibleProvider } from './base/OpenAICompatibleProvider'

/**
 * OpenAI Provider 实现
 * 继承自 OpenAICompatibleProvider，只需定义特定的配置参数
 */
export class OpenAIProvider extends OpenAICompatibleProvider {
  readonly name = 'openai'

  protected getDefaultBaseUrl(): string {
    return 'https://api.openai.com/v1'
  }

  protected getDefaultModel(): string {
    return 'gpt-4'
  }
}
