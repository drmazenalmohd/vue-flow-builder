// src/components/builder/nodes/FormNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    formTitle?: string;
    fields?: Array<{
      name: string;
      type: string;
      required: boolean;
      placeholder: string;
    }>;
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
    class="form-node" 
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
    
    <div class="node-icon">📋</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn" title="Edit">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn" title="Delete">×</button>
        </div>
      </div>
      
      <div class="form-preview">
        <div class="form-title">{{ data.formTitle || 'Contact Form' }}</div>
        
        <div v-if="data.fields && data.fields.length > 0" class="fields-list">
          <div v-for="(field, index) in data.fields" :key="index" class="field-item">
            <div class="field-header">
              <span class="field-name">{{ field.name }}</span>
              <span v-if="field.required" class="required-badge">*</span>
            </div>
            <div class="field-preview">
              <input 
                :type="field.type" 
                :placeholder="field.placeholder" 
                disabled
                class="preview-input"
              />
            </div>
          </div>
        </div>
        
        <div v-else class="empty-form">
          <span>Click edit to add form fields</span>
        </div>
        
        <button class="submit-preview" disabled>Submit</button>
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
.form-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 320px;
  max-width: 450px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
}

.form-node:hover {
  box-shadow: 0 8px 24px rgba(233, 30, 99, 0.15);
  transform: translateY(-2px);
}

.form-node.selected {
  border-color: #e91e63;
  box-shadow: 0 8px 32px rgba(233, 30, 99, 0.25);
}

.node-icon {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(233, 30, 99, 0.3);
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
  color: #e91e63;
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

.form-preview {
  background: #fff1f5;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #e91e63;
}

.form-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.field-item {
  background: white;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #f8bbd0;
}

.field-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.field-name {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.required-badge {
  color: #f44336;
  font-weight: bold;
}

.field-preview {
  margin-top: 6px;
}

.preview-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  background: #fafafa;
  color: #999;
}

.empty-form {
  padding: 32px;
  text-align: center;
  color: #999;
  font-size: 14px;
  background: white;
  border-radius: 6px;
  border: 2px dashed #f8bbd0;
  margin-bottom: 16px;
}

.submit-preview {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: not-allowed;
  opacity: 0.8;
}

.handle-target,
.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #e91e63 !important;
}

.handle-target:hover,
.handle-source:hover {
  background: #e91e63 !important;
}
</style>