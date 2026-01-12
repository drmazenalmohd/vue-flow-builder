// src/components/builder/TopBar.vue
<script setup lang="ts">
defineProps<{
  flowName: string;
  lastSaved?: string;
  hasUnsavedChanges: boolean;
}>();

defineEmits<{
  save: [];
  publish: [];
  undo: [];
  redo: [];
  rename: [];
}>();
</script>

<template>
  <div class="top-bar">
    <div class="left-section">
      <button class="back-btn" title="Back to flows">
        ← Flows
      </button>
      <div class="flow-name" @click="$emit('rename')">
        <span class="name-text">{{ flowName }}</span>
        <span class="edit-icon">✎</span>
      </div>
    </div>

    <div class="center-section">
      <div class="action-buttons">
        <button @click="$emit('undo')" class="action-btn" title="Undo (Ctrl+Z)">
          ↶
        </button>
        <button @click="$emit('redo')" class="action-btn" title="Redo (Ctrl+Y)">
          ↷
        </button>
      </div>
    </div>

    <div class="right-section">
      <div class="save-status" v-if="lastSaved">
        <span class="status-dot" :class="{ unsaved: hasUnsavedChanges }"></span>
        <span class="status-text">
          {{ hasUnsavedChanges ? 'Unsaved changes' : `Saved ${lastSaved}` }}
        </span>
      </div>
      
      <button @click="$emit('save')" class="save-btn">
        💾 Save
      </button>
      
      <button @click="$emit('publish')" class="publish-btn">
        🚀 Publish
      </button>
      
      <button class="more-btn">⋮</button>
    </div>
  </div>
</template>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.left-section,
.center-section,
.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.flow-name {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.flow-name:hover {
  background: #f5f5f5;
}

.name-text {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.edit-icon {
  font-size: 14px;
  color: #999;
  opacity: 0;
  transition: opacity 0.2s;
}

.flow-name:hover .edit-icon {
  opacity: 1;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  font-size: 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #f5f5f5;
  border-color: #2196f3;
  color: #2196f3;
}

.save-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
}

.status-dot.unsaved {
  background: #ff9800;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 13px;
  color: #666;
}

.save-btn,
.publish-btn,
.more-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn {
  background: #f5f5f5;
  color: #333;
}

.save-btn:hover {
  background: #e0e0e0;
}

.publish-btn {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.publish-btn:hover {
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
  transform: translateY(-1px);
}

.more-btn {
  background: transparent;
  color: #666;
  padding: 10px;
  font-size: 20px;
}

.more-btn:hover {
  background: #f5f5f5;
}
</style>