<script setup lang="ts">
const { conference, sessions, speakers, tracks } = useConferenceData()

// Format "2026-09-15" and "2026-09-16" as a readable German date range
const dateFormatter = new Intl.DateTimeFormat('de-AT', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})
const firstDay = new Date(conference.dates[0]!)
const lastDay = new Date(conference.dates[conference.dates.length - 1]!)
const dateRange = dateFormatter.formatRange(firstDay, lastDay)

const stats = [
  { label: 'Sessions', value: sessions.length },
  { label: 'Speaker', value: speakers.length },
  { label: 'Tracks', value: tracks.length },
]
</script>

<template>
  <section class="home">
    <div class="home__meta">
      <BaseTag variant="accent">{{ conference.name }}</BaseTag>
      <BaseTag>{{ dateRange }}</BaseTag>
      <BaseTag>{{ conference.location }}</BaseTag>
    </div>

    <h1 class="home__title">Dein Shortcut durch die {{ conference.name }}</h1>
    <p class="home__lead">{{ conference.tagline }}.</p>
    <p class="home__lead">
      Finde die Speaker, die zu deinen Themen passen, und stell dir in wenigen Klicks dein Programm zusammen.
    </p>

    <dl class="home__stats">
      <div v-for="stat in stats" :key="stat.label" class="home__stat">
        <dt>{{ stat.label }}</dt>
        <dd>{{ stat.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-stack-md);
}

.home__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.home__title {
  margin: 0;
  font: var(--text-display);
}

.home__lead {
  margin: 0;
  max-width: 40rem;
  color: var(--color-text-secondary);
}

.home__stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
  margin: var(--space-stack-lg) 0 0;
}

.home__stat {
  min-width: 10rem;
  padding: var(--space-card-padding);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.home__stat dt {
  font: var(--text-meta);
  color: var(--color-text-secondary);
}

.home__stat dd {
  margin: 0;
  font: var(--text-heading-page);
  color: var(--color-action);
}
</style>