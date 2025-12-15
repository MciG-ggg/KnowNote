import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { Button } from '../ui/button'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  notebookTitle: string
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmDialog({
  isOpen,
  notebookTitle,
  onClose,
  onConfirm
}: DeleteConfirmDialogProps): ReactElement {
  const { t } = useTranslation(['common', 'notebook'])

  const handleConfirm = (): void => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('notebook:deleteNotebook')}</DialogTitle>
          <DialogDescription>
            {t('notebook:deleteConfirm', { name: notebookTitle })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('common:cancel')}
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            {t('common:delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
