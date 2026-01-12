// src/components/builder/nodes/TagNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    action?: 'add' | 'remove' | 'check';
    tags?: Array<string>;
  };
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const isHovered = ref(false);

const getActionIcon = (action: string) => {
  const icons: Record<string, string> = {
    'add': '➕',
    'remove': '➖',
    'check': '🔍',
  };
  return icons[action] || '🏷️';
};

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    'add': '#4caf50',
    'remove': '#f44336',
    'check': '#2196f3',
  };
  return colors[action] || '#757575';
};
</script>

<template>
  <div 
    class="tag-node" 
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
    
    <div class="node-icon">🏷️</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn" title="Edit">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn" title="Delete">×</button>
        </div>
      </div>
      
      <div class="tag-preview">
        <div 
          class="action-badge"
          :style="{ background: getActionColor(data.action || 'add') }"
        >
          {{ getActionIcon(data.action || 'add') }} {{ data.action || 'add' }} tags
        </div>
        
        <div v-if="data.tags && data.tags.length > 0" class="tags-list">
          <div 
            v-for="(tag, index) in data.tags" 
            :key="index" 
            class="tag-chip"
            :style="{ borderColor: getActionColor(data.action || 'add') }"
          >
            {{ tag }}
          </div>
        </div>
        
        <div v-else class="empty-tags">
          <span class="empty-icon">🏷️</span>
          <span class="empty-text">Click edit to manage tags</span>
        </div>
      </div>
    </div>
    
    <Handle 
      v-if="data.action === 'check'"
      type="source" 
      :position="Position.Bottom"
      id="has_tag"
      :connectable="true"
      class="handle-source has-handle"
      style="left: 35%"
    />
    <Handle 
      v-if="data.action === 'check'"
      type="source" 
      :position="Position.Bottom"
      id="no_tag"
      :connectable="true"
      class="handle-source no-handle"
      style="left: 65%"
    />
    <Handle 
      v-else
      type="source" 
      :position="Position.Bottom"
      :connectable="true"
      class="handle-source"
    />
    
    <div v-if="data.action === 'check'" class="output-labels">
      <span class="has-label">Has Tag</span>
      <span class="no-label">No Tag</span>
    </div>
  </div>
</template>

<style scoped>
.tag-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 280px;
  max-width: 400px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
  padding-bottom: 8px;
}

.tag-node:hover {
  box-shadow: 0 8px 24px rgba(156, 39, 176, 0.15);
  transform: translateY(-2px);
}

.tag-node.selected {
  border-color: #9c27b0;
  box-shadow: 0 8px 32px rgba(156, 39, 176, 0.25);
}

.node-icon {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(156, 39, 176, 0.3);
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
  color: #9c27b0;
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

.tag-preview {
  background: #f3e5f5;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #9c27b0;
}

.action-badge {
  display: inline-block;
  padding: 6px 14px;
  color: white;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  padding: 8px 16px;
  background: white;
  border: 2px solid #9c27b0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #7b1fa2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tag-chip::before {
  content: '🏷️';
  font-size: 14px;
}

.empty-tags {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: white;
  border-radius: 8px;
  border: 2px dashed #ce93d8;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 13px;
  color: #9c27b0;
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

.has-label {
  color: #4caf50;
}

.no-label {
  color: #f44336;
}

.handle-target,
.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #9c27b0 !important;
}

.handle-target:hover,
.handle-source:hover {
  background: #9c27b0 !important;
}

.has-handle {
  border-color: #4caf50 !important;
}

.has-handle:hover {
  background: #4caf50 !important;
}

.no-handle {
  border-color: #f44336 !important;
}

.no-handle:hover {
  background: #f44336 !important;
}
</style>