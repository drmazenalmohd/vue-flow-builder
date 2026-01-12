// src/components/builder/nodes/SegmentNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    segmentName?: string;
    criteria?: Array<{
      type: string;
      value: string;
    }>;
  };
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const isHovered = ref(false);

const getCriteriaIcon = (type: string) => {
  const icons: Record<string, string> = {
    'location': '📍',
    'age': '🎂',
    'language': '🌐',
    'tag': '🏷️',
    'custom': '⚙️',
  };
  return icons[type] || '📊';
};
</script>

<template>
  <div 
    class="segment-node" 
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
    
    <div class="node-icon">👥</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn" title="Edit">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn" title="Delete">×</button>
        </div>
      </div>
      
      <div class="segment-preview">
        <div class="segment-name">
          {{ data.segmentName || 'Unnamed Segment' }}
        </div>
        
        <div v-if="data.criteria && data.criteria.length > 0" class="criteria-list">
          <div class="criteria-header">Criteria:</div>
          <div 
            v-for="(criterion, index) in data.criteria" 
            :key="index" 
            class="criterion-item"
          >
            <span class="criterion-icon">{{ getCriteriaIcon(criterion.type) }}</span>
            <span class="criterion-type">{{ criterion.type }}:</span>
            <span class="criterion-value">{{ criterion.value }}</span>
          </div>
        </div>
        
        <div v-else class="empty-criteria">
          <span class="empty-icon">👥</span>
          <span class="empty-text">Click edit to define segment</span>
        </div>
      </div>
    </div>
    
    <Handle 
      type="source" 
      :position="Position.Bottom"
      id="in_segment"
      :connectable="true"
      class="handle-source in-handle"
      style="left: 35%"
    />
    <Handle 
      type="source" 
      :position="Position.Bottom"
      id="not_in_segment"
      :connectable="true"
      class="handle-source out-handle"
      style="left: 65%"
    />
    
    <div class="output-labels">
      <span class="in-label">In Segment</span>
      <span class="out-label">Not In</span>
    </div>
  </div>
</template>

<style scoped>
.segment-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 300px;
  max-width: 420px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
  padding-bottom: 24px;
}

.segment-node:hover {
  box-shadow: 0 8px 24px rgba(63, 81, 181, 0.15);
  transform: translateY(-2px);
}

.segment-node.selected {
  border-color: #3f51b5;
  box-shadow: 0 8px 32px rgba(63, 81, 181, 0.25);
}

.node-icon {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3f51b5 0%, #303f9f 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(63, 81, 181, 0.3);
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
  color: #3f51b5;
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

.segment-preview {
  background: #e8eaf6;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #3f51b5;
}

.segment-name {
  font-size: 16px;
  font-weight: 700;
  color: #303f9f;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 2px solid #9fa8da;
}

.criteria-list {
  margin-top: 12px;
}

.criteria-header {
  font-size: 12px;
  font-weight: 700;
  color: #3f51b5;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.criterion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  margin-bottom: 6px;
  border: 1px solid #c5cae9;
}

.criterion-icon {
  font-size: 16px;
}

.criterion-type {
  font-size: 12px;
  font-weight: 700;
  color: #5c6bc0;
  text-transform: capitalize;
}

.criterion-value {
  font-size: 13px;
  color: #333;
  background: #e8eaf6;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
}

.empty-criteria {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: white;
  border-radius: 8px;
  border: 2px dashed #9fa8da;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 13px;
  color: #3f51b5;
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

.in-label {
  color: #4caf50;
}

.out-label {
  color: #f44336;
}

.handle-target {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #3f51b5 !important;
}

.handle-target:hover {
  background: #3f51b5 !important;
}

.in-handle {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #4caf50 !important;
}

.in-handle:hover {
  background: #4caf50 !important;
}

.out-handle {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #f44336 !important;
}

.out-handle:hover {
  background: #f44336 !important;
}
</style>