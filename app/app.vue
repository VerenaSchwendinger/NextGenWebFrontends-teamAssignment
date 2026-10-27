<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>



<style>
/* Global base styles, built only from semantic tokens */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font: var(--text-body);
  color: var(--color-text-primary);
  background: var(--color-bg);
}

a {
  color: var(--color-text-link);
}

:focus-visible {
  outline: 3px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: var(--space-section) var(--space-page-gutter);
}
</style>