import { OpenAICompatibleProvider } from './base/OpenAICompatibleProvider'

/**
 * Qwen (通义千问) Provider Implementation
 * 兼容阿里云百炼平台和其他Qwen API服务
 *
 * 使用说明:
 * 1. API Base URL: 需要配置DashScope或其他Qwen API服务地址
 *    - DashScope: https://dashscope.aliyuncs.com/compatible-mode/v1
 *    - 其他兼容服务: 根据具体服务提供商配置
 * 2. API Key: 需要在阿里云百炼平台申请API Key
 * 3. 默认模型: qwen-max (可根据需要更换为其他模型如qwen-plus, qwen-turbo等)
 */
export class QwenProvider extends OpenAICompatibleProvider {
  readonly name = 'qwen'

  protected getDefaultBaseUrl(): string {
    // DashScope兼容模式API地址
    return 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  }

  protected getDefaultModel(): string {
    // 默认使用qwen-max模型
    return 'qwen-max'
  }

  /**
   * 获取默认 Embedding 模型
   * Qwen使用text-embedding-v2作为默认embedding模型
   */
  getDefaultEmbeddingModel(): string {
    return 'text-embedding-v2'
  }
}
