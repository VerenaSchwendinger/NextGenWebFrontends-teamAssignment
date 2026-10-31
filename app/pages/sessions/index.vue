<script setup lang="ts">
// Rendering: swr 60 (rendering ADR, decision 3), filtering happens in the browser
const { sessions, tracks, tracksById, roomsById } = await useConferenceData()
const { filters, options, filtered, reset } = useSessionFilter(sessions, tracks)

useHead({ title: 'Sessions · Ctrl Alt Meet' })
</script>

<template>
  <section class="sessions">
    <h1 class="sessions__title">Sessions</h1>

    <SessionFilter
      v-model:track="filters.track"
      v-model:day="filters.day"
      v-model:level="filters.level"
      :options="options"
      @reset="reset"
    />

    <p class="sessions__count" aria-live="polite">
      {{ filtered.length }} von {{ sessions.length }} Sessions
    </p>

    <SessionList :sessions="filtered" :tracks-by-id="tracksById" :rooms-by-id="roomsById" />
  </section>
</template>

<style scoped>
.sessions {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-md);
}

.sessions__title {
  margin: 0;
  font: var(--text-heading-page);
}

.sessions__count {
  margin: var(--space-2) 0 calc(var(--space-2) * -1); /* more space to the filter, closer to the list */
  font: var(--text-meta);
  color: var(--color-text-secondary);
}
</style>