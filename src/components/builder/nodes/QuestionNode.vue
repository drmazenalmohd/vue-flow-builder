// src/components/builder/nodes/QuestionNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    question?: string;
    yesLabel?: string;
    noLabel?: string;
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
    class="question-node" 
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
    
    <div class="node-icon">❓</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn">×</button>
        </div>
      </div>
      
      <div class="node-text">{{ data.question || 'Click to add question...' }}</div>
      
      <div class="choice-buttons">
        <div class="choice-item yes-choice">
          <div class="choice-label">{{ data.yesLabel || 'Yes' }}</div>
          <Handle 
            id="yes"
            type="source" 
            :position="Position.Bottom"
            :connectable="true"
            class="choice-handle yes-handle"
            style="left: 30%"
          />
        </div>
        <div class="choice-item no-choice">
          <div class="choice-label">{{ data.noLabel || 'No' }}</div>
          <Handle 
            id="no"
            type="source" 
            :position="Position.Bottom"
            :connectable="true"
            class="choice-handle no-handle"
            style="left: 70%"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 280px;
  max-width: 400px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
}

.question-node:hover {
  box-shadow: 0 8px 24px rgba(255, 152, 0, 0.15);
  transform: translateY(-2px);
}

.question-node.selected {
  border-color: #ff9800;
  box-shadow: 0 8px 32px rgba(255, 152, 0, 0.25);
}

.node-icon {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
}

.node-content {
  padding: 24px 16px 40px 16px;
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
  color: #ff9800;
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
  background: #fff3e0;
  border-radius: 8px;
  border-left: 3px solid #ff9800;
}

.choice-buttons {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0 20px;
}

.choice-item {
  position: relative;
}

.choice-label {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.yes-choice .choice-label {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
}

.no-choice .choice-label {
  background: linear-gradient(135deg, #f44336 0%, #da190b 100%);
}

.choice-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.choice-handle {
  width: 14px !important;
  height: 14px !important;
  bottom: -7px !important;
}

.yes-handle {
  background: white !important;
  border: 3px solid #4caf50 !important;
}

.yes-handle:hover {
  background: #4caf50 !important;
}

.no-handle {
  background: white !important;
  border: 3px solid #f44336 !important;
}

.no-handle:hover {
  background: #f44336 !important;
}

.handle-target {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #ff9800 !important;
}

.handle-target:hover {
  background: #ff9800 !important;
}
</style>