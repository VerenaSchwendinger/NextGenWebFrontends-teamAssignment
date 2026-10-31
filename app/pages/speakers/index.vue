<script setup lang="ts">
// Rendering: SSG (rendering ADR, decision 1), prerendered at build time
const { speakers } = await useConferenceData()

useHead({ title: 'Speaker · Ctrl Alt Meet' })
</script>

<template>
  <section>
    <h1>Speaker</h1>
    <ul>
      <li v-for="speaker in speakers" :key="speaker.id">
        <NuxtLink :to="`/speakers/${speaker.id}`">{{ speaker.name }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>