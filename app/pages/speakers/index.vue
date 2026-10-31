<script setup lang="ts">
// Rendering: SSG (rendering ADR, decision 1), prerendered at build time
const { speakers } = await useConferenceData()

// Sort by last name, e.g. "Achterberg" before "Ahrend"
const lastName = (name: string) => name.split(' ').at(-1) ?? name

const sorted = computed(() =>
  [...speakers].sort((a, b) => lastName(a.name).localeCompare(lastName(b.name), 'de')),
)

useHead({ title: 'Speaker · Ctrl Alt Meet' })
</script>

<template>
  <section class="speakers">
    <h1 class="speakers__title">Speaker</h1>
    <p class="speakers__count">{{ speakers.length }} Speaker</p>

    <ul class="speakers__list">
      <li v-for="speaker in sorted" :key="speaker.id">
        <SpeakerCard :speaker="speaker" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.speakers {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-md);
}

.speakers__title {
  margin: 0;
  font: var(--text-heading-page);
}

.speakers__count {
  margin: 0;
  font: var(--text-meta);
  color: var(--color-text-secondary);
}

.speakers__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>