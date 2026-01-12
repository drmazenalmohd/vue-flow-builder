// src/components/builder/nodes/SetVariableNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    variableName?: string;
    variableValue?: string;
    operation?: 'set' | 'append' | 'increment';
  };
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const isHovered = ref(false);
</script>

<template>
  <div 
    class="variable-node" 
    :class="{ selected, hovered: isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <Handle 
      type="target" 
      :position="Position.Top"
      :connectable="true"
      class="handle-target"
    />
    
    <div class="node-icon">💾</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn" title="Edit">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn" title="Delete">×</button>
        </div>
      </div>
      
      <div class="variable-preview">
        <div class="operation-badge">{{ data.operation || 'set' }}</div>
        <div class="variable-assignment">
          <div class="var-name">{{ data.variableName || 'variable_name' }}</div>
          <div class="equals">=</div>
          <div class="var-value">{{ data.variableValue || 'value' }}</div>
        </div>
      </div>
    </div>
    
    <Handle 
      type="source" 
      :position="Position.Bottom"
      :connectable="true"
      class="handle-source"
    />
  </div>
</template>

<style scoped>
.variable-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 280px;
  max-width: 400px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
}

.variable-node:hover {
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.15);
  transform: translateY(-2px);
}

.variable-node.selected {
  border-color: #4caf50;
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.25);
}

.node-icon {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.node-content {
  padding: 24px 16px 16px 16px;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.node-label {
  font-weight: 700;
  font-size: 11px;
  color: #4caf50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  animation: fadeIn 0.2s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

.node-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;
}

.edit-btn {
  background: #4caf50;
  color: white;
}

.edit-btn:hover {
  background: #45a049;
  transform: scale(1.1);
}

.delete-btn {
  background: #f44336;
  color: white;
  font-size: 18px;
}

.delete-btn:hover {
  background: #da190b;
  transform: scale(1.1);
}

.variable-preview {
  background: #f1f8e9;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #4caf50;
}

.operation-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #4caf50;
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.variable-assignment {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Courier New', monospace;
  font-size: 15px;
}

.var-name {
  padding: 8px 12px;
  background: white;
  border: 2px solid #4caf50;
  border-radius: 6px;
  color: #4caf50;
  font-weight: 700;
}

.equals {
  font-weight: bold;
  color: #666;
}

.var-value {
  padding: 8px 12px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  color: #333;
  font-weight: 600;
}

.handle-target,
.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #4caf50 !important;
}

.handle-target:hover,
.handle-source:hover {
  background: #4caf50 !important;
}
</style>