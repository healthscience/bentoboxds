import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { aiInterfaceStore } from '../aiInterface'

// Mock dependencies
vi.mock('@/stores/socket.js', () => ({
  useSocketStore: () => ({
    send_message: vi.fn()
  })
}))

vi.mock('@/stores/bentoboxStore.js', () => ({
  bentoboxStore: () => ({
    chatList: []
  })
}))

vi.mock('@/stores/libraryStore.js', () => ({
  libraryStore: () => ({})
}))

vi.mock('@/stores/chatStore.js', () => ({
  useChatStore: () => ({
    handleIncomingMessage: vi.fn()
  })
}))

vi.mock('@/stores/accountStore.js', () => ({
  accountStore: () => ({})
}))

vi.mock('@/stores/cuesStore.js', () => ({
  cuesStore: () => ({})
}))

vi.mock('@/stores/teachingStore.js', () => ({
  teachingStore: () => ({})
}))

vi.mock('@/stores/besearchStore.js', () => ({
  besearchStore: () => ({
    activeBesearchContext: { story: '' }
  })
}))

vi.mock('@/stores/orreryStore.js', () => ({
  orreryStore: () => ({})
}))

vi.mock('@/stores/lifestrapStore.js', () => ({
  lifestrapStore: () => ({})
}))

vi.mock('@/stores/loomStore.js', () => ({
  loomStore: () => ({})
}))

describe('aiInterfaceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default lifestrapTexture', () => {
    const store = aiInterfaceStore()
    expect(store.lifestrapTexture.pillars.capacity).toEqual([])
    expect(store.lifestrapTexture.pillars.context).toEqual([])
    expect(store.lifestrapTexture.residue).toEqual([])
  })

  it('updatesResonWeight moves item to capacity pillar', () => {
    const store = aiInterfaceStore()
    store.updateResonWeight('Oxygen', 'capacity')
    
    expect(store.lifestrapTexture.pillars.capacity).toContainEqual({
      label: 'capacity',
      value: 'Oxygen'
    })
    expect(store.lifestrapTexture.residue).not.toContain('Oxygen')
  })

  it('updatesResonWeight moves item to context pillar with sub-zones', () => {
    const store = aiInterfaceStore()
    store.updateResonWeight('Forest', 'environment')
    
    expect(store.lifestrapTexture.pillars.context).toContainEqual({
      label: 'Space',
      value: 'Forest'
    })
  })

  it('updatesResonWeight moves item back to residue', () => {
    const store = aiInterfaceStore()
    store.updateResonWeight('Oxygen', 'capacity')
    store.updateResonWeight('Oxygen', 'residue')
    
    expect(store.lifestrapTexture.pillars.capacity).not.toContainEqual({
      label: 'capacity',
      value: 'Oxygen'
    })
    expect(store.lifestrapTexture.residue).toContain('Oxygen')
  })
  
  it('clears data correctly', () => {
    const store = aiInterfaceStore()
    store.historyPair['test'] = [{ q: 'a' }]
    
    // Use vi.spyOn for location.reload if possible, or skip the reload check
    // Since location.reload is read-only in many environments, we'll mock it differently
    const reloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true
    })
    
    store.clearData()
    expect(Object.keys(store.historyPair).length).toBe(0)
    expect(reloadSpy).toHaveBeenCalled()
  })
})
