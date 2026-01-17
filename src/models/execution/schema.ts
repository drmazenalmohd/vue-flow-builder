// ============================================================================
// EXECUTION SCHEMA v1.0 - Backend Contract
// This is the canonical execution model for Airochat flows
// ============================================================================

/**
 * ExecutableFlow - The ONLY format the backend accepts
 * This is the compiled, validated, ready-to-run representation
 */
export interface ExecutableFlow {
  // Identity
  id: string;
  version: number;
  name: string;
  description?: string;

  // Execution metadata
  metadata: FlowMetadata;

  // Execution graph (NOT UI graph)
  entryNodeId: string;
  nodes: Record<string, ExecutableNode>;  // Map for serialization

  // Global configuration
  config: FlowConfig;
}

export interface FlowMetadata {
  name?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  chatwootInboxId?: number;
}

export interface FlowConfig {
  timeoutSeconds: number;
  maxIterations: number;
  errorBehavior: 'fail' | 'continue' | 'fallback';
  fallbackNodeId?: string;
  variables: VariableDefinition[];
}

export interface VariableDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  defaultValue?: any;
  required: boolean;
}

/**
 * ExecutableNode - Minimal runtime representation
 * NO UI properties allowed (position, color, size, etc.)
 */
export interface ExecutableNode {
  id: string;
  type: NodeType;
  config: NodeConfig;
  transitions: NodeTransition[];
  errorHandler?: ErrorHandler;
  timeout?: number;
  retries?: number;
}

export type NodeType =
  | 'start'
  | 'message'
  | 'question'
  | 'condition'
  | 'api'
  | 'delay'
  | 'action'
  | 'form'
  | 'variable'
  | 'tag'
  | 'segment'
  | 'transfer_agent'
  | 'end';

/**
 * NodeConfig - Polymorphic per node type
 */
export type NodeConfig =
  | MessageConfig
  | QuestionConfig
  | ConditionConfig
  | ApiConfig
  | DelayConfig
  | ActionConfig
  | FormConfig
  | VariableConfig
  | TagConfig
  | SegmentConfig
  | TransferAgentConfig
  | EndConfig;

export interface MessageConfig {
  content: string;
  contentType: 'text' | 'rich';
  richContent?: RichMessageContent;
  buttons?: MessageButton[];
}

export interface RichMessageContent {
  type: 'card' | 'carousel' | 'list';
  items: CardItem[];
}

export interface CardItem {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  buttons?: MessageButton[];
}

export interface MessageButton {
  id: string;
  label: string;
  action: 'reply' | 'url' | 'postback';
  value: string;
}

export interface QuestionConfig {
  question: string;
  expectedInputType: 'text' | 'number' | 'email' | 'phone' | 'date';
  saveToVariable: string;
  validationRegex?: string;
  validationMessage?: string;
  maxRetries: number;
}

export interface ConditionConfig {
  expression: string;
  evaluator: 'simple' | 'javascript';
}

export interface ApiConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  body?: string;
  auth?: {
    type: 'bearer' | 'basic' | 'apiKey';
    credentials: Record<string, string>;
  };
  timeout: number;
  retries: number;
  saveResponseTo: string;
  errorOnHttpError: boolean;
}

export interface DelayConfig {
  duration: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days';
}

export interface ActionConfig {
  actionType: 'update_contact' | 'add_label' | 'send_email' | 'webhook';
  parameters: Record<string, any>;
}

export interface FormConfig {
  fields: FormField[];
  submitButtonText: string;
  saveToVariable: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface VariableConfig {
  variableName: string;
  operation: 'set' | 'increment' | 'append';
  value: string;
}

export interface TagConfig {
  tagNames: string[];
  operation: 'add' | 'remove';
}

export interface SegmentConfig {
  segmentId: string;
  operation: 'add' | 'remove';
}

export interface TransferAgentConfig {
  assignmentType: 'round_robin' | 'specific_agent' | 'team';
  agentId?: number;
  teamId?: number;
  message?: string;
  endFlow: boolean;
}

export interface EndConfig {
  reason: 'completed' | 'user_cancelled' | 'error' | 'transferred';
  message?: string;
}

/**
 * NodeTransition - Routing logic
 */
export interface NodeTransition {
  id: string;
  targetNodeId: string;
  condition?: string;
  priority: number;
  label?: string;
}

/**
 * ErrorHandler - Per-node error handling
 */
export interface ErrorHandler {
  strategy: 'retry' | 'fallback' | 'fail' | 'ignore';
  retryCount?: number;
  retryDelay?: number;
  fallbackNodeId?: string;
  fallbackMessage?: string;
}

/**
 * ExecutionContext - Runtime state (for backend)
 */
export interface ExecutionContext {
  executionId: string;
  flowId: string;
  flowVersion: number;
  chatwoot: ChatwootContext;
  variables: Record<string, any>;
  messageHistory: ExecutionMessage[];
  currentNodeId: string;
  visitedNodes: string[];
  startedAt: string;
  lastActivityAt: string;
  state: 'running' | 'waiting_input' | 'paused' | 'completed' | 'failed';
  waitingFor?: WaitingState;
}

export interface ChatwootContext {
  conversationId: number;
  inboxId: number;
  contactId: number;
  contact: {
    name?: string;
    email?: string;
    phone?: string;
    customAttributes: Record<string, any>;
  };
  assignedAgentId?: number;
  labels: string[];
}

export interface WaitingState {
  type: 'user_input' | 'api_response' | 'delay';
  expectedInputType?: string;
  resumeAt?: string;
  saveResponseTo?: string;
}

export interface ExecutionMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * ExecutionResult - What a node returns after execution
 */
export interface ExecutionResult {
  status: 'success' | 'error' | 'waiting';
  nextNodeId?: string;
  actions: ExecutionAction[];
  variableUpdates?: Record<string, any>;
  error?: ExecutionError;
  waitingState?: WaitingState;
}

export interface ExecutionAction {
  type: 'send_message' | 'update_contact' | 'add_label' | 'assign_agent' | 'close_conversation';
  payload: any;
}

export interface ExecutionError {
  code: string;
  message: string;
  nodeId: string;
  recoverable: boolean;
  context?: Record<string, any>;
}

/**
 * Validation types
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  nodeId?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  nodeId?: string;
}
