import { create } from 'zustand'
import type { Notebook } from '../types/notebook'

interface NotebookStore {
  notebooks: Notebook[]
  currentNotebook: Notebook | null
  openedNotebooks: Notebook[]

  addNotebook: (notebook: Omit<Notebook, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>
  deleteNotebook: (id: string) => void
  updateNotebook: (id: string, updates: Partial<Notebook>) => void
  setCurrentNotebook: (id: string) => void
  addOpenedNotebook: (id: string) => void
  removeOpenedNotebook: (id: string) => void
}

export const useNotebookStore = create<NotebookStore>()((set) => ({
  notebooks: [],
  currentNotebook: null,
  openedNotebooks: [],

  addNotebook: async (notebook) => {
    const newId = Date.now().toString()
    set((state) => ({
      notebooks: [
        {
          ...notebook,
          id: newId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        ...state.notebooks
      ]
    }))

    // 自动创建第一个会话
    try {
      await window.api.createChatSession(newId, '新对话')
      console.log(`[NotebookStore] 已为 notebook ${newId} 创建初始会话`)
    } catch (error) {
      console.error('[NotebookStore] 创建初始会话失败:', error)
    }

    return newId
  },

  deleteNotebook: (id) =>
    set((state) => ({
      notebooks: state.notebooks.filter((nb) => nb.id !== id)
    })),

  updateNotebook: (id, updates) =>
    set((state) => {
      const updatedNotebooks = state.notebooks.map((nb) =>
        nb.id === id ? { ...nb, ...updates, updatedAt: new Date() } : nb
      )
      // 同时更新 openedNotebooks 和 currentNotebook
      const updatedOpenedNotebooks = state.openedNotebooks.map((nb) =>
        nb.id === id ? { ...nb, ...updates, updatedAt: new Date() } : nb
      )
      const updatedCurrentNotebook =
        state.currentNotebook?.id === id
          ? { ...state.currentNotebook, ...updates, updatedAt: new Date() }
          : state.currentNotebook

      return {
        notebooks: updatedNotebooks,
        openedNotebooks: updatedOpenedNotebooks,
        currentNotebook: updatedCurrentNotebook
      }
    }),

  setCurrentNotebook: (id) =>
    set((state) => ({
      currentNotebook: state.notebooks.find((nb) => nb.id === id) || null
    })),

  addOpenedNotebook: (id) =>
    set((state) => {
      const notebook = state.notebooks.find((nb) => nb.id === id)
      if (!notebook) return state
      // 如果已经打开，不重复添加
      if (state.openedNotebooks.some((nb) => nb.id === id)) return state
      return {
        openedNotebooks: [...state.openedNotebooks, notebook]
      }
    }),

  removeOpenedNotebook: (id) =>
    set((state) => ({
      openedNotebooks: state.openedNotebooks.filter((nb) => nb.id !== id)
    }))
}))
