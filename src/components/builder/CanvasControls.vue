// src/components/builder/CanvasControls.vue
<script setup lang="ts">
defineEmits<{
  fitView: [];
  zoomIn: [];
  zoomOut: [];
  saveFlow: [];
  loadFlow: [];
  autoLayout: [];
  toggleTheme: [];
}>();

defineProps<{
  isDark: boolean;
}>();
</script>

<template>
  <div class="canvas-controls">
    <div class="control-group">
      <button @click="$emit('zoomIn')" class="control-btn" title="Zoom In">
        ➕
      </button>
      <button @click="$emit('zoomOut')" class="control-btn" title="Zoom Out">
        ➖
      </button>
      <button @click="$emit('fitView')" class="control-btn" title="Fit View">
        ⛶
      </button>
    </div>

    <div class="control-group">
      <button @click="$emit('autoLayout')" class="control-btn" title="Auto Layout">
        📐
      </button>
      <button @click="$emit('toggleTheme')" class="control-btn" title="Toggle Theme">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </div>

    <div class="control-group">
      <button @click="$emit('saveFlow')" class="control-btn save-btn" title="Save Flow">
        💾 Save
      </button>
      <button @click="$emit('loadFlow')" class="control-btn load-btn" title="Load Flow">
        📂 Load
      </button>
    </div>
  </div>
</template>

<style scoped>
.canvas-controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 12px;
  z-index: 100;
}

.control-group {
  display: flex;
  gap: 8px;
  padding: 0 8px;
  border-right: 1px solid #e0e0e0;
}

.control-group:last-child {
  border-right: none;
}

.control-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  font-weight: 600;
}

.control-btn:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
}

.control-btn:active {
  transform: translateY(0);
}

.save-btn {
  background: #4caf50;
  color: white;
}

.save-btn:hover {
  background: #45a049;
}

.load-btn {
  background: #2196f3;
  color: white;
}

.load-btn:hover {
  background: #1976d2;
}
</style>