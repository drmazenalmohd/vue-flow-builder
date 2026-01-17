// ============================================================================
// FLOW API CLIENT - Communicates with backend
// ============================================================================

import type { ExecutableFlow } from '../models/execution/schema';
import type {
  CreateFlowRequest,
  CreateFlowResponse,
  GetFlowResponse,
  ValidateFlowRequest,
  ValidateFlowResponse,
  PublishFlowRequest,
  PublishFlowResponse,
  ListVersionsResponse,
  DeleteFlowResponse,
  ExecuteFlowRequest,
  ExecuteFlowResponse,
  GetExecutionResponse,
  SendInputRequest,
  SendInputResponse,
  CancelExecutionResponse,
  TestFlowRequest,
  TestFlowResponse,
  ApiErrorResponse,
} from './types';

/**
 * API Configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_VERSION = 'v1';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Flow API Client
 */
export class FlowApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = `${baseUrl}/api/${API_VERSION}`;
  }

  /**
   * Generic request handler with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({
          error: 'Unknown Error',
          message: response.statusText,
        }));

        throw new ApiError(
          errorData.message,
          response.status,
          errorData.code,
          errorData.details
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or parsing errors
      throw new ApiError(
        `Network error: ${(error as Error).message}`,
        0,
        'NETWORK_ERROR'
      );
    }
  }

  // ========================================================================
  // Flow Management
  // ========================================================================

  /**
   * Create or update flow
   */
  async createFlow(request: CreateFlowRequest): Promise<CreateFlowResponse> {
    return this.request<CreateFlowResponse>('/flows', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get flow by ID
   */
  async getFlow(flowId: string): Promise<GetFlowResponse> {
    return this.request<GetFlowResponse>(`/flows/${flowId}`, {
      method: 'GET',
    });
  }

  /**
   * Validate flow
   */
  async validateFlow(
    flowId: string,
    request: ValidateFlowRequest
  ): Promise<ValidateFlowResponse> {
    return this.request<ValidateFlowResponse>(`/flows/${flowId}/validate`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Publish flow to Chatwoot
   */
  async publishFlow(
    flowId: string,
    request: PublishFlowRequest
  ): Promise<PublishFlowResponse> {
    return this.request<PublishFlowResponse>(`/flows/${flowId}/publish`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get flow versions
   */
  async getFlowVersions(flowId: string): Promise<ListVersionsResponse> {
    return this.request<ListVersionsResponse>(`/flows/${flowId}/versions`, {
      method: 'GET',
    });
  }

  /**
   * Delete/archive flow
   */
  async deleteFlow(flowId: string): Promise<DeleteFlowResponse> {
    return this.request<DeleteFlowResponse>(`/flows/${flowId}`, {
      method: 'DELETE',
    });
  }

  // ========================================================================
  // Execution
  // ========================================================================

  /**
   * Execute flow manually (for testing)
   */
  async executeFlow(
    flowId: string,
    request: ExecuteFlowRequest
  ): Promise<ExecuteFlowResponse> {
    return this.request<ExecuteFlowResponse>(`/flows/${flowId}/execute`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get execution status
   */
  async getExecution(executionId: string): Promise<GetExecutionResponse> {
    return this.request<GetExecutionResponse>(`/executions/${executionId}`, {
      method: 'GET',
    });
  }

  /**
   * Send input to resume execution
   */
  async sendExecutionInput(
    executionId: string,
    request: SendInputRequest
  ): Promise<SendInputResponse> {
    return this.request<SendInputResponse>(
      `/executions/${executionId}/input`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );
  }

  /**
   * Cancel execution
   */
  async cancelExecution(executionId: string): Promise<CancelExecutionResponse> {
    return this.request<CancelExecutionResponse>(`/executions/${executionId}`, {
      method: 'DELETE',
    });
  }

  // ========================================================================
  // Testing
  // ========================================================================

  /**
   * Test flow with mock data (dry-run)
   */
  async testFlow(
    flowId: string,
    request: TestFlowRequest
  ): Promise<TestFlowResponse> {
    return this.request<TestFlowResponse>(`/flows/${flowId}/test`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // ========================================================================
  // Health Check
  // ========================================================================

  /**
   * Check if API is reachable
   */
  async healthCheck(): Promise<{ status: string; version: string }> {
    return this.request<{ status: string; version: string }>('/health', {
      method: 'GET',
    });
  }
}

/**
 * Singleton instance
 */
export const flowApi = new FlowApiClient();

/**
 * Export error class for error handling
 */
export { ApiError };
