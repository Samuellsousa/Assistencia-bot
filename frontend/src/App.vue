<template>
  <v-container>
    <ChamadosView />
  </v-container>
</template>

<script setup>
import ChamadosView from './views/ChamadosView.vue'
</script>

<style scoped>
/* Se você quiser adicionar um estilo global para o contêiner ou o layout */
v-container {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}
</style>
