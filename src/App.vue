<template>
  <router-view />
</template>
<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
watch(
  () => route.meta.title,
  (title) => {
    if (title) document.title = title
  },
  { immediate: true }
)
</script>