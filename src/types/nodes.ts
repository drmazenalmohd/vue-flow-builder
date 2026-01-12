// src/types/nodes.ts
export interface NodeData {
  label: string;
  text?: string;
  question?: string;
  action?: string;
  apiUrl?: string;
  delay?: number;
  condition?: string;
  buttons?: Array<{ text: string; action: string }>;
  
  // Input Node
  inputType?: 'text' | 'email' | 'phone' | 'number';
  placeholder?: string;
  validation?: string;
  saveToVariable?: string;
  
  // Form Node
  formTitle?: string;
  fields?: Array<{
    name: string;
    type: string;
    required: boolean;
    placeholder: string;
  }>;
  
  // Variable Node
  variableName?: string;
  variableValue?: string;
  operation?: 'set' | 'append' | 'increment';
  
  // Question Node
  yesLabel?: string;
  noLabel?: string;
  
  // Media Message Node
  mediaType?: 'image' | 'video' | 'gif';
  mediaUrl?: string;
  
  // Carousel Node
  cards?: Array<{
    title: string;
    subtitle: string;
    imageUrl: string;
    buttons: Array<{ text: string; action: string }>;
  }>;
  
  // Dynamic Text Node
  variables?: Array<{ key: string; value: string }>;
  
  // Advanced Condition Node
  conditions?: Array<{
    field: string;
    operator: string;
    value: string;
    logic?: 'AND' | 'OR';
  }>;
  matchType?: 'all' | 'any';
  
  // Tag Node
  tags?: Array<string>;
  
  // Segment Node
  segmentName?: string;
  criteria?: Array<{
    type: string;
    value: string;
  }>;
}

export type CustomNodeType = 'start' | 'message' | 'question' | 'action' | 'api' | 'delay' | 'condition' | 'input' | 'form' | 'variable' | 'mediaMessage' | 'carousel' | 'dynamicText' | 'advancedCondition' | 'tag' | 'segment';

export interface FlowData {
  nodes: any[];
  edges: any[];
  viewport: { x: number; y: number; zoom: number };
}