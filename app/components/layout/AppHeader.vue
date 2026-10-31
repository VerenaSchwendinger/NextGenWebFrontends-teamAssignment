<script setup lang="ts">
const links = [
  { to: '/sessions', label: 'Sessions' },
  { to: '/speakers', label: 'Speaker' },
  //{ to: '/my-program', label: 'Mein Programm' },
]

const route = useRoute()
const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

// Close the menu after navigating to another page
watch(() => route.fullPath, close)
</script>

<template>
  <header class="app-header" @keydown.esc="close">
    <NuxtLink to="/" class="app-header__logo" aria-label="Ctrl Alt Meet, zur Startseite">
      <BaseTag>Ctrl</BaseTag>
      <BaseTag>Alt</BaseTag>
      <span class="app-header__name">Meet</span>
    </NuxtLink>

    <!-- Only visible on small screens -->
    <button
      type="button"
      class="app-header__toggle"
      :aria-expanded="isOpen"
      aria-controls="main-nav"
      @click="toggle"
    >
      <span class="app-header__sr-only">{{ isOpen ? 'Menü schließen' : 'Menü öffnen' }}</span>
      <span class="app-header__icon" aria-hidden="true" />
    </button>

    <nav
      id="main-nav"
      class="app-header__nav-wrap"
      :class="{ 'app-header__nav-wrap--open': isOpen }"
      aria-label="Hauptnavigation"
    >
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
  position: sticky; /* stays at the top while the page scrolls */
  top: 0;
  z-index: 10; /* above cards and other content */
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2) var(--space-4);
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
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-header__link {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem; /* 44px touch target */
  font: var(--text-body);
  color: var(--color-on-action);
  text-decoration: none;
  border-bottom: 2px solid transparent;
}

.app-header__link:hover,
.app-header__link.router-link-active {
  border-bottom-color: var(--color-on-action);
}

/* Hamburger button, hidden on large screens */
.app-header__toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

/* Three lines drawn with one element and two pseudo-elements */
.app-header__icon,
.app-header__icon::before,
.app-header__icon::after {
  display: block;
  width: 1.5rem;
  height: 2px;
  background: var(--color-on-action);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.app-header__icon {
  position: relative;
}

.app-header__icon::before,
.app-header__icon::after {
  content: '';
  position: absolute;
  left: 0;
}

.app-header__icon::before {
  top: -0.5rem;
}

.app-header__icon::after {
  top: 0.5rem;
}

/* Turn the lines into an X when open */
.app-header__toggle[aria-expanded='true'] .app-header__icon {
  background: transparent;
}

.app-header__toggle[aria-expanded='true'] .app-header__icon::before {
  transform: translateY(0.5rem) rotate(45deg);
}

.app-header__toggle[aria-expanded='true'] .app-header__icon::after {
  transform: translateY(-0.5rem) rotate(-45deg);
}

/* Text only for screen readers */
.app-header__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* Small screens: hamburger button, menu opens below the logo */
@media (max-width: 40rem) {
  .app-header__toggle {
    display: inline-flex;
  }

  .app-header__nav-wrap {
    display: none;
    width: 100%;
  }

  .app-header__nav-wrap--open {
    display: block;
  }

  .app-header__nav {
    flex-direction: column;
    gap: 0;
  }

  .app-header__link {
    width: 100%;
    border-bottom: 0;
    border-top: 1px solid var(--color-on-action);
  }

  .app-header__link.router-link-active {
    font-weight: 700;
  }
}

/* Respect users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  .app-header__icon,
  .app-header__icon::before,
  .app-header__icon::after {
    transition: none;
  }
}
</style>