<script setup lang="ts">
import type { Speaker } from '~/composables/useConferenceData'

// Rendering: swr 60 (rendering ADR, decision 2), configured in nuxt.config.ts routeRules

// 1. Read the id from the URL, /sessions/s04 gives "s04"
const route = useRoute()
const sessionId = String(route.params.id)

// 2. Get data and lookup maps from the central data layer
const { sessionsById, speakersById, tracksById, roomsById } = await useConferenceData()

// 3. Find the session, unknown ids end on a real 404 page
const session = sessionsById.get(sessionId)

if (!session) {
  throw createError({ statusCode: 404, statusMessage: 'Session nicht gefunden', fatal: true })
}

// 4. Resolve the ids stored in the session into display data
const track = tracksById.get(session.trackId)
const room = roomsById.get(session.roomId)
const speakers = session.speakerIds
  .map((id) => speakersById.get(id))
  .filter((speaker): speaker is Speaker => Boolean(speaker))

// 5. Page title and description for browser tab and search engines
useHead({ title: `${session.title} · Ctrl Alt Meet` })
useSeoMeta({ description: session.abstract })
</script>

<template>
  <article class="session-detail">
    <NuxtLink to="/sessions" class="session-detail__back">Zurück zur Übersicht</NuxtLink>

    <header class="session-detail__header">
      <h1 class="session-detail__title">{{ session.title }}</h1>

      <div class="session-detail__tags">
        <BaseTag v-if="track">{{ track.name }}</BaseTag>
        <BaseTag>{{ session.level }}</BaseTag>
        <BaseTag>{{ session.format }}</BaseTag>
      </div>
    </header>

    <dl class="session-detail__meta">
      <div>
        <dt>Tag</dt>
        <dd>
          <time :datetime="session.day">{{ formatDay(session.day) }}</time>
        </dd>
      </div>
      <div>
        <dt>Zeit</dt>
        <dd class="session-detail__mono">
          <time :datetime="`${session.day}T${session.startTime}`">{{ session.startTime }}</time>
          bis
          <time :datetime="`${session.day}T${session.endTime}`">{{ session.endTime }}</time>
        </dd>
      </div>
      <div>
        <dt>Raum</dt>
        <dd class="session-detail__mono">{{ room?.name ?? session.roomId }}</dd>
      </div>
    </dl>

    <AddToProgramButton :session-id="session.id" :session-title="session.title" />

    <section class="session-detail__section">
      <h2 class="session-detail__heading">Abstract</h2>
      <p class="session-detail__abstract">{{ session.abstract }}</p>
    </section>

    <section class="session-detail__section">
      <h2 class="session-detail__heading">
        {{ speakers.length === 1 ? 'Speaker' : 'Speaker:innen' }}
      </h2>

      <ul class="session-detail__speakers">
        <li v-for="speaker in speakers" :key="speaker.id" class="session-detail__speaker">
          <NuxtLink :to="`/speakers/${speaker.id}`" class="session-detail__speaker-name">
            {{ speaker.name }}
          </NuxtLink>
          <span class="session-detail__speaker-role">
            {{ speaker.title }}, {{ speaker.company }}
          </span>
        </li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.session-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-md);
  max-width: 48rem; /* readable line length for the abstract */
}

.session-detail__back {
  font: var(--text-meta);
  color: var(--color-text-link);
}

.session-detail__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.session-detail__title {
  margin: 0;
  font: var(--text-heading-page);
}

.session-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.session-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4) var(--space-8);
  margin: 0;
  padding: var(--space-card-padding);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.session-detail__meta dt {
  font: var(--text-meta);
  color: var(--color-text-secondary);
}

.session-detail__meta dd {
  margin: 0;
  font: var(--text-body);
}

.session-detail__mono {
  font: var(--text-time) !important; /* monospace for times and rooms, document 01 */
}

.session-detail__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.session-detail__heading {
  margin: 0;
  font: var(--text-heading-section);
}

.session-detail__abstract {
  margin: 0;
  font: var(--text-body);
}

.session-detail__speakers {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.session-detail__speaker {
  display: flex;
  flex-direction: column;
}

.session-detail__speaker-name {
  font: var(--text-speaker-name);
  color: var(--color-text-link);
}

.session-detail__speaker-role {
  font: var(--text-meta);
  color: var(--color-text-secondary);
}
</style>