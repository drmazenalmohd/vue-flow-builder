// src/components/builder/nodes/ApiNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    apiUrl?: string;
  };
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();
</script>

<template>
  <div class="api-node" :class="{ selected }">
    <Handle type="target" :position="Position.Top" :connectable="true" />
    <div class="node-header">
      <div class="node-label">{{ data.label }}</div>
      <div class="node-actions">
        <button @click="emit('edit', id)" class="node-btn edit-btn">✎</button>
        <button @click="emit('delete', id)" class="node-btn delete-btn">×</button>
      </div>
    </div>
    <div class="node-text">{{ data.apiUrl || 'Click edit to add API URL' }}</div>
    <Handle type="source" :position="Position.Bottom" :connectable="true" />
  </div>
</template>

<style scoped>
.api-node {
  padding: 15px;
  border-radius: 8px;
  background: white;
  border: 2px solid #00bcd4;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.api-node.selected {
  border-color: #0097a7;
  box-shadow: 0 4px 16px rgba(0, 188, 212, 0.3);
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.node-label {
  font-weight: 600;
  font-size: 12px;
  color: #00bcd4;
  text-transform: uppercase;
}

.node-actions {
  display: flex;
  gap: 4px;
}

.node-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

.edit-btn {
  background: #4caf50;
  color: white;
}

.edit-btn:hover {
  background: #45a049;
}

.delete-btn {
  background: #f44336;
  color: white;
  font-size: 18px;
}

.delete-btn:hover {
  background: #da190b;
}

.node-text {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  min-height: 20px;
  word-break: break-all;
}
</style>