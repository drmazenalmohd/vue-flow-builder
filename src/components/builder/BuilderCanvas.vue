<script setup lang="ts">
import { ref, computed } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import type { Connection, Edge } from '@vue-flow/core';
import StartNode from './nodes/StartNode.vue';
import MessageNode from './nodes/MessageNode.vue';
import QuestionNode from './nodes/QuestionNode.vue';
import ActionNode from './nodes/ActionNode.vue';
import ApiNode from './nodes/ApiNode.vue';
import DelayNode from './nodes/DelayNode.vue';
import ConditionNode from './nodes/ConditionNode.vue';
import InputNode from './nodes/InputNode.vue';
import FormNode from './nodes/FormNode.vue';
import SetVariableNode from './nodes/SetVariableNode.vue';
import MediaMessageNode from './nodes/MediaMessageNode.vue';
import CarouselNode from './nodes/CarouselNode.vue';
import DynamicTextNode from './nodes/DynamicTextNode.vue';
import AdvancedConditionNode from './nodes/AdvancedConditionNode.vue';
import TagNode from './nodes/TagNode.vue';
import SegmentNode from './nodes/SegmentNode.vue';
import NodeSidebar from './NodeSidebar.vue';
import PropertiesPanel from './PropertiesPanel.vue';
import CanvasControls from './CanvasControls.vue';
import FlowValidator from './FlowValidator.vue';
import AnalyticsPanel from './AnalyticsPanel.vue';
import EditModal from './EditModal.vue';
import TopBar from './TopBar.vue';
import type { FlowData } from '../../types/nodes';
import { FlowCompiler, CompilationError } from '../../services/FlowCompiler';
import { flowApi, ApiError } from '../../api/flowApi';

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  question: QuestionNode,
  action: ActionNode,
  api: ApiNode,
  delay: DelayNode,
  condition: ConditionNode,
  input: InputNode,
  form: FormNode,
  variable: SetVariableNode,
  mediaMessage: MediaMessageNode,
  carousel: CarouselNode,
  dynamicText: DynamicTextNode,
  advancedCondition: AdvancedConditionNode,
  tag: TagNode,
  segment: SegmentNode,
};

const nodes = ref([
  {
    id: '1',
    type: 'start',
    position: { x: 400, y: 50 },
    data: { label: 'Start' },
  },
]);

const edges = ref<Edge[]>([]);
const isDarkMode = ref(false);
const selectedNodeId = ref<string | null>(null);
const flowName = ref('Get User phone number and consent for SMS');
const lastSaved = ref('just now');
const hasUnsavedChanges = ref(false);

const { addNodes, removeNodes, updateNode, fitView, zoomIn, zoomOut, getNodes, getEdges, setNodes, setEdges, getViewport, setViewport, addEdges } = useVueFlow();

// Flow Compiler instance
const compiler = new FlowCompiler();

let nodeId = 2;
let edgeId = 1;

const showModal = ref(false);
const editingNodeId = ref<string | null>(null);
const editingNodeType = ref<string | null>(null);
const currentValue = ref('');

const selectedNode = computed(() => {
  if (!selectedNodeId.value) return null;
  return nodes.value.find(n => n.id === selectedNodeId.value);
});

const onConnect = (params: Connection) => {
  const newEdge: Edge = {
    id: `e${edgeId++}`,
    source: params.source,
    target: params.target,
    sourceHandle: params.sourceHandle,
    targetHandle: params.targetHandle,
    type: 'smoothstep',
  };
  addEdges([newEdge]);
  hasUnsavedChanges.value = true;
};

const addMessageNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'message',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { label: 'Message', text: `Message ${nodeId - 1}` },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addQuestionNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'question',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { label: 'Question', question: `Question ${nodeId - 1}` },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addActionNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'action',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { label: 'Action', action: `Action ${nodeId - 1}` },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addApiNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'api',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { label: 'API Call', apiUrl: 'https://api.example.com' },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addDelayNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'delay',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { label: 'Delay', delay: 5 },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addConditionNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'condition',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { label: 'Condition', condition: 'if x > 10' },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addInputNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'input',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { 
      label: 'User Input', 
      inputType: 'text',
      placeholder: 'Enter your answer...',
      validation: 'Required field',
      saveToVariable: 'user_input'
    },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addFormNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'form',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { 
      label: 'Form', 
      formTitle: 'Contact Form',
      fields: [
        { name: 'Name', type: 'text', required: true, placeholder: 'Enter your name' },
        { name: 'Email', type: 'email', required: true, placeholder: 'Enter your email' },
      ]
    },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addVariableNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'variable',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { 
      label: 'Set Variable', 
      variableName: 'user_name',
      variableValue: '{{input}}',
      operation: 'set'
    },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addMediaMessageNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'mediaMessage',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { 
      label: 'Media Message', 
      text: 'Check out this amazing content!',
      mediaType: 'image',
      mediaUrl: 'https://via.placeholder.com/400x300',
      buttons: [
        { text: 'Learn More', action: 'learn_more' },
        { text: 'Contact Us', action: 'contact' }
      ]
    },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addCarouselNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'carousel',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { 
      label: 'Carousel', 
      cards: [
        {
          title: 'Product 1',
          subtitle: 'Amazing product description',
          imageUrl: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Product+1',
          buttons: [
            { text: 'Buy Now', action: 'buy_1' },
            { text: 'More Info', action: 'info_1' }
          ]
        },
        {
          title: 'Product 2',
          subtitle: 'Another great product',
          imageUrl: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Product+2',
          buttons: [
            { text: 'Buy Now', action: 'buy_2' },
            { text: 'More Info', action: 'info_2' }
          ]
        },
        {
          title: 'Product 3',
          subtitle: 'The best product ever',
          imageUrl: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Product+3',
          buttons: [
            { text: 'Buy Now', action: 'buy_3' },
            { text: 'More Info', action: 'info_3' }
          ]
        }
      ]
    },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addDynamicTextNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'dynamicText',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { 
      label: 'Dynamic Text', 
      text: 'Hello {{first_name}}, your order {{order_id}} is ready!',
      variables: [
        { key: 'first_name', value: 'John' },
        { key: 'order_id', value: '#12345' }
      ]
    },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addAdvancedConditionNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'advancedCondition',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { 
      label: 'Advanced Condition', 
      matchType: 'all',
      conditions: [
        { field: 'age', operator: 'greater_than', value: '18', logic: 'AND' },
        { field: 'country', operator: 'equals', value: 'USA', logic: 'AND' },
        { field: 'email', operator: 'contains', value: '@gmail.com' }
      ]
    },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addTagNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'tag',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { 
      label: 'Tag Manager', 
      action: 'add',
      tags: ['VIP', 'Premium', 'Newsletter']
    },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const addSegmentNode = () => {
  const newNode = {
    id: nodeId.toString(),
    type: 'segment',
    position: { x: 400, y: 150 + (nodeId - 2) * 120 },
    data: { 
      label: 'User Segment', 
      segmentName: 'Premium Users',
      criteria: [
        { type: 'location', value: 'United States' },
        { type: 'age', value: '25-45' },
        { type: 'tag', value: 'Premium' }
      ]
    },
  };
  addNodes([newNode]);
  nodeId++;
  hasUnsavedChanges.value = true;
};

const handleEdit = (id: string) => {
  const node = nodes.value.find(n => n.id === id);
  if (node) {
    editingNodeId.value = id;
    editingNodeType.value = node.type || null;
    currentValue.value = node.data.text || node.data.question || node.data.action || node.data.apiUrl || node.data.delay || node.data.condition || '';
    showModal.value = true;
  }
};

const handleDelete = (id: string) => {
  removeNodes([id]);
  if (selectedNodeId.value === id) {
    selectedNodeId.value = null;
  }
  hasUnsavedChanges.value = true;
};

const handleSave = (value: string) => {
  if (editingNodeId.value) {
    const node = nodes.value.find(n => n.id === editingNodeId.value);
    if (node) {
      const fieldName = node.type === 'message' ? 'text' : 
                       node.type === 'question' ? 'question' :
                       node.type === 'action' ? 'action' :
                       node.type === 'api' ? 'apiUrl' :
                       node.type === 'delay' ? 'delay' : 'condition';
      
      updateNode(editingNodeId.value, {
        data: {
          ...node.data,
          [fieldName]: fieldName === 'delay' ? Number(value) : value,
        },
      });
      hasUnsavedChanges.value = true;
    }
  }
  showModal.value = false;
  editingNodeId.value = null;
};

