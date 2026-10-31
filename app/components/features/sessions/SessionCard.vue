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