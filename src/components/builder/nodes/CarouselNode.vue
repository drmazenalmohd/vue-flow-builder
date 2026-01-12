// src/components/builder/nodes/CarouselNode.vue
<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref } from 'vue';

const props = defineProps<{
  id: string;
  selected?: boolean;
  data: {
    label: string;
    cards?: Array<{
      title: string;
      subtitle: string;
      imageUrl: string;
      buttons: Array<{ text: string; action: string }>;
    }>;
  };
}>();

const emit = defineEmits<{
  edit: [id: string];
  delete: [id: string];
  addCard: [id: string];
}>();

const isHovered = ref(false);
const currentCardIndex = ref(0);

const nextCard = () => {
  if (!props.data.cards) return;
  currentCardIndex.value = (currentCardIndex.value + 1) % props.data.cards.length;
};

const prevCard = () => {
  if (!props.data.cards) return;
  currentCardIndex.value = currentCardIndex.value === 0 
    ? props.data.cards.length - 1 
    : currentCardIndex.value - 1;
};
</script>

<template>
  <div 
    class="carousel-node" 
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
    
    <div class="node-icon">🎠</div>
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-label">{{ data.label }}</div>
        <div class="node-actions" v-show="isHovered || selected">
          <button @click="emit('edit', id)" class="node-btn edit-btn" title="Edit">✎</button>
          <button @click="emit('delete', id)" class="node-btn delete-btn" title="Delete">×</button>
        </div>
      </div>
      
      <div v-if="data.cards && data.cards.length > 0" class="carousel-preview">
        <div class="carousel-nav" v-if="data.cards.length > 1">
          <button @click="prevCard" class="nav-btn">←</button>
          <span class="card-indicator">{{ currentCardIndex + 1 }} / {{ data.cards.length }}</span>
          <button @click="nextCard" class="nav-btn">→</button>
        </div>
        
        <div class="card-preview">
          <div class="card-image">
            <img 
              :src="data.cards[currentCardIndex].imageUrl" 
              alt="Card image"
              @error="(e) => (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22><rect fill=%22%23ddd%22 width=%22200%22 height=%22150%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>Image</text></svg>'"
            />
          </div>
          <div class="card-content">
            <div class="card-title">{{ data.cards[currentCardIndex].title }}</div>
            <div class="card-subtitle">{{ data.cards[currentCardIndex].subtitle }}</div>
            <div class="card-buttons">
              <div 
                v-for="(button, btnIdx) in data.cards[currentCardIndex].buttons" 
                :key="btnIdx"
                class="card-button"
              >
                {{ button.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-carousel">
        <span class="empty-icon">🎠</span>
        <span class="empty-text">Click edit to add cards</span>
      </div>
      
      <button 
        v-show="isHovered || selected" 
        @click="emit('addCard', id)" 
        class="add-card-btn"
      >
        + Add Card
      </button>
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
.carousel-node {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-width: 320px;
  max-width: 400px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 2px solid transparent;
}

.carousel-node:hover {
  box-shadow: 0 8px 24px rgba(255, 87, 34, 0.15);
  transform: translateY(-2px);
}

.carousel-node.selected {
  border-color: #ff5722;
  box-shadow: 0 8px 32px rgba(255, 87, 34, 0.25);
}

.node-icon {
  position: absolute;
  top: -12px;
  left: 16px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(255, 87, 34, 0.3);
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
  color: #ff5722;
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

.carousel-preview {
  background: #fff3e0;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid #ff5722;
  margin-bottom: 12px;
}

.carousel-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #ff5722;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #e64a19;
  transform: scale(1.1);
}

.card-indicator {
  font-size: 12px;
  font-weight: 600;
  color: #ff5722;
}

.card-preview {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 6px;
}

.card-subtitle {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.card-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-button {
  padding: 8px 12px;
  background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.empty-carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #fff3e0;
  border-radius: 8px;
  border: 2px dashed #ff5722;
  margin-bottom: 12px;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 13px;
  color: #ff5722;
  font-weight: 600;
}

.add-card-btn {
  width: 100%;
  padding: 8px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  background: transparent;
  color: #757575;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-card-btn:hover {
  border-color: #ff5722;
  color: #ff5722;
  background: #fff3e0;
}

.handle-target,
.handle-source {
  width: 14px !important;
  height: 14px !important;
  background: white !important;
  border: 3px solid #ff5722 !important;
}

.handle-target:hover,
.handle-source:hover {
  background: #ff5722 !important;
}
</style>