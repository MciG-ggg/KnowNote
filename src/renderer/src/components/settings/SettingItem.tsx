import { ReactElement, ReactNode } from 'react'

interface SettingItemProps {
  title: string
  description: string
  children: ReactNode
  layout?: 'horizontal' | 'vertical' // 默认 horizontal（左右布局）
}

export default function SettingItem({
  title,
  description,
  children,
  layout = 'horizontal'
}: SettingItemProps): ReactElement {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      {layout === 'horizontal' ? (
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex-shrink-0">{children}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div>{children}</div>
        </div>
      )}
    </div>
  )
}
