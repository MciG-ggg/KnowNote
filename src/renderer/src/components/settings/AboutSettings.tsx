import { Settings, ChevronRight } from 'lucide-react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function AboutSettings(): ReactElement {
  const { t } = useTranslation('settings')
  return (
    <div className="space-y-6">
      <div className="text-center py-8 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-chart-5 rounded-xl flex items-center justify-center">
          <Settings className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-foreground">KnowNote</h2>
          <p className="text-sm text-muted-foreground">{t('version')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between p-3 bg-card rounded-lg">
          <span className="text-sm text-muted-foreground">{t('changelog')}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex justify-between p-3 bg-card rounded-lg">
          <span className="text-sm text-muted-foreground">{t('userManual')}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex justify-between p-3 bg-card rounded-lg">
          <span className="text-sm text-muted-foreground">{t('feedback')}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex justify-between p-3 bg-card rounded-lg">
          <span className="text-sm text-muted-foreground">{t('checkUpdates')}</span>
          <span className="text-xs text-muted-foreground">{t('latestVersion')}</span>
        </div>
      </div>
    </div>
  )
}
