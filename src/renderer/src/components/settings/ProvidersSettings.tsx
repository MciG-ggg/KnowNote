import { useState, useEffect, ReactElement } from 'react'

interface LLMConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export default function ProvidersSettings(): ReactElement {
  const [activeProvider, setActiveProvider] = useState<string>('openai')
  const [openaiConfig, setOpenaiConfig] = useState<LLMConfig>({
    apiKey: '',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048
  })
  const [ollamaConfig, setOllamaConfig] = useState<LLMConfig>({
    baseUrl: 'http://localhost:11434',
    model: 'llama2',
    temperature: 0.7
  })
  const [openaiEnabled, setOpenaiEnabled] = useState(false)
  const [ollamaEnabled, setOllamaEnabled] = useState(false)
  const [validating, setValidating] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  // 加载配置
  useEffect(() => {
    loadConfigs()
  }, [])

  const loadConfigs = async (): Promise<void> => {
    try {
      const openai = await window.api.getProviderConfig('openai')
      if (openai) {
        setOpenaiConfig(openai.config)
        setOpenaiEnabled(openai.enabled)
      }

      const ollama = await window.api.getProviderConfig('ollama')
      if (ollama) {
        setOllamaConfig(ollama.config)
        setOllamaEnabled(ollama.enabled)
      }
    } catch (error) {
      console.error('Failed to load provider configs:', error)
    }
  }

  // 保存配置
  const handleSave = async (providerName: string): Promise<void> => {
    setSaveStatus('saving')
    try {
      const config = providerName === 'openai' ? openaiConfig : ollamaConfig
      const enabled = providerName === 'openai' ? openaiEnabled : ollamaEnabled

      await window.api.saveProviderConfig({
        providerName,
        config,
        enabled,
        updatedAt: Date.now()
      })

      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Failed to save config:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  // 验证配置
  const handleValidate = async (providerName: string): Promise<void> => {
    setValidating(true)
    try {
      const config = providerName === 'openai' ? openaiConfig : ollamaConfig
      const isValid = await window.api.validateProviderConfig(providerName, config)

      if (isValid) {
        alert('配置验证成功!')
      } else {
        alert('配置验证失败,请检查配置是否正确')
      }
    } catch (error) {
      alert('配置验证失败: ' + (error as Error).message)
    } finally {
      setValidating(false)
    }
  }

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      icon: '🤖',
      color: 'from-green-400 to-green-600',
      enabled: openaiEnabled
    },
    {
      id: 'ollama',
      name: 'Ollama',
      icon: '🦙',
      color: 'from-purple-400 to-purple-600',
      enabled: ollamaEnabled
    }
  ]

  return (
    <div className="flex h-full">
      {/* 左侧供应商列表 */}
      <div className="w-48 min-w-[12rem] border-r border-gray-800/50 p-4 pt-16">
        <h3 className="text-sm font-medium text-gray-300 mb-4">AI 供应商</h3>
        <div className="space-y-2">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setActiveProvider(provider.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeProvider === provider.id
                  ? 'bg-[#2a2a2a] text-gray-100'
                  : 'bg-[#171717] hover:bg-[#2a2a2a] text-gray-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${provider.color} ${
                  provider.enabled ? '' : 'opacity-50'
                }`}
              >
                <span className="text-white font-bold text-sm">{provider.icon}</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-100">{provider.name}</div>
                <div className="text-xs text-gray-400">
                  {provider.enabled ? '已启用' : '未启用'}
                </div>
              </div>
              {provider.enabled && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* 右侧配置区域 */}
      <div className="flex-1 min-w-[400px] overflow-y-auto p-6 pt-16">
        {activeProvider === 'openai' && (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-100">OpenAI 配置</h3>
              <button
                onClick={() => handleSave('openai')}
                disabled={saveStatus === 'saving'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saveStatus === 'saving'
                  ? '保存中...'
                  : saveStatus === 'success'
                    ? '已保存'
                    : '保存配置'}
              </button>
            </div>

            <div className="space-y-4">
              {/* 启用开关 */}
              <div className="p-4 bg-[#171717] rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-100">启用 OpenAI</h4>
                    <p className="text-xs text-gray-400 mt-1">启用后可使用 OpenAI 服务</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={openaiEnabled}
                      onChange={(e) => setOpenaiEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* API Key */}
              <div className="p-4 bg-[#171717] rounded-xl">
                <h4 className="text-sm font-medium mb-3 text-gray-100">API 密钥</h4>
                <div className="p-3 bg-[#0a0a0a] rounded-lg border border-gray-700">
                  <input
                    type="password"
                    value={openaiConfig.apiKey}
                    onChange={(e) => setOpenaiConfig({ ...openaiConfig, apiKey: e.target.value })}
                    placeholder="sk-..."
                    className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={() => handleValidate('openai')}
                  disabled={validating}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >
                  {validating ? '验证中...' : '验证密钥'}
                </button>
              </div>

              {/* Base URL */}
              <div className="p-4 bg-[#171717] rounded-xl">
                <h4 className="text-sm font-medium mb-3 text-gray-100">Base URL</h4>
                <div className="p-3 bg-[#0a0a0a] rounded-lg border border-gray-700">
                  <input
                    type="text"
                    value={openaiConfig.baseUrl}
                    onChange={(e) => setOpenaiConfig({ ...openaiConfig, baseUrl: e.target.value })}
                    placeholder="https://api.openai.com/v1"
                    className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-500"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">支持兼容 OpenAI API 格式的服务</p>
              </div>

              {/* 模型设置 */}
              <div className="p-4 bg-[#171717] rounded-xl">
                <h4 className="text-sm font-medium mb-3 text-gray-100">模型设置</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">默认模型</label>
                    <input
                      type="text"
                      value={openaiConfig.model}
                      onChange={(e) => setOpenaiConfig({ ...openaiConfig, model: e.target.value })}
                      className="w-full p-2 bg-[#0a0a0a] rounded-lg text-sm border border-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">温度 (0.0-2.0)</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={openaiConfig.temperature}
                      onChange={(e) =>
                        setOpenaiConfig({
                          ...openaiConfig,
                          temperature: parseFloat(e.target.value)
                        })
                      }
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      当前: {openaiConfig.temperature}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">最大令牌数</label>
                    <input
                      type="number"
                      min="1"
                      max="128000"
                      value={openaiConfig.maxTokens}
                      onChange={(e) =>
                        setOpenaiConfig({ ...openaiConfig, maxTokens: parseInt(e.target.value) })
                      }
                      className="w-full p-2 bg-[#0a0a0a] rounded-lg text-sm border border-gray-700 text-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeProvider === 'ollama' && (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-100">Ollama 配置</h3>
              <button
                onClick={() => handleSave('ollama')}
                disabled={saveStatus === 'saving'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saveStatus === 'saving'
                  ? '保存中...'
                  : saveStatus === 'success'
                    ? '已保存'
                    : '保存配置'}
              </button>
            </div>

            <div className="space-y-4">
              {/* 启用开关 */}
              <div className="p-4 bg-[#171717] rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-100">启用 Ollama</h4>
                    <p className="text-xs text-gray-400 mt-1">启用后可使用本地 Ollama 服务</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ollamaEnabled}
                      onChange={(e) => setOllamaEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Base URL */}
              <div className="p-4 bg-[#171717] rounded-xl">
                <h4 className="text-sm font-medium mb-3 text-gray-100">Base URL</h4>
                <div className="p-3 bg-[#0a0a0a] rounded-lg border border-gray-700">
                  <input
                    type="text"
                    value={ollamaConfig.baseUrl}
                    onChange={(e) => setOllamaConfig({ ...ollamaConfig, baseUrl: e.target.value })}
                    placeholder="http://localhost:11434"
                    className="w-full bg-transparent outline-none text-gray-100 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={() => handleValidate('ollama')}
                  disabled={validating}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >
                  {validating ? '验证中...' : '验证连接'}
                </button>
              </div>

              {/* 模型设置 */}
              <div className="p-4 bg-[#171717] rounded-xl">
                <h4 className="text-sm font-medium mb-3 text-gray-100">模型设置</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">默认模型</label>
                    <input
                      type="text"
                      value={ollamaConfig.model}
                      onChange={(e) => setOllamaConfig({ ...ollamaConfig, model: e.target.value })}
                      placeholder="llama2"
                      className="w-full p-2 bg-[#0a0a0a] rounded-lg text-sm border border-gray-700 text-gray-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      请确保已使用 ollama pull 下载该模型
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">温度 (0.0-2.0)</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={ollamaConfig.temperature}
                      onChange={(e) =>
                        setOllamaConfig({
                          ...ollamaConfig,
                          temperature: parseFloat(e.target.value)
                        })
                      }
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      当前: {ollamaConfig.temperature}
                    </div>
                  </div>
                </div>
              </div>

              {/* 提示信息 */}
              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-400/20">
                <h4 className="text-sm font-medium mb-2 text-gray-100">关于 Ollama</h4>
                <p className="text-sm text-gray-300 mb-2">
                  Ollama 是一个在本地运行大语言模型的工具,无需 API Key。
                </p>
                <p className="text-xs text-gray-400">
                  安装:{' '}
                  <code className="bg-[#0a0a0a] px-2 py-0.5 rounded">brew install ollama</code>
                  <br />
                  下载模型:{' '}
                  <code className="bg-[#0a0a0a] px-2 py-0.5 rounded">ollama pull llama2</code>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
