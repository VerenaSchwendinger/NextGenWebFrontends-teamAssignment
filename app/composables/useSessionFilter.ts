import type { DeepReadonly } from 'vue'
import type { Session, Track } from './useConferenceData'

export interface SessionFilters {
  track: string
  day: string
  level: string
}

const FILTER_KEYS = ['track', 'day', 'level'] as const
const LEVEL_ORDER = ['Einsteiger', 'Fortgeschritten', 'Experte']

// Headless filter logic (ADR 02), no markup here.
// Rendering ADR, decision 3: the server always renders the full list.
// The URL query is applied only after mount, then kept in sync for shareable links.
export function useSessionFilter(
  sessions: readonly DeepReadonly<Session>[],
  tracks: readonly DeepReadonly<Track>[],
) {
  const route = useRoute()
  const router = useRouter()

  const filters = reactive<SessionFilters>({ track: '', day: '', level: '' })

  const options = {
    tracks: tracks.map((t) => ({ value: t.id, label: t.name })),
    days: [...new Set(sessions.map((s) => s.day))]
      .sort()
      .map((d) => ({ value: d, label: formatDay(d) })),
    levels: LEVEL_ORDER.filter((l) => sessions.some((s) => s.level === l)).map((l) => ({
      value: l,
      label: l,
    })),
  }

  // Only known values are accepted from the URL
  const allowed = {
    track: options.tracks.map((o) => o.value),
    day: options.days.map((o) => o.value),
    level: options.levels.map((o) => o.value),
  }

  // AND combination: every active filter must match
  const filtered = computed(() =>
    sessions
      .filter(
        (s) =>
          (!filters.track || s.trackId === filters.track) &&
          (!filters.day || s.day === filters.day) &&
          (!filters.level || s.level === filters.level),
      )
      .sort((a, b) => (a.day + a.startTime).localeCompare(b.day + b.startTime)),
  )

  // Read shared links only in the browser, so server and client hydrate the same full list
  onMounted(() => {
    for (const key of FILTER_KEYS) {
      const value = route.query[key]
      if (typeof value === 'string' && allowed[key].includes(value)) {
        filters[key] = value
      }
    }
  })

  // Keep the URL in sync without adding history entries
  watch(filters, () => {
    const query = Object.fromEntries(FILTER_KEYS.filter((k) => filters[k]).map((k) => [k, filters[k]]))
    router.replace({ query })
  })

  function reset() {
    filters.track = ''
    filters.day = ''
    filters.level = ''
  }

  return { filters, options, filtered, reset }
}