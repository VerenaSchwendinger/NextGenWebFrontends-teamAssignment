import type { ConferenceData, Session } from '~/composables/useConferenceData'

// Versioned key, a future format change can use v2 without breaking old data
export const PROGRAM_STORAGE_KEY = 'ctrl-alt-meet.program.v1'

export function useMyProgram() {
  // Only session ids are stored (document 03), shared by all components
  const ids = useState<string[]>('my-program', () => [])

  // True once the client plugin has restored the ids from localStorage
  const ready = useState<boolean>('my-program-ready', () => false)

  // Reads the dataset already loaded by useConferenceData, no extra request
  const conference = useNuxtData<ConferenceData>('conference')

  const has = (id: string) => ids.value.includes(id)

  // Always assign a new array, so the plugin watcher notices the change
  function add(id: string) {
    if (!has(id)) ids.value = [...ids.value, id]
  }

  function remove(id: string) {
    ids.value = ids.value.filter((existing) => existing !== id)
  }

  function toggle(id: string) {
    if (has(id)) remove(id)
    else add(id)
  }

  const count = computed(() => ids.value.length)

  // Full sessions are derived from the ids, the dataset stays the single source of truth
  const sessions = computed<Session[]>(() => {
    const byId = new Map((conference.data.value?.sessions ?? []).map((s) => [s.id, s]))
    return ids.value
      .map((id) => byId.get(id))
      .filter((s): s is Session => Boolean(s))
      .sort((a, b) => a.day.localeCompare(b.day) || a.startTime.localeCompare(b.startTime))
  })

  return { ids: readonly(ids), ready: readonly(ready), has, add, remove, toggle, count, sessions }
}