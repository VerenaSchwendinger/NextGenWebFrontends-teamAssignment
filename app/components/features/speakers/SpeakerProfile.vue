<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { Session, Speaker } from '~/composables/useConferenceData'

defineProps<{
  speaker: DeepReadonly<Speaker>
  sessions: readonly DeepReadonly<Session>[]
}>()
</script>

<template>
  <article class="speaker-profile">
    <header class="speaker-profile__header">
      <h1 class="speaker-profile__name">{{ speaker.name }}</h1>
      <p class="speaker-profile__role">{{ speaker.title }}</p>
      <p class="speaker-profile__company">{{ speaker.company }}</p>
    </header>

    <section class="speaker-profile__section">
      <h2 class="speaker-profile__heading">Bio</h2>
      <p class="speaker-profile__bio">{{ speaker.bio }}</p>
    </section>

    <section class="speaker-profile__section">
      <h2 class="speaker-profile__heading">
        {{ sessions.length === 1 ? 'Session' : 'Sessions' }}
      </h2>

      <!-- Only title and link: profiles are prerendered, time and room could be outdated (rendering ADR, decision 1) -->
      <ul class="speaker-profile__sessions">
        <li v-for="session in sessions" :key="session.id">
          <NuxtLink :to="`/sessions/${session.id}`">{{ session.title }}</NuxtLink>
        </li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.speaker-profile {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-md);
  max-width: 48rem; /* readable line length for the bio */
}

.speaker-profile__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.speaker-profile__name {
  margin: 0 0 var(--space-1);
  font: var(--text-heading-page);
}

.speaker-profile__role {
  margin: 0;
  font: var(--text-body);
}

.speaker-profile__company {
  margin: 0;
  font: var(--text-meta);
  color: var(--color-text-secondary);
}

.speaker-profile__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.speaker-profile__heading {
  margin: 0;
  font: var(--text-heading-section);
}

.speaker-profile__bio {
  margin: 0;
}

.speaker-profile__sessions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>