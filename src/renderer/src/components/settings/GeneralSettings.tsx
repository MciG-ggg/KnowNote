import { ReactElement, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

interface AppSettings {
  theme: 'light' | 'dark'
  language: 'zh-CN' | 'en-US' | 'ja-JP'
  autoLaunch: boolean
}

interface GeneralSettingsProps {
  settings: AppSettings
  onSettingsChange: (updates: Partial<AppSettings>) => void
}

export default function GeneralSettings({
  settings,
  onSettingsChange
}: GeneralSettingsProps): ReactElement {
  // 当主题变化时，立即更新 DOM 以预览效果
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.theme])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium mb-3 text-foreground">外观设置</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="text-sm font-medium text-foreground">主题模式</div>
              <div className="text-xs text-muted-foreground">选择应用的外观主题</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSettingsChange({ theme: 'light' })}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  settings.theme === 'light'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-sm">浅色</span>
              </button>
              <button
                onClick={() => onSettingsChange({ theme: 'dark' })}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  settings.theme === 'dark'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent text-accent-foreground hover:bg-accent/80'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-sm">深色</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium mb-3 text-foreground">启动设置</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="text-sm font-medium text-foreground">开机自启动</div>
              <div className="text-xs text-muted-foreground">系统启动时自动运行应用</div>
            </div>
            <button
              onClick={() => onSettingsChange({ autoLaunch: !settings.autoLaunch })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                settings.autoLaunch ? 'bg-primary' : 'bg-muted-foreground'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  settings.autoLaunch ? 'translate-x-5' : 'translate-x-1'
                }`}
              ></span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium mb-3 text-foreground">语言设置</h3>
        <select
          value={settings.language}
          onChange={(e) =>
            onSettingsChange({ language: e.target.value as AppSettings['language'] })
          }
          className="w-full p-3 bg-muted rounded-lg text-sm border border-border focus:border-input outline-none text-foreground"
        >
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
        </select>
      </div>
    </div>
  )
}
