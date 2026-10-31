<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { Room, Session, Track } from '~/composables/useConferenceData'

defineProps<{
  sessions: readonly DeepReadonly<Session>[]
  tracksById: Map<string, Track>
  roomsById: Map<string, Room>
}>()
</script>

<template>
  <ul class="session-list">
    <li v-for="session in sessions" :key="session.id">
      <SessionCard
        :session="session"
        :track="tracksById.get(session.trackId)"
        :room="roomsById.get(session.roomId)"
      />
    </li>
  </ul>
</template>