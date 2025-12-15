import { ReactElement } from 'react'
import { Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'

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
  const { t } = useTranslation('common')
  return (
    <div className="bg-card rounded-xl p-4 flex-shrink-0 shadow-md">
      <div className="flex items-center justify-end gap-3">
        <Button onClick={onCancel} disabled={!hasChanges} variant="outline">
          <X className="w-4 h-4" />
          <span className="text-sm font-medium">{t('cancel')}</span>
        </Button>
        <Button onClick={onConfirm} disabled={!hasChanges} variant="default">
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">{t('save')}</span>
        </Button>
      </div>
    </div>
  )
}
