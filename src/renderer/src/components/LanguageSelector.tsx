import { useTranslation } from '../lib/i18n'
import { useI18nStore } from '../store/i18nStore'
import { Language } from '../store/i18nStore'

const languages = [
  { code: 'zh-CN' as Language, name: '简体中文', nativeName: '简体中文' },
  { code: 'en-US' as Language, name: 'English', nativeName: 'English' }
]

export const LanguageSelector = ({ className = '' }: { className?: string }) => {
  const { t } = useTranslation('common')
  const { language, changeLanguage } = useI18nStore()

  const handleLanguageChange = async (newLanguage: Language) => {
    await changeLanguage(newLanguage)
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label
        htmlFor="language-select"
        className="text-sm font-medium text-foreground dark:text-foreground-dark"
      >
        {t('language', 'Language')}:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value as Language)}
        className="px-3 py-1 text-sm border border-border rounded-md bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  )
}
