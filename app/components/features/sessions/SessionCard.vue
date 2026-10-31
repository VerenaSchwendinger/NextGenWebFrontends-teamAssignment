<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { Room, Session, Track } from '~/composables/useConferenceData'

defineProps<{
  session: DeepReadonly<Session>
  track?: DeepReadonly<Track>
  room?: DeepReadonly<Room>
}>()
</script>

<template>
  <article class="session-card">
    <p class="session-card__time">
      {{ formatDay(session.day) }} · {{ session.startTime }}–{{ session.endTime }} · {{ room?.name }}
    </p>

    <h2 class="session-card__title">
      <NuxtLink :to="`/sessions/${session.id}`">{{ session.title }}</NuxtLink>
    </h2>

    <div class="session-card__tags">
      <BaseTag v-if="track">{{ track.name }}</BaseTag>
      <BaseTag>{{ session.level }}</BaseTag>
      <BaseTag>{{ session.format }}</BaseTag>
    </div>

    <!-- Slot for AddToProgramButton (part E, document 03) -->
    <slot name="actions" />
  </article>
</template>

<style scoped>
.session-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  height: 100%; /* fill the grid cell, so all cards in a row are equally tall */
  padding: var(--space-card-padding);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.session-card__time {
  margin: 0;
  font: var(--text-tag); /* monospace for times and rooms, document 01 */
  color: var(--color-text-secondary);
}

.session-card__title {
  margin: 0;
  font: var(--text-session-title);
}

.session-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: auto; /* push tags to the bottom of the card */
}
</style>