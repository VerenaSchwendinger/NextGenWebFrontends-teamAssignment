<script setup lang="ts">
const { sessions } = await useConferenceData()
</script>

<template>
  <section>
    <h1>Sessions</h1>
    <ul>
      <li v-for="session in sessions" :key="session.id">
        <NuxtLink :to="`/sessions/${session.id}`">{{ session.title }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>