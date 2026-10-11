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

// Static dataset, bundled at build time and never mutated at runtime
const data = rawData as ConferenceData

// Lookup maps, built once so detail pages do not have to search arrays
const sessionsById = new Map(data.sessions.map((s) => [s.id, s]))
const speakersById = new Map(data.speakers.map((s) => [s.id, s]))
const tracksById = new Map(data.tracks.map((t) => [t.id, t]))
const roomsById = new Map(data.rooms.map((r) => [r.id, r]))

export function useConferenceData() {
  return {
    conference: readonly(data.conference),
    sessions: readonly(data.sessions),
    speakers: readonly(data.speakers),
    tracks: readonly(data.tracks),
    rooms: readonly(data.rooms),
    sessionsById,
    speakersById,
    tracksById,
    roomsById,
  }
}