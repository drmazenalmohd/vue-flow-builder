// src/components/builder/nodes/MessageNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    text?: string;
    buttons?: Array<{ text: string; action: string }>;
  };
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
  addButton: [id: string];
}>();

const isHovered = ref(false);
</script>

<template>
  <div 
    class="message-node" 
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
    
    <div class="node-icon">💬</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn" title="Edit">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn" title="Delete">×</button>
        </div>
      </div>
      
      <div class="node-text">{{ data.text || 'Click to add message...' }}</div>
      
      <div v-if="data.buttons && data.buttons.length > 0" class="buttons-container">
        <div v-for="(button, index) in data.buttons" :key="index" class="button-item">
          <div class="button-preview">{{ button.text }}</div>
          <Handle 
            :id="`btn-${index}`"
            type="source" 
            :position="Position.Right"
            :connectable="true"
            class="button-handle"
          />
        </div>
      </div>
      
      <button 
        v-show="isHovered || selected" 
        @click="emit('addButton', id)" 
        class="add-button-btn"
      >
        + Add Button
      </button>
    </div>
    
    <Handle 
      v-if="!data.buttons || data.buttons.length === 0"
      type="source" 
      :position="Position.Bottom"
      :connectable="true"
      class="handle-source"
    />
    
    <div class="node-status" v-show="isHovered">
      <span class="status-dot"></span>
      <span class="status-text">Ready</span>
    </div>
  </div>
</template>

<style scoped>
.message-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 280px;
  max-width: 400px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
}

.message-node:hover {
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.15);
  transform: translateY(-2px);
}

.message-node.selected {
  border-color: #2196f3;
  box-shadow: 0 8px 32px rgba(33, 150, 243, 0.25);
}

.message-node.hovered {
  border-color: #e3f2fd;
}

.node-icon {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
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
  color: #2196f3;
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

.node-text {
  font-size: 14px;
  color: #424242;
  line-height: 1.6;
  min-height: 40px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #2196f3;
}

.buttons-container {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.button-item {
  position: relative;
  display: flex;
  align-items: center;
}

.button-preview {
  flex: 1;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  transition: all 0.2s;
}

.button-preview:hover {
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.button-handle {
  right: -6px !important;
}

.add-button-btn {
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  background: transparent;
  color: #757575;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button-btn:hover {
  border-color: #2196f3;
  color: #2196f3;
  background: #e3f2fd;
}

.node-status {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 11px;
  color: #666;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-weight: 600;
}

.handle-target,
.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #2196f3 !important;
  transition: all 0.2s;
}

.handle-target:hover,
.handle-source:hover {
  transform: scale(1.3);
  background: #2196f3 !important;
}
</style>