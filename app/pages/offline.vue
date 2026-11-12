<script setup lang="ts">
// Offline page: shown by the service worker when a page is neither online
// nor cached (02-offline-strategie-konzept.md, "Worst Case").
// Prerendered (routeRules) so it can be precached.
useHead({ title: 'Offline · Ctrl Alt Meet' })
useSeoMeta({ robots: 'noindex' })
</script>

<template>
  <section class="offline">
    <h1 class="offline__title">Du bist offline</h1>
    <p class="offline__text">
      Diese Seite hast du noch nie mit Verbindung geöffnet, deshalb ist sie nicht gespeichert.
      Sobald du wieder online bist, lädt sie ganz normal.
    </p>
    <p class="offline__text">
      Deine gemerkten Sessions findest du auch ohne Verbindung in
      <NuxtLink to="/my-program">Mein Programm</NuxtLink>.
    </p>
  </section>
</template>

<style scoped>
.offline {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-md);
}

.offline__title {
  margin: 0;
  font: var(--text-heading-page);
}

.offline__text {
  margin: 0;
  font: var(--text-body);
  color: var(--color-text-secondary);
}
</style>