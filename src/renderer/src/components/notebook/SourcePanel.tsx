import { Database } from 'lucide-react'
import { ReactElement } from 'react'

export default function SourcePanel(): ReactElement {
  return (
    <div className="flex flex-col bg-card rounded-xl overflow-hidden h-full">
      {/* RAG 占位界面 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-muted-foreground">
        <Database className="w-16 h-16 opacity-20 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">知识库管理</h3>
        <p className="text-sm text-center text-muted-foreground max-w-xs">
          此区域将用于管理文档、检索知识库，为对话提供背景信息。
        </p>
      </div>
    </div>
  )
}
