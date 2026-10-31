<script setup lang="ts">
const props = defineProps<{
  sessionId: string
  sessionTitle: string
}>()

const { has, toggle, ready } = useMyProgram()
const inProgram = computed(() => has(props.sessionId))
</script>

<template>
  <!-- Disabled until restored, an early click would overwrite the stored program -->
  <button
    type="button"
    class="add-to-program"
    :class="{ 'add-to-program--active': inProgram }"
    :disabled="!ready"
    @click="toggle(sessionId)"
  >
    {{ inProgram ? 'Aus Programm entfernen' : 'Zum Programm hinzufügen' }}
    <!-- Context for screen readers when many buttons are listed -->
    <span class="add-to-program__sr-only">({{ sessionTitle }})</span>
  </button>
</template>

<style scoped>
.add-to-program {
  align-self: flex-start;
  padding: var(--space-2) var(--space-4);
  font: var(--text-button);
  color: var(--color-on-action);
  background: var(--color-action);
  border: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.add-to-program:hover {
  background: var(--color-action-hover);
}

/* Signal Amber with dark text marks "Im Programm" (document 01) */
.add-to-program--active,
.add-to-program--active:hover {
  color: var(--color-on-accent);
  background: var(--color-accent);
}

.add-to-program:disabled {
  opacity: 0.6;
  cursor: wait;
}

.add-to-program__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>