<script setup lang="ts">
// Rendering: SSG (rendering ADR, decision 1), prerendered at build time
const route = useRoute()
const { speakersById, sessions } = await useConferenceData()

// Unknown ids end on a real 404 page
const speaker = speakersById.get(String(route.params.id))

if (!speaker) {
  throw createError({ statusCode: 404, statusMessage: 'Speaker nicht gefunden', fatal: true })
}

// Derive the sessions from sessions[].speakerIds, the single source for this relation (rendering ADR, decision 1)
const speakerSessions = sessions
  .filter((s) => s.speakerIds.includes(speaker.id))
  .sort((a, b) => (a.day + a.startTime).localeCompare(b.day + b.startTime))

// Page title and description for browser tab, search engines and link previews
useHead({ title: `${speaker.name} · Ctrl Alt Meet` })
useSeoMeta({ description: `${speaker.title}, ${speaker.company}. ${speaker.bio}` })
</script>

<template>
  <div class="speaker-page">
    <NuxtLink to="/speakers" class="speaker-page__back">Zurück zur Übersicht</NuxtLink>
    <SpeakerProfile :speaker="speaker" :sessions="speakerSessions" />
  </div>
</template>

<style scoped>
.speaker-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-md);
}

.speaker-page__back {
  font: var(--text-meta);
}
</style>