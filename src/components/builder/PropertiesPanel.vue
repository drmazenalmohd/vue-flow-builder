<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  selectedNode: any;
}>();

const emit = defineEmits<{
  update: [nodeId: string, data: any];
}>();

const nodeData = computed(() => props.selectedNode?.data || {});

const getFieldLabel = (type: string) => {
  const labels: Record<string, string> = {
    message: 'Message Text',
    question: 'Question',
    action: 'Action Description',
    api: 'API URL',
    delay: 'Delay (seconds)',
    condition: 'Condition',
  };
  return labels[type] || 'Content';
};

const getFieldKey = (type: string) => {
  const keys: Record<string, string> = {
    message: 'text',
    question: 'question',
    action: 'action',
    api: 'apiUrl',
    delay: 'delay',
    condition: 'condition',
  };
  return keys[type] || 'text';
};

const updateField = (value: string | number) => {
  const key = getFieldKey(props.selectedNode.type);
  emit('update', props.selectedNode.id, {
    ...nodeData.value,
    [key]: value,
  });
};
</script>

<template>
  <div class="properties-panel">
    <div v-if="selectedNode" class="panel-content">
      <div class="panel-header">
        <h3>Properties</h3>
        <div class="node-type-badge" :data-type="selectedNode.type">
          {{ selectedNode.type }}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Node ID</label>
        <input
          type="text"
          :value="selectedNode.id"
          disabled
          class="form-input disabled"
        />
      </div>

      <div class="form-group">
        <label class="form-label">{{ getFieldLabel(selectedNode.type) }}</label>
        <input
          v-if="selectedNode.type === 'delay'"
          :value="nodeData[getFieldKey(selectedNode.type)]"
          @input="updateField(Number(($event.target as HTMLInputElement).value))"
          class="form-input"
          type="number"
          placeholder="Enter delay in seconds"
        />
        <textarea
          v-else
          :value="nodeData[getFieldKey(selectedNode.type)]"
          @input="updateField(($event.target as HTMLTextAreaElement).value)"
          class="form-textarea"
          rows="4"
          :placeholder="`Enter ${getFieldLabel(selectedNode.type).toLowerCase()}...`"
        />
      </div>

      <div class="form-group">
        <label class="form-label">Position</label>
        <div class="position-inputs">
          <div>
            <span class="pos-label">X:</span>
            <input
              type="number"
              :value="Math.round(selectedNode.position.x)"
              disabled
              class="form-input small disabled"
            />
          </div>
          <div>
            <span class="pos-label">Y:</span>
            <input
              type="number"
              :value="Math.round(selectedNode.position.y)"
              disabled
              class="form-input small disabled"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
      <p>Select a node to view properties</p>
    </div>
  </div>
</template>

<style scoped>
.properties-panel {
  position: fixed;
  left: 0;
  top: 64px;
  width: 280px;
  height: calc(100vh - 64px);
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  z-index: 10;
}

.panel-content {
  padding: 20px;
}

.panel-header {
  margin-bottom: 20px;
}

.panel-header h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.node-type-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
}

.node-type-badge[data-type="message"] {
  background: #2196f3;
}

.node-type-badge[data-type="question"] {
  background: #ff9800;
}

.node-type-badge[data-type="action"] {
  background: #9c27b0;
}

.node-type-badge[data-type="api"] {
  background: #00bcd4;
}

.node-type-badge[data-type="delay"] {
  background: #607d8b;
}

.node-type-badge[data-type="condition"] {
  background: #ff5722;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-textarea {
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2196f3;
}

.form-input.disabled {
  background: #e9ecef;
  cursor: not-allowed;
}

.form-input.small {
  width: 80px;
}

.position-inputs {
  display: flex;
  gap: 12px;
}

.position-inputs > div {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pos-label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  padding: 40px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>