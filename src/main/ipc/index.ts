import { ProviderManager } from '../providers/ProviderManager'
import { SessionAutoSwitchService } from '../services/SessionAutoSwitchService'
import { registerChatHandlers } from './chatHandlers'
import { registerProviderHandlers } from './providerHandlers'

/**
 * 注册所有 IPC Handlers
 */
export function registerAllHandlers(
  providerManager: ProviderManager,
  sessionAutoSwitchService: SessionAutoSwitchService
) {
  registerChatHandlers(providerManager, sessionAutoSwitchService)
  registerProviderHandlers(providerManager)
}

export { registerChatHandlers, registerProviderHandlers }