const handleCloseModal = () => {
  showModal.value = false;
  editingNodeId.value = null;
};

const handleNodeClick = (event: any) => {
  selectedNodeId.value = event.node.id;
};

const handlePaneClick = () => {
  selectedNodeId.value = null;
};

const handlePropertiesUpdate = (nodeId: string, data: any) => {
  updateNode(nodeId, { data });
  hasUnsavedChanges.value = true;
};

const saveFlow = () => {
  try {
    const flowData: FlowData = {
      nodes: getNodes.value,
      edges: getEdges.value,
      viewport: getViewport.value,
    };

    // Compile UI flow to executable format
    const executableFlow = compiler.compile(flowData, {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user-id',
      status: 'draft',
      tags: [],
    });

    // Save BOTH formats (UI + Executable)
    const saveData = {
      ui: flowData,
      executable: JSON.parse(compiler.exportJSON(executableFlow)),
      metadata: {
        flowName: flowName.value,
        savedAt: new Date().toISOString(),
        version: '1.0.0',
      },
    };

    const dataStr = JSON.stringify(saveData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flow-${flowName.value.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    console.log('✅ Flow compiled successfully:', executableFlow);
    return true;
  } catch (error) {
    if (error instanceof CompilationError) {
      const errorMessages = error.errors?.map(e => `• ${e.message}`).join('\n') || error.message;
      alert(`❌ Flow Validation Failed:\n\n${errorMessages}\n\nPlease fix these errors before saving.`);
    } else {
      alert(`❌ Error saving flow: ${(error as Error).message}`);
    }
    console.error('Compilation error:', error);
    return false;
  }
};

const handleSaveFlow = () => {
  const success = saveFlow();
  if (success) {
    lastSaved.value = 'just now';
    hasUnsavedChanges.value = false;
  }
};

const handlePublish = async () => {
  try {
    const flowData: FlowData = {
      nodes: getNodes.value,
      edges: getEdges.value,
      viewport: getViewport.value,
    };

    // Compile flow
    const executableFlow = compiler.compile(flowData, {
      name: flowName.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      createdBy: 'current-user-id',
      status: 'published',
      tags: [],
    });

    console.log('📦 Compiled flow for publishing:', executableFlow);

    // Try to send to backend API
    try {
      const response = await flowApi.createFlow({
        flow: executableFlow,
        ui: flowData,
      });

      alert(
        `✅ Flow Published Successfully!\n\n` +
        `Flow ID: ${response.id}\n` +
        `Version: ${response.version}\n` +
        `Status: ${response.status}\n` +
        `Nodes: ${Object.keys(executableFlow.nodes).length}\n\n` +
        `Your flow is now live!`
      );

      lastSaved.value = 'just now';
      hasUnsavedChanges.value = false;
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        // Backend is not available or returned error
        if (apiError.status === 0) {
          // Network error - backend not running
          console.warn('Backend not available, showing preview instead');
          alert(
            `⚠️ Backend API Not Available\n\n` +
            `Flow compiled successfully but could not be published.\n\n` +
            `Flow ID: ${executableFlow.id}\n` +
            `Nodes: ${Object.keys(executableFlow.nodes).length}\n\n` +
            `To publish, start the backend server and try again.`
          );
        } else {
          // Backend returned an error
          alert(
            `❌ Backend Error (${apiError.status})\n\n` +
            `${apiError.message}\n\n` +
            `Please check backend logs for details.`
          );
        }
      } else {
        throw apiError;
      }
    }
  } catch (error) {
    if (error instanceof CompilationError) {
      const errorMessages = error.errors?.map(e => `• ${e.message}`).join('\n') || error.message;
      alert(`❌ Cannot Publish - Validation Failed:\n\n${errorMessages}\n\nPlease fix these errors first.`);
    } else {
      alert(`❌ Error publishing flow: ${(error as Error).message}`);
    }
    console.error('Publish error:', error);
  }
};

const handleUndo = () => {
  alert('Undo - Coming soon!');
};

const handleRedo = () => {
  alert('Redo - Coming soon!');
};

const handleRename = () => {
  const newName = prompt('Enter flow name:', flowName.value);
  if (newName) flowName.value = newName;
};

const loadFlow = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const flowData: FlowData = JSON.parse(event.target.result);
        setNodes(flowData.nodes);
        setEdges(flowData.edges);
        if (flowData.viewport) {
          setViewport(flowData.viewport);
        }
        nodeId = Math.max(...flowData.nodes.map(n => parseInt(n.id))) + 1;
        edgeId = Math.max(...flowData.edges.map(e => parseInt(e.id.replace('e', '')))) + 1;
      } catch (error) {
        alert('Error loading flow file');
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

const autoLayout = () => {
  let yOffset = 50;
  const xCenter = 400;
  
  const layoutedNodes = getNodes.value.map((node) => {
    const newNode = {
      ...node,
      position: {
        x: xCenter,
        y: yOffset,
      },
    };
    yOffset += 150;
    return newNode;
  });

  setNodes(layoutedNodes);
  setTimeout(() => {
    fitView({ padding: 0.2 });
  }, 0);
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};
</script>

<template>
  <div class="builder-container" :class="{ 'dark-mode': isDarkMode }">
    <TopBar
      :flow-name="flowName"
      :last-saved="lastSaved"
      :has-unsaved-changes="hasUnsavedChanges"
      @save="handleSaveFlow"
      @publish="handlePublish"
      @undo="handleUndo"
      @redo="handleRedo"
      @rename="handleRename"
    />

    <PropertiesPanel
      :selected-node="selectedNode"
      @update="handlePropertiesUpdate"
    />
    
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      @connect="onConnect"
      @node:click="handleNodeClick"
      @pane:click="handlePaneClick"
      class="vue-flow-canvas"
    >
      <template #node-message="{ id, data, selected }">
        <MessageNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-question="{ id, data, selected }">
        <QuestionNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-action="{ id, data, selected }">
        <ActionNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-api="{ id, data, selected }">
        <ApiNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-delay="{ id, data, selected }">
        <DelayNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-condition="{ id, data, selected }">
        <ConditionNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-input="{ id, data, selected }">
        <InputNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-form="{ id, data, selected }">
        <FormNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-variable="{ id, data, selected }">
        <SetVariableNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-mediaMessage="{ id, data, selected }">
        <MediaMessageNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-carousel="{ id, data, selected }">
        <CarouselNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-dynamicText="{ id, data, selected }">
        <DynamicTextNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-advancedCondition="{ id, data, selected }">
        <AdvancedConditionNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-tag="{ id, data, selected }">
        <TagNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template #node-segment="{ id, data, selected }">
        <SegmentNode :id="id" :data="data" :selected="selected" @edit="handleEdit" @delete="handleDelete" />
      </template>
    </VueFlow>

    <FlowValidator :nodes="nodes" :edges="edges" />
    <AnalyticsPanel :nodes="nodes" :edges="edges" />
    
    <CanvasControls
      :is-dark="isDarkMode"
      @fit-view="fitView({ padding: 0.2 })"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @save-flow="handleSaveFlow"
      @load-flow="loadFlow"
      @auto-layout="autoLayout"
      @toggle-theme="toggleTheme"
    />
    
    <NodeSidebar
      @add-message-node="addMessageNode"
      @add-question-node="addQuestionNode"
      @add-action-node="addActionNode"
      @add-api-node="addApiNode"
      @add-delay-node="addDelayNode"
      @add-condition-node="addConditionNode"
      @add-input-node="addInputNode"
      @add-form-node="addFormNode"
      @add-variable-node="addVariableNode"
      @add-media-message-node="addMediaMessageNode"
      @add-carousel-node="addCarouselNode"
      @add-dynamic-text-node="addDynamicTextNode"
      @add-advanced-condition-node="addAdvancedConditionNode"
      @add-tag-node="addTagNode"
      @add-segment-node="addSegmentNode"
    />
    
    <EditModal
      :show="showModal"
      :node-id="editingNodeId"
      :node-type="editingNodeType"
      :current-value="currentValue"
      @close="handleCloseModal"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.builder-container {
  width: 100%;
  height: 100vh;
  position: relative;
  transition: background 0.3s;
}

.builder-container.dark-mode {
  background: #1a1a1a;
}

.vue-flow-canvas {
  width: calc(100% - 530px);
  margin-left: 280px;
  margin-top: 64px !important;
  height: calc(100vh - 64px) !important;
  background: #fafafa;
}

.builder-container.dark-mode .vue-flow-canvas {
  background: #2a2a2a;
}
</style>