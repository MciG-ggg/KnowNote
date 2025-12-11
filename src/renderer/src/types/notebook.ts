export interface Notebook {
  id: string
  title: string
  description?: string
  coverColor: string // 卡片顶部装饰条颜色
  createdAt: Date
  updatedAt: Date
  chatCount: number // 对话数量
}

/**
 * 聊天会话接口
 */
export interface ChatSession {
  id: string
  notebookId: string
  title: string
  createdAt: number
  updatedAt: number
}

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  id: string
  sessionId: string
  notebookId?: string // 新增：用于并发消息管理
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata?: any
  createdAt: number
  isStreaming?: boolean // 前端扩展字段，标识流式消息
}
