<template>
  <header class="app-header">
    <NuxtLink to="/" class="app-header__logo" aria-label="Ctrl Alt Meet, zur Startseite">
      <BaseTag>Ctrl</BaseTag>
      <BaseTag>Alt</BaseTag>
      <span class="app-header__name">Meet</span>
    </NuxtLink>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
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
</style>