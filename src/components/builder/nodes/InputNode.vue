// src/components/builder/nodes/InputNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    inputType?: 'text' | 'email' | 'phone' | 'number';
    placeholder?: string;
    validation?: string;
    saveToVariable?: string;
  };
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const isHovered = ref(false);

const getInputIcon = (type: string) => {
  const icons: Record<string, string> = {
    text: '✏️',
    email: '📧',
    phone: '📱',
    number: '#️⃣',
  };
  return icons[type] || '✏️';
};
</script>

<template>
  <div 
    class="input-node" 
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
    
    <div class="node-icon">{{ getInputIcon(data.inputType || 'text') }}</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn" title="Edit">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn" title="Delete">×</button>
        </div>
      </div>
      
      <div class="input-preview">
        <div class="input-type-badge">{{ data.inputType || 'text' }}</div>
        <div class="input-field-preview">
          <input 
            type="text" 
            :placeholder="data.placeholder || 'User will type here...'" 
            disabled
            class="preview-input"
          />
        </div>
        <div v-if="data.saveToVariable" class="variable-badge">
          💾 Save to: {{ data.saveToVariable }}
        </div>
      </div>
      
      <div class="validation-info" v-if="data.validation">
        <span class="validation-icon">✓</span>
        <span class="validation-text">{{ data.validation }}</span>
      </div>
    </div>
    
    <Handle 
      type="source" 
      :position="Position.Bottom"
      id="valid"
      :connectable="true"
      class="handle-source valid-handle"
      style="left: 35%"
    />
    <Handle 
      type="source" 
      :position="Position.Bottom"
      id="invalid"
      :connectable="true"
      class="handle-source invalid-handle"
      style="left: 65%"
    />
    
    <div class="output-labels">
      <span class="valid-label">Valid</span>
      <span class="invalid-label">Invalid</span>
    </div>
  </div>
</template>

<style scoped>
.input-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 300px;
  max-width: 400px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
  padding-bottom: 24px;
}

.input-node:hover {
  box-shadow: 0 8px 24px rgba(103, 58, 183, 0.15);
  transform: translateY(-2px);
}

.input-node.selected {
  border-color: #673ab7;
  box-shadow: 0 8px 32px rgba(103, 58, 183, 0.25);
}

.node-icon {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #673ab7 0%, #512da8 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(103, 58, 183, 0.3);
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
  color: #673ab7;
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

.input-preview {
  background: #f8f4ff;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid #673ab7;
}

.input-type-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #673ab7;
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.input-field-preview {
  margin: 8px 0;
}

.preview-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #999;
}

.variable-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #4caf50;
  color: white;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
}

.validation-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #e8f5e9;
  border-radius: 6px;
}

.validation-icon {
  color: #4caf50;
  font-weight: bold;
}

.validation-text {
  font-size: 13px;
  color: #2e7d32;
  font-weight: 600;
}

.output-labels {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0 30px;
  font-size: 11px;
  font-weight: 700;
}

.valid-label {
  color: #4caf50;
}

.invalid-label {
  color: #f44336;
}

.handle-target {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #673ab7 !important;
}

.handle-target:hover {
  background: #673ab7 !important;
}

.valid-handle {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #4caf50 !important;
}

.valid-handle:hover {
  background: #4caf50 !important;
}

.invalid-handle {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #f44336 !important;
}

.invalid-handle:hover {
  background: #f44336 !important;
}
</style>