// src/components/builder/AnalyticsPanel.vue
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  nodes: any[];
  edges: any[];
}>();

const stats = computed(() => {
  const nodesByType: Record<string, number> = {};
  props.nodes.forEach(node => {
    const type = node.type || 'unknown';
    nodesByType[type] = (nodesByType[type] || 0) + 1;
  });

  return {
    totalNodes: props.nodes.length,
    totalEdges: props.edges.length,
    nodesByType,
  };
});
</script>

<template>
  <div class="analytics-panel">
    <h3>📊 Analytics</h3>
    
    <div class="stat-card">
      <div class="stat-value">{{ stats.totalNodes }}</div>
      <div class="stat-label">Total Nodes</div>
    </div>

    <div class="stat-card">
      <div class="stat-value">{{ stats.totalEdges }}</div>
      <div class="stat-label">Connections</div>
    </div>

    <div class="node-breakdown">
      <h4>Node Types</h4>
      <div v-for="(count, type) in stats.nodesByType" :key="type" class="type-stat">
        <span class="type-name">{{ type }}:</span>
        <span class="type-count">{{ count }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-panel {
  position: fixed;
  right: 260px;
  top: 80px;
  width: 180px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.node-breakdown {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
}

.type-stat {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
}

.type-name {
  color: #666;
  text-transform: capitalize;
}

.type-count {
  font-weight: 600;
  color: #333;
}
</style>