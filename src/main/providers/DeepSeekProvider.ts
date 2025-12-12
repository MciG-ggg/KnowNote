import { OpenAICompatibleProvider } from './base/OpenAICompatibleProvider'

/**
 * DeepSeek Provider 实现
 * DeepSeek API 兼容 OpenAI API 格式
 * 继承自 OpenAICompatibleProvider，只需定义特定的配置参数
 */
export class DeepSeekProvider extends OpenAICompatibleProvider {
  readonly name = 'deepseek'

  protected getDefaultBaseUrl(): string {
    return 'https://api.deepseek.com/v1'
  }

  protected getDefaultModel(): string {
    return 'deepseek-chat'
  }
}
