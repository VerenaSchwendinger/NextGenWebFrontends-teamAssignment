import rawData from '~/data/conference-data.json'

// Types mirror the structure of conference-data.json
export interface Conference {
  name: string
  tagline: string
  dates: string[]
  location: string
  timezone: string
}

export interface Track {
  id: string
  name: string
}

export interface Room {
  id: string
  name: string
  capacity: number
}

export interface Speaker {
  id: string
  name: string
  title: string
  company: string
  bio: string
  sessionIds: string[]
}

export interface Session {
  id: string
  title: string
  abstract: string
  trackId: string
  speakerIds: string[]
  day: string
  startTime: string
  endTime: string
  roomId: string
  level: string
  format: string
}

export interface ConferenceData {
  conference: Conference
  tracks: Track[]
  rooms: Room[]
  speakers: Speaker[]
  sessions: Session[]
}

// Loads the dataset at runtime from /api/conference (see rendering ADR, Nachträge).
// The shared key makes all callers on a page reuse one request, and the result
// is transferred to the client in the payload, so hydration does not refetch.
export async function useConferenceData() {
  const { data } = await useAsyncData('conference', () =>
    $fetch<ConferenceData>('/api/conference'),
  )

  if (!data.value) {
    throw createError({ statusCode: 500, statusMessage: 'Konferenzdaten nicht verfügbar' })
  }

  const current = data.value

  // Lookup maps, so detail pages do not have to search arrays
  return {
    conference: readonly(current.conference),
    sessions: readonly(current.sessions),
    speakers: readonly(current.speakers),
    tracks: readonly(current.tracks),
    rooms: readonly(current.rooms),
    sessionsById: new Map(current.sessions.map((s) => [s.id, s])),
    speakersById: new Map(current.speakers.map((s) => [s.id, s])),
    tracksById: new Map(current.tracks.map((t) => [t.id, t])),
    roomsById: new Map(current.rooms.map((r) => [r.id, r])),
  }
}