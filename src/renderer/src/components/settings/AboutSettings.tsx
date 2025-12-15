import { ChevronRight } from 'lucide-react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import logoImg from '../../assets/logo.png'

export default function AboutSettings(): ReactElement {
  const { t } = useTranslation('settings')

  const handleOpenWebsite = () => {
    window.open('https://your-website.com', '_blank')
  }

  const handleFeedback = () => {
    window.open('https://github.com/your-repo/issues', '_blank')
  }

  const handleCheckUpdates = async () => {
    // TODO: 实现检查更新逻辑
    console.log('Check for updates')
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-8 flex flex-col items-center gap-4">
        <img src={logoImg} alt="Logo" className="w-16 h-16 rounded-xl" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-foreground">KnowNote</h2>
          <p className="text-sm text-muted-foreground">{t('version')}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleOpenWebsite}
          className="flex justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors cursor-pointer"
        >
          <span className="text-sm text-muted-foreground">{t('officialWebsite')}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={handleFeedback}
          className="flex justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors cursor-pointer"
        >
          <span className="text-sm text-muted-foreground">{t('feedback')}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={handleCheckUpdates}
          className="flex justify-between p-3 bg-card rounded-lg hover:bg-accent transition-colors cursor-pointer"
        >
          <span className="text-sm text-muted-foreground">{t('checkUpdates')}</span>
          <span className="text-xs text-muted-foreground">{t('latestVersion')}</span>
        </button>
      </div>
    </div>
  )
}
