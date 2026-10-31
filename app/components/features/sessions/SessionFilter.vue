<script setup lang="ts">
interface Option {
  value: string
  label: string
}

defineProps<{
  options: { tracks: Option[]; days: Option[]; levels: Option[] }
}>()

const track = defineModel<string>('track', { required: true })
const day = defineModel<string>('day', { required: true })
const level = defineModel<string>('level', { required: true })

defineEmits<{ reset: [] }>()
</script>

<template>
  <form class="session-filter" @submit.prevent>
    <label class="session-filter__field">
      <span>Track</span>
      <select v-model="track">
        <option value="">Alle Tracks</option>
        <option v-for="o in options.tracks" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </label>

    <label class="session-filter__field">
      <span>Tag</span>
      <select v-model="day">
        <option value="">Alle Tage</option>
        <option v-for="o in options.days" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </label>

    <label class="session-filter__field">
      <span>Level</span>
      <select v-model="level">
        <option value="">Alle Level</option>
        <option v-for="o in options.levels" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </label>

    <button type="button" class="session-filter__reset" @click="$emit('reset')">
      Filter zurücksetzen
    </button>
  </form>
</template>

<style scoped>
.session-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-4);
}

.session-filter__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font: var(--text-meta);
  color: var(--color-text-secondary);
}

.session-filter select {
  font: var(--text-body);
  padding: var(--space-2);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-text-secondary); /* WCAG 1.4.11, see document 01 */
  border-radius: var(--radius-sm);
}

.session-filter__reset {
  font: var(--text-meta);
  padding: var(--space-2) var(--space-4);
  color: var(--color-on-action);
  background: var(--color-action);
  border: 0;
  border-radius: var(--radius-sm);
  cursor: pointer;
}
</style>