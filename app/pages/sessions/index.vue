<script setup lang="ts">
const { sessions, tracksById, roomsById } = await useConferenceData()

const sorted = computed(() =>
  [...sessions].sort((a, b) => (a.day + a.startTime).localeCompare(b.day + b.startTime)),
)
</script>

<template>
  <section>
    <h1>Sessions</h1>
    <SessionList :sessions="sorted" :tracks-by-id="tracksById" :rooms-by-id="roomsById" />
  </section>
</template>