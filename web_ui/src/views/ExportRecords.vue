<template>
  <div class="page-view">
    <ExportRecords :mp_id="mp_id" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { ref } from 'vue'
import { computed } from 'vue'
import ExportRecords from '@/components/ExportRecords.vue'
const mp_id = ref('')
</script>