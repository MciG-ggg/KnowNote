import { Database } from 'lucide-react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

export default function SourcePanel(): ReactElement {
  const { t } = useTranslation('ui')
  return (
    <div className="flex flex-col bg-card rounded-xl overflow-hidden h-full">
      {/* RAG 占位界面 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-muted-foreground">
        <Database className="w-16 h-16 opacity-20 mb-4" />
        <h3 className="text-lg text-center font-medium text-muted-foreground mb-2">
          {t('knowledgeBase')}
        </h3>
        <p className="text-sm text-center text-muted-foreground max-w-xs">
          {t('knowledgeBaseDesc')}
        </p>
      </div>
    </div>
  )
}
