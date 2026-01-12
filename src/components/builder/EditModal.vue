// src/components/builder/EditModal.vue
<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  nodeId: string | null;
  nodeType: string | null;
  currentValue: string;
}>();

const emit = defineEmits<{
  close: [];
  save: [value: string];
}>();

const inputValue = ref(props.currentValue);

watch(() => props.currentValue, (newVal) => {
  inputValue.value = newVal;
});

const handleSave = () => {
  emit('save', inputValue.value);
};

const getPlaceholder = () => {
  const placeholders: Record<string, string> = {
    message: 'Enter your message...',
    question: 'Enter your question...',
    action: 'Enter action description...',
    api: 'Enter API URL...',
    delay: 'Enter delay in seconds...',
    condition: 'Enter condition...',
  };
  return placeholders[props.nodeType || ''] || 'Enter text...';
};

const getTitle = () => {
  const titles: Record<string, string> = {
    message: 'Edit Message',
    question: 'Edit Question',
    action: 'Edit Action',
    api: 'Edit API Call',
    delay: 'Edit Delay',
    condition: 'Edit Condition',
  };
  return titles[props.nodeType || ''] || 'Edit Node';
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ getTitle() }}</h3>
        <button @click="emit('close')" class="close-btn">×</button>
      </div>
      <div class="modal-body">
        <input
          v-if="nodeType === 'delay'"
          v-model="inputValue"
          type="number"
          :placeholder="getPlaceholder()"
          class="modal-input"
        />
        <textarea
          v-else
          v-model="inputValue"
          :placeholder="getPlaceholder()"
          rows="4"
          class="modal-textarea"
        />
      </div>
      <div class="modal-footer">
        <button @click="emit('close')" class="cancel-btn">Cancel</button>
        <button @click="handleSave" class="save-btn">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f5f5f5;
}

.modal-body {
  padding: 20px;
}

.modal-input,
.modal-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

.modal-input:focus,
.modal-textarea:focus {
  outline: none;
  border-color: #2196f3;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn,
.save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  background: #2196f3;
  color: white;
}

.save-btn:hover {
  background: #1976d2;
}
</style>