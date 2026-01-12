// src/components/builder/nodes/AdvancedConditionNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    conditions?: Array<{
      field: string;
      operator: string;
      value: string;
      logic?: 'AND' | 'OR';
    }>;
    matchType?: 'all' | 'any';
  };
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

const isHovered = ref(false);

const getOperatorSymbol = (operator: string) => {
  const symbols: Record<string, string> = {
    'equals': '=',
    'not_equals': '≠',
    'greater_than': '>',
    'less_than': '<',
    'contains': '⊃',
    'starts_with': '⊢',
    'ends_with': '⊣',
  };
  return symbols[operator] || operator;
};
</script>

<template>
  <div 
    class="advanced-condition-node" 
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
    
    <div class="node-icon">🧠</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn" title="Edit">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn" title="Delete">×</button>
        </div>
      </div>
      
      <div class="conditions-preview">
        <div class="match-type-badge">
          {{ data.matchType === 'all' ? 'Match ALL' : 'Match ANY' }}
        </div>
        
        <div v-if="data.conditions && data.conditions.length > 0" class="conditions-list">
          <div 
            v-for="(condition, index) in data.conditions" 
            :key="index" 
            class="condition-item"
          >
            <div class="condition-expression">
              <span class="condition-field">{{ condition.field }}</span>
              <span class="condition-operator">{{ getOperatorSymbol(condition.operator) }}</span>
              <span class="condition-value">{{ condition.value }}</span>
            </div>
            <div v-if="index < data.conditions.length - 1" class="logic-connector">
              {{ condition.logic || 'AND' }}
            </div>
          </div>
        </div>
        
        <div v-else class="empty-conditions">
          <span class="empty-icon">🧠</span>
          <span class="empty-text">Click edit to add conditions</span>
        </div>
      </div>
    </div>
    
    <Handle 
      type="source" 
      :position="Position.Bottom"
      id="true"
      :connectable="true"
      class="handle-source true-handle"
      style="left: 35%"
    />
    <Handle 
      type="source" 
      :position="Position.Bottom"
      id="false"
      :connectable="true"
      class="handle-source false-handle"
      style="left: 65%"
    />
    
    <div class="output-labels">
      <span class="true-label">✓ True</span>
      <span class="false-label">✗ False</span>
    </div>
  </div>
</template>

<style scoped>
.advanced-condition-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 320px;
  max-width: 450px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
  padding-bottom: 24px;
}

.advanced-condition-node:hover {
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.15);
  transform: translateY(-2px);
}

.advanced-condition-node.selected {
  border-color: #2196f3;
  box-shadow: 0 8px 32px rgba(33, 150, 243, 0.25);
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

.conditions-preview {
  background: #e3f2fd;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #2196f3;
}

.match-type-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #2196f3;
  color: white;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.conditions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.condition-item {
  background: white;
  border-radius: 8px;
  padding: 12px;
  border: 2px solid #bbdefb;
}

.condition-expression {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.condition-field {
  padding: 4px 10px;
  background: #2196f3;
  color: white;
  border-radius: 6px;
  font-weight: 700;
}

.condition-operator {
  padding: 4px 8px;
  background: #64b5f6;
  color: white;
  border-radius: 4px;
  font-weight: bold;
  font-size: 16px;
}

.condition-value {
  padding: 4px 10px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 6px;
  font-weight: 600;
  border: 2px solid #2196f3;
}

.logic-connector {
  margin: 8px 0;
  text-align: center;
  font-weight: 800;
  color: #2196f3;
  font-size: 12px;
  padding: 4px 0;
  border-top: 2px dashed #bbdefb;
  border-bottom: 2px dashed #bbdefb;
}

.empty-conditions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: white;
  border-radius: 8px;
  border: 2px dashed #bbdefb;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 13px;
  color: #2196f3;
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

.true-label {
  color: #4caf50;
}

.false-label {
  color: #f44336;
}

.handle-target {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #2196f3 !important;
}

.handle-target:hover {
  background: #2196f3 !important;
}

.true-handle {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #4caf50 !important;
}

.true-handle:hover {
  background: #4caf50 !important;
}

.false-handle {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #f44336 !important;
}

.false-handle:hover {
  background: #f44336 !important;
}
</style>