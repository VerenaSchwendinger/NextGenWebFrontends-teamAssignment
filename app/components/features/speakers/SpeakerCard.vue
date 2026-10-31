<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { Speaker } from '~/composables/useConferenceData'

defineProps<{
  speaker: DeepReadonly<Speaker>
}>()
</script>

<template>
  <article class="speaker-card">
    <h2 class="speaker-card__name">
      <NuxtLink :to="`/speakers/${speaker.id}`">{{ speaker.name }}</NuxtLink>
    </h2>
    <p class="speaker-card__role">{{ speaker.title }}</p>
    <p class="speaker-card__company">{{ speaker.company }}</p>
  </article>
</template>

<style scoped>
.speaker-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  height: 100%; /* fill the grid cell, so all cards in a row are equally tall */
  padding: var(--space-card-padding);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.speaker-card__name {
  margin: 0 0 var(--space-1);
  font: var(--text-session-title);
}

.speaker-card__role {
  margin: 0;
  font: var(--text-body);
}

.speaker-card__company {
  margin: 0;
  font: var(--text-meta);
  color: var(--color-text-secondary);
}
</style>