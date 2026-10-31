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
  </form>
</template>