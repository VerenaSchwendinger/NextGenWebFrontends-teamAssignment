<script setup lang="ts">
// Rendering: swr 60 (rendering ADR, decision 3), filtering happens in the browser
const { sessions, tracks, tracksById, roomsById } = await useConferenceData()
const { filters, options, filtered } = useSessionFilter(sessions, tracks)

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
    />

    <p class="sessions__count" aria-live="polite">
      {{ filtered.length }} von {{ sessions.length }} Sessions
    </p>

    <SessionList :sessions="filtered" :tracks-by-id="tracksById" :rooms-by-id="roomsById" />
  </section>
</template>