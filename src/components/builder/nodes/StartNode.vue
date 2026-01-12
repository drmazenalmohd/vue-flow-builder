// src/components/builder/nodes/StartNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

defineProps<{
  data: {
    label: string;
  };
}>();
</script>

<template>
  <div class="start-node">
    <div class="node-label">{{ data.label }}</div>
    <Handle 
      type="source" 
      :position="Position.Bottom"
      :connectable="true"
    />
  </div>
</template>

<style scoped>
.start-node {
  padding: 15px 25px;
  border-radius: 8px;
  background: #4caf50;
  color: white;
  font-weight: 600;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.node-label {
  font-size: 14px;
}
</style>