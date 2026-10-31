<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { Speaker } from '~/composables/useConferenceData'

defineProps<{
  speaker: DeepReadonly<Speaker>
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
</style>