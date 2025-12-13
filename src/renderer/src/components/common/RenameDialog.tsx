import { useState, useEffect, useRef, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'

interface RenameDialogProps {
  isOpen: boolean
  currentTitle: string
  onClose: () => void
  onConfirm: (newTitle: string) => void
}

export default function RenameDialog({
  isOpen,
  currentTitle,
  onClose,
  onConfirm
}: RenameDialogProps): ReactElement | null {
  const { t } = useTranslation(['common', 'notebook'])
  const [title, setTitle] = useState(currentTitle)
  const inputRef = useRef<HTMLInputElement>(null)

  // 同步 currentTitle 变化
  useEffect(() => {
    setTitle(currentTitle)
  }, [currentTitle])

  // 自动聚焦并选中文本
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // 使用 setTimeout 确保 Dialog 动画完成后再聚焦
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 50)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (trimmedTitle && trimmedTitle !== currentTitle) {
      onConfirm(trimmedTitle)
      onClose()
    }
  }

  // 判断是否可以提交
  const canSubmit = title.trim() && title.trim() !== currentTitle

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{t('notebook:renameNotebook')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring transition-colors placeholder-muted-foreground"
            placeholder={t('notebook:enterNotebookName')}
          />

          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors text-secondary-foreground text-sm font-medium"
            >
              {t('common:cancel')}
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-secondary disabled:cursor-not-allowed disabled:text-muted-foreground rounded-lg transition-colors text-primary-foreground text-sm font-medium"
            >
              {t('common:confirm')}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
