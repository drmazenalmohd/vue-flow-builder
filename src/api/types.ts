// ============================================================================
// API TYPES - Frontend ↔ Backend Contracts
// ============================================================================

import type { ExecutableFlow, ValidationError, ValidationWarning } from '../models/execution/schema';
import type { FlowData } from '../types/nodes';

// ============================================================================
// Flow Management API
// ============================================================================

/**
 * POST /api/v1/flows
 * Create or update flow
 */
export interface CreateFlowRequest {
  flow: ExecutableFlow;
  ui?: FlowData; // Optional: for re-editing in builder
}

export interface CreateFlowResponse {
  id: string;
  version: number;
  status: 'draft' | 'published';
  createdAt: string;
  message?: string;
}

/**
 * GET /api/v1/flows/:id
 * Get flow by ID
 */
export interface GetFlowResponse {
  flow: ExecutableFlow;
  ui?: FlowData;
  metadata: FlowMetadataResponse;
}

export interface FlowMetadataResponse {
  executions: number;
  successRate: number;
  avgDuration: number;
  lastExecutedAt?: string;
}

/**
 * POST /api/v1/flows/:id/validate
 * Validate flow before publishing
 */
export interface ValidateFlowRequest {
  flow: ExecutableFlow;
}

export interface ValidateFlowResponse {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

/**
 * POST /api/v1/flows/:id/publish
 * Publish flow to Chatwoot inbox
 */
export interface PublishFlowRequest {
  inboxId: number;
  trigger: FlowTrigger;
}

export interface FlowTrigger {
  event: 'conversation_created' | 'message_received';
  conditions?: Record<string, any>;
}

export interface PublishFlowResponse {
  id: string;
  version: number;
  status: 'published';
  publishedAt: string;
  webhookUrl: string;
  inboxId: number;
}

/**
 * GET /api/v1/flows/:id/versions
 * List all versions of a flow
 */
export interface ListVersionsResponse {
  versions: FlowVersion[];
}

export interface FlowVersion {
  version: number;
  publishedAt: string;
  publishedBy: string;
  status: 'active' | 'deprecated';
  executions: number;
}

/**
 * DELETE /api/v1/flows/:id
 * Delete/archive a flow
 */
export interface DeleteFlowResponse {
  id: string;
  status: 'archived';
  archivedAt: string;
}

// ============================================================================
// Execution API
// ============================================================================

/**
 * POST /api/v1/flows/:id/execute
 * Manually trigger flow execution (for testing)
 */
export interface ExecuteFlowRequest {
  conversationId: number;
  testMode?: boolean;
  mockData?: MockExecutionData;
}

export interface MockExecutionData {
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  customAttributes?: Record<string, any>;
}

export interface ExecuteFlowResponse {
  executionId: string;
  status: 'running' | 'waiting_input' | 'completed';
  startedAt: string;
}

/**
 * GET /api/v1/executions/:execId
 * Get execution status and state
 */
export interface GetExecutionResponse {
  executionId: string;
  flowId: string;
  flowVersion: number;
  status: 'running' | 'waiting_input' | 'paused' | 'completed' | 'failed';
  currentNodeId: string;
  variables: Record<string, any>;
  messageHistory: ExecutionMessage[];
  startedAt: string;
  completedAt?: string;
  error?: ExecutionErrorResponse;
}

export interface ExecutionMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  content: string;
  timestamp: string;
}

export interface ExecutionErrorResponse {
  code: string;
  message: string;
  nodeId: string;
  recoverable: boolean;
}

/**
 * POST /api/v1/executions/:execId/input
 * Send user input to resume execution (for testing)
 */
export interface SendInputRequest {
  input: string;
}

export interface SendInputResponse {
  status: 'accepted';
  nextStatus: 'running' | 'waiting_input' | 'completed';
}

/**
 * DELETE /api/v1/executions/:execId
 * Cancel running execution
 */
export interface CancelExecutionResponse {
  status: 'cancelled';
  cancelledAt: string;
}

// ============================================================================
// Testing API
// ============================================================================

/**
 * POST /api/v1/flows/:id/test
 * Dry-run flow with mock data
 */
export interface TestFlowRequest {
  mockContext: MockExecutionData;
  mockInputs: MockInput[];
}

export interface MockInput {
  nodeId: string;
  input: string;
}

export interface TestFlowResponse {
  executionId: string;
  trace: ExecutionTrace[];
  finalStatus: 'completed' | 'failed';
  finalVariables: Record<string, any>;
  error?: ExecutionErrorResponse;
}

export interface ExecutionTrace {
  nodeId: string;
  nodeType: string;
  timestamp: string;
  result: {
    status: string;
    nextNodeId?: string;
  };
  messagesCreated: string[];
  variableChanges?: Record<string, any>;
}

// ============================================================================
// Error Responses
// ============================================================================

export interface ApiErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: any;
}

// ============================================================================
// Common Types
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorResponse;
}
