import { ReactElement } from 'react'
import { Check, X } from 'lucide-react'

interface SettingsActionBarProps {
  hasChanges: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function SettingsActionBar({
  hasChanges,
  onCancel,
  onConfirm
}: SettingsActionBarProps): ReactElement {
  return (
    <div className="bg-card rounded-xl p-4 flex-shrink-0">
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasChanges
              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer'
              : 'bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed'
          }`}
        >
          <X className="w-4 h-4" />
          <span className="text-sm font-medium">取消</span>
        </button>
        <button
          onClick={onConfirm}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            hasChanges
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm'
              : 'bg-primary/50 text-primary-foreground/50 cursor-not-allowed'
          }`}
        >
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">保存</span>
        </button>
      </div>
    </div>
  )
}
