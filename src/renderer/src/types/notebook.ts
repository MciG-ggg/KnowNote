/**
 * Notebook 相关类型定义
 */

// 从shared导入统一的聊天类型
export type { ChatSession, ChatMessage } from '../../../shared/types/chat'

export interface Notebook {
  id: string
  title: string
  description?: string
  coverColor: string // 卡片顶部装饰条颜色
  createdAt: Date
  updatedAt: Date
  chatCount: number // 对话数量
}
