// src/components/builder/FlowValidator.vue
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  nodes: any[];
  edges: any[];
}>();

const issues = computed(() => {
  const problems: string[] = [];

  const disconnectedNodes = props.nodes.filter(node => {
    if (node.type === 'start') return false;
    const hasIncoming = props.edges.some(edge => edge.target === node.id);
    return !hasIncoming;
  });

  if (disconnectedNodes.length > 0) {
    problems.push(`${disconnectedNodes.length} disconnected node(s)`);
  }

  const loops = detectLoops();
  if (loops) {
    problems.push('Potential infinite loop detected');
  }

  const emptyNodes = props.nodes.filter(node => {
    if (node.type === 'start') return false;
    const data = node.data;
    return !data.text && !data.question && !data.action && !data.apiUrl && !data.delay && !data.condition;
  });

  if (emptyNodes.length > 0) {
    problems.push(`${emptyNodes.length} empty node(s)`);
  }

  return problems;
});

const detectLoops = () => {
  const visited = new Set();
  const recursionStack = new Set();

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const outgoingEdges = props.edges.filter(edge => edge.source === nodeId);

    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        if (dfs(edge.target)) return true;
      } else if (recursionStack.has(edge.target)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  const startNode = props.nodes.find(n => n.type === 'start');
  if (startNode) {
    return dfs(startNode.id);
  }

  return false;
};

const isValid = computed(() => issues.value.length === 0);
</script>

<template>
  <div class="validator" :class="{ valid: isValid, invalid: !isValid }">
    <div class="validator-header">
      <span class="status-icon">{{ isValid ? '✅' : '⚠️' }}</span>
      <span class="status-text">{{ isValid ? 'Flow Valid' : 'Issues Found' }}</span>
    </div>
    <div v-if="!isValid" class="issues-list">
      <div v-for="(issue, index) in issues" :key="index" class="issue-item">
        • {{ issue }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.validator {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  padding: 12px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 200px;
}

.validator.valid {
  border: 2px solid #4caf50;
}

.validator.invalid {
  border: 2px solid #ff9800;
}

.validator-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  font-size: 18px;
}

.status-text {
  font-weight: 600;
  font-size: 14px;
}

.issues-list {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e0e0e0;
}

.issue-item {
  font-size: 13px;
  color: #666;
  margin: 4px 0;
}
</style>