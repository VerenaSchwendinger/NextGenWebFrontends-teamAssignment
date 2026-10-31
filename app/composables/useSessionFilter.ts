import type { DeepReadonly } from 'vue'
import type { Session, Track } from './useConferenceData'

export interface SessionFilters {
  track: string
  day: string
  level: string
}

const LEVEL_ORDER = ['Einsteiger', 'Fortgeschritten', 'Experte']

// Headless filter logic (ADR 02), no markup here
export function useSessionFilter(
  sessions: readonly DeepReadonly<Session>[],
  tracks: readonly DeepReadonly<Track>[],
) {
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

  return { filters, options, filtered }
}