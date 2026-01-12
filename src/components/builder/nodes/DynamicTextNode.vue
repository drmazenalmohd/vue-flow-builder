// src/components/builder/nodes/DynamicTextNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref, computed } from 'vue';

const props = defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    text?: string;
    variables?: Array<{ key: string; value: string }>;
  };
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const isHovered = ref(false);

const previewText = computed(() => {
  if (!props.data.text) return 'Click to add dynamic text...';
  
  let text = props.data.text;
  const variables = props.data.variables || [];
  
  variables.forEach(variable => {
    const regex = new RegExp(`{{${variable.key}}}`, 'g');
    text = text.replace(regex, `<span class="variable-highlight">${variable.value}</span>`);
  });
  
  return text;
});

const variableCount = computed(() => {
  if (!props.data.text) return 0;
  const matches = props.data.text.match(/{{.*?}}/g);
  return matches ? matches.length : 0;
});
</script>

<template>
  <div 
    class="dynamic-text-node" 
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
    
    <div class="node-icon">✨</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn" title="Edit">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn" title="Delete">×</button>
        </div>
      </div>
      
      <div class="dynamic-preview">
        <div class="variable-badge" v-if="variableCount > 0">
          🔗 {{ variableCount }} variable{{ variableCount > 1 ? 's' : '' }}
        </div>
        <div class="preview-text" v-html="previewText"></div>
      </div>
      
      <div v-if="data.variables && data.variables.length > 0" class="variables-list">
        <div class="variables-header">Available Variables:</div>
        <div class="variable-chips">
          <div v-for="(variable, idx) in data.variables" :key="idx" class="variable-chip">
            {{ variable.key }}: {{ variable.value }}
          </div>
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
.dynamic-text-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 300px;
  max-width: 450px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
}

.dynamic-text-node:hover {
  box-shadow: 0 8px 24px rgba(255, 193, 7, 0.15);
  transform: translateY(-2px);
}

.dynamic-text-node.selected {
  border-color: #ffc107;
  box-shadow: 0 8px 32px rgba(255, 193, 7, 0.25);
}

.node-icon {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ffc107 0%, #ffa000 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
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
  color: #ffc107;
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

.dynamic-preview {
  background: #fffbf0;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #ffc107;
  margin-bottom: 12px;
}

.variable-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #ffc107;
  color: #333;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 12px;
}

.preview-text {
  font-size: 14px;
  color: #424242;
  line-height: 1.6;
}

.preview-text :deep(.variable-highlight) {
  background: linear-gradient(135deg, #ffc107 0%, #ffa000 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 13px;
}

.variables-list {
  background: #fff8e1;
  border-radius: 8px;
  padding: 12px;
}

.variables-header {
  font-size: 12px;
  font-weight: 700;
  color: #f57f17;
  margin-bottom: 8px;
}

.variable-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.variable-chip {
  padding: 6px 12px;
  background: white;
  border: 2px solid #ffc107;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  color: #f57f17;
}

.handle-target,
.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #ffc107 !important;
}

.handle-target:hover,
.handle-source:hover {
  background: #ffc107 !important;
}
</style>