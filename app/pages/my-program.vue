<script setup lang="ts">
// Rendering: CSR via ssr false (rendering ADR, decision 4)
const { tracksById, roomsById } = await useConferenceData()
const { sessions, ready } = useMyProgram()

useHead({ title: 'Mein Programm · Ctrl Alt Meet' })
useSeoMeta({ robots: 'noindex' })

const summary = computed(() =>
  sessions.value.length === 1 ? '1 Session gemerkt' : `${sessions.value.length} Sessions gemerkt`,
)
</script>

<template>
  <section class="my-program">
    <h1 class="my-program__title">Mein Programm</h1>

    <p v-if="!ready" class="my-program__hint" role="status">Dein Programm wird geladen …</p>

    <template v-else-if="sessions.length">
      <p class="my-program__hint" role="status">{{ summary }}</p>

      <!-- Reuses Verena's SessionCard, the button goes into its actions slot -->
      <ul class="my-program__list">
        <li v-for="session in sessions" :key="session.id">
          <SessionCard
            :session="session"
            :track="tracksById.get(session.trackId)"
            :room="roomsById.get(session.roomId)"
          >
            <template #actions>
              <AddToProgramButton :session-id="session.id" :session-title="session.title" />
            </template>
          </SessionCard>
        </li>
      </ul>
    </template>

    <p v-else class="my-program__hint">
      Du hast noch keine Sessions gemerkt.
      <NuxtLink to="/sessions">Zur Session-Übersicht</NuxtLink>
    </p>
  </section>
</template>

<style scoped>
.my-program {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-md);
}

.my-program__title {
  margin: 0;
  font: var(--text-heading-page);
}

.my-program__hint {
  margin: 0;
  font: var(--text-meta);
  color: var(--color-text-secondary);
}

.my-program__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>