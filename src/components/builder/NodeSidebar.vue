<script setup lang="ts">
import { ref } from 'vue';

defineEmits<{
  addMessageNode: [];
  addQuestionNode: [];
  addActionNode: [];
  addApiNode: [];
  addDelayNode: [];
  addConditionNode: [];
  addInputNode: [];
  addFormNode: [];
  addVariableNode: [];
  addMediaMessageNode: [];
  addCarouselNode: [];
  addDynamicTextNode: [];
  addAdvancedConditionNode: [];
  addTagNode: [];
  addSegmentNode: [];
}>();

const searchQuery = ref('');

const nodeTypes = [
  // Basic Messaging
  { name: 'Message', icon: '💬', emit: 'addMessageNode', color: '#2196f3', category: 'basic' },
  { name: 'Media Message', icon: '🖼️', emit: 'addMediaMessageNode', color: '#9c27b0', category: 'rich' },
  { name: 'Carousel', icon: '🎠', emit: 'addCarouselNode', color: '#ff5722', category: 'rich' },
  { name: 'Dynamic Text', icon: '✨', emit: 'addDynamicTextNode', color: '#ffc107', category: 'rich' },
  { name: 'Question', icon: '❓', emit: 'addQuestionNode', color: '#ff9800', category: 'basic' },
  
  // Input & Data
  { name: 'User Input', icon: '✏️', emit: 'addInputNode', color: '#673ab7', category: 'input' },
  { name: 'Form', icon: '📋', emit: 'addFormNode', color: '#e91e63', category: 'input' },
  { name: 'Set Variable', icon: '💾', emit: 'addVariableNode', color: '#4caf50', category: 'data' },
  
  // Logic & Conditions
  { name: 'Condition', icon: '🔀', emit: 'addConditionNode', color: '#ff5722', category: 'logic' },
  { name: 'Smart Condition', icon: '🧠', emit: 'addAdvancedConditionNode', color: '#2196f3', category: 'logic' },
  { name: 'Tag Manager', icon: '🏷️', emit: 'addTagNode', color: '#9c27b0', category: 'logic' },
  { name: 'User Segment', icon: '👥', emit: 'addSegmentNode', color: '#3f51b5', category: 'logic' },
  
  // Actions & Integration
  { name: 'Action', icon: '⚡', emit: 'addActionNode', color: '#9c27b0', category: 'action' },
  { name: 'API Call', icon: '🌐', emit: 'addApiNode', color: '#00bcd4', category: 'integration' },
  { name: 'Delay', icon: '⏱️', emit: 'addDelayNode', color: '#607d8b', category: 'action' },
];

const filteredNodes = ref(nodeTypes);

const handleSearch = () => {
  const query = searchQuery.value.toLowerCase();
  filteredNodes.value = nodeTypes.filter(node =>
    node.name.toLowerCase().includes(query) ||
    node.category.toLowerCase().includes(query)
  );
};
</script>

<template>
  <div class="node-sidebar">
    <h3>🎨 Node Library</h3>
    
    <div class="search-box">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="🔍 Search nodes..."
        class="search-input"
      />
    </div>

    <div class="node-buttons">
      <button
        v-for="node in filteredNodes"
        :key="node.name"
        @click="$emit(node.emit)"
        class="add-node-btn"
        :style="{ background: node.color }"
        :title="`${node.category} - ${node.name}`"
      >
        <span class="btn-icon">{{ node.icon }}</span>
        <span class="btn-text">{{ node.name }}</span>
      </button>
    </div>

    <div v-if="filteredNodes.length === 0" class="no-results">
      <div class="no-results-icon">🔍</div>
      <div class="no-results-text">No nodes found</div>
    </div>
    
    <div class="sidebar-footer">
      <div class="stats">
        {{ filteredNodes.length }} node{{ filteredNodes.length !== 1 ? 's' : '' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.node-sidebar {
  position: fixed;
  right: 0;
  top: 64px;
  width: 250px;
  height: calc(100vh - 64px);
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  padding: 20px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.search-box {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.node-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.add-node-btn {
  width: 100%;
  padding: 12px 16px;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 18px;
}

.btn-text {
  flex: 1;
  text-align: left;
}

.add-node-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.add-node-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.no-results-text {
  font-size: 14px;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.stats {
  text-align: center;
  font-size: 12px;
  color: #666;
  font-weight: 600;
}
</style>