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
  <ul v-if="sessions.length" class="session-list">
    <li v-for="session in sessions" :key="session.id">
      <SessionCard
        :session="session"
        :track="tracksById.get(session.trackId)"
        :room="roomsById.get(session.roomId)"
      />
    </li>
  </ul>

  <p v-else class="session-list__empty">Keine Sessions für diese Filterkombination.</p>
</template>

<style scoped>
.session-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.session-list__empty {
  color: var(--color-text-secondary);
}
</style>