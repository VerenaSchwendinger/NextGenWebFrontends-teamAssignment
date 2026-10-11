<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'accent' }>(), {
  variant: 'default',
})
</script>

<template>
  <span class="base-tag" :class="`base-tag--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.base-tag {
  display: inline-block;
  padding: var(--space-1) var(--space-inline-tag);
  font: var(--text-tag);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-text-secondary);
  border-bottom-width: 3px;
  border-radius: var(--radius-sm);
}

.base-tag--accent {
  color: var(--color-on-accent);
  background: var(--color-accent);
}
</style>