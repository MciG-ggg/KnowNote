import { ReactElement } from 'react'

export interface NotePanelProps {
  title?: string
}

export default function NotePanel({ title = 'Note' }: NotePanelProps): ReactElement {
  return (
    <div className="flex flex-col bg-card rounded-xl overflow-hidden h-full">
      {/* 顶部拖拽区域 */}
      <div
        className="h-14 flex items-center justify-center border-b border-border/50"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <span className="text-sm text-foreground">{title}</span>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">笔记内容</p>
          </div>
        </div>
      </div>
    </div>
  )
}
