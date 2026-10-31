import type { ConferenceData } from '~/composables/useConferenceData'
import { PROGRAM_STORAGE_KEY } from '~/composables/useMyProgram'

function readStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(PROGRAM_STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    // Accept only an array of strings, anything else counts as empty
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    // Broken JSON or blocked storage, start with an empty program
    return []
  }
}

function writeIds(ids: string[]) {
  try {
    localStorage.setItem(PROGRAM_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Quota exceeded or private mode, the program still works in memory
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const ids = useState<string[]>('my-program', () => [])
  const ready = useState<boolean>('my-program-ready', () => false)
  const conference = useNuxtData<ConferenceData>('conference')

  // Valid ids from the dataset, loads it if the current page has not yet
  async function loadValidIds(): Promise<Set<string> | null> {
    try {
      const data = conference.data.value ?? (await $fetch<ConferenceData>('/api/conference'))
      return new Set(data.sessions.map((s) => s.id))
    } catch {
      return null // dataset unreachable, keep stored ids unchecked
    }
  }

  // Remove duplicates and ids that no longer exist in the dataset
  function sanitize(stored: string[], valid: Set<string> | null): string[] {
    const unique = [...new Set(stored)]
    return valid ? unique.filter((id) => valid.has(id)) : unique
  }

  // Runs after hydration, so server and client first render the same empty state
  nuxtApp.hook('app:suspense:resolve', async () => {
    if (ready.value) return // hook fires on every navigation, restore only once

    const valid = await loadValidIds()
    ids.value = sanitize(readStoredIds(), valid)
    ready.value = true

    // Persist the cleaned list once, the watcher below only sees later changes
    writeIds(ids.value)

    // Exactly one watcher for the whole app (document 03)
    watch(ids, (value) => writeIds(value))

    // Sync changes from other tabs (document 03)
    window.addEventListener('storage', (event) => {
      if (event.key !== PROGRAM_STORAGE_KEY) return
      ids.value = sanitize(readStoredIds(), valid)
    })
  })
})