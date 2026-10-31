<script setup lang="ts">
const links = [
  { to: '/sessions', label: 'Sessions' },
  //{ to: '/speakers', label: 'Speaker' },
  //{ to: '/my-program', label: 'Mein Programm' },
]
</script>

<template>
  <header class="app-header">
    <NuxtLink to="/" class="app-header__logo" aria-label="Ctrl Alt Meet, zur Startseite">
      <BaseTag>Ctrl</BaseTag>
      <BaseTag>Alt</BaseTag>
      <span class="app-header__name">Meet</span>
    </NuxtLink>

    <nav aria-label="Hauptnavigation">
      <ul class="app-header__nav">
        <li v-for="link in links" :key="link.to">
          <NuxtLink :to="link.to" class="app-header__link">{{ link.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-page-gutter);
  background: var(--color-action);
}

.app-header__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
}

.app-header__name {
  font: var(--text-heading-section);
  color: var(--color-on-action);
}

.app-header__nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-header__link {
  font: var(--text-body);
  color: var(--color-on-action);
  text-decoration: none;
  padding-bottom: var(--space-1);
  border-bottom: 2px solid transparent;
}

.app-header__link:hover,
.app-header__link.router-link-active {
  border-bottom-color: var(--color-on-action);
}
</style>