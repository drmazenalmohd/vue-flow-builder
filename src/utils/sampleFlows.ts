// ============================================================================
// SAMPLE FLOWS - For testing backend integration
// ============================================================================

import type { ExecutableFlow } from '../models/execution/schema';

/**
 * Sample 1: Simple Welcome Flow
 * Start → Message → End
 */
export const simpleWelcomeFlow: ExecutableFlow = {
  id: 'sample-welcome-001',
  version: 1,
  name: 'Simple Welcome Flow',
  description: 'Basic welcome message flow for testing',
  metadata: {
    name: 'Simple Welcome Flow',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    status: 'published',
    tags: ['sample', 'welcome'],
  },
  entryNodeId: 'start-1',
  nodes: {
    'start-1': {
      id: 'start-1',
      type: 'start',
      config: {} as any,
      transitions: [
        {
          id: 't1',
          targetNodeId: 'message-1',
          priority: 0,
        },
      ],
    },
    'message-1': {
      id: 'message-1',
      type: 'message',
      config: {
        content: 'Welcome to Airochat! How can I help you today?',
        contentType: 'text',
      },
      transitions: [
        {
          id: 't2',
          targetNodeId: 'end-1',
          priority: 0,
        },
      ],
    },
    'end-1': {
      id: 'end-1',
      type: 'end',
      config: {
        reason: 'completed',
        message: 'Thank you for using our service!',
      },
      transitions: [],
    },
  },
  config: {
    timeoutSeconds: 3600,
    maxIterations: 100,
    errorBehavior: 'fail',
    variables: [],
  },
};

/**
 * Sample 2: Lead Capture Flow
 * Start → Question (Name) → Question (Email) → Message → End
 */
export const leadCaptureFlow: ExecutableFlow = {
  id: 'sample-lead-capture-002',
  version: 1,
  name: 'Lead Capture Flow',
  description: 'Collects user name and email',
  metadata: {
    name: 'Lead Capture Flow',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    status: 'published',
    tags: ['sample', 'lead-capture'],
  },
  entryNodeId: 'start-1',
  nodes: {
    'start-1': {
      id: 'start-1',
      type: 'start',
      config: {} as any,
      transitions: [{ id: 't1', targetNodeId: 'question-name', priority: 0 }],
    },
    'question-name': {
      id: 'question-name',
      type: 'question',
      config: {
        question: 'What is your name?',
        expectedInputType: 'text',
        saveToVariable: 'user_name',
        maxRetries: 3,
      },
      transitions: [{ id: 't2', targetNodeId: 'question-email', priority: 0 }],
    },
    'question-email': {
      id: 'question-email',
      type: 'question',
      config: {
        question: 'What is your email address?',
        expectedInputType: 'email',
        saveToVariable: 'user_email',
        validationRegex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        validationMessage: 'Please enter a valid email address.',
        maxRetries: 3,
      },
      transitions: [{ id: 't3', targetNodeId: 'message-thanks', priority: 0 }],
    },
    'message-thanks': {
      id: 'message-thanks',
      type: 'message',
      config: {
        content: 'Thank you, {{user_name}}! We will contact you at {{user_email}}.',
        contentType: 'text',
      },
      transitions: [{ id: 't4', targetNodeId: 'end-1', priority: 0 }],
    },
    'end-1': {
      id: 'end-1',
      type: 'end',
      config: {
        reason: 'completed',
      },
      transitions: [],
    },
  },
  config: {
    timeoutSeconds: 3600,
    maxIterations: 100,
    errorBehavior: 'fail',
    variables: [
      { name: 'user_name', type: 'string', required: true },
      { name: 'user_email', type: 'string', required: true },
    ],
  },
};

/**
 * Sample 3: Support Ticket Flow with Branching
 * Start → Question (Issue Type) → Condition → Branch to different handlers
 */
export const supportTicketFlow: ExecutableFlow = {
  id: 'sample-support-003',
  version: 1,
  name: 'Support Ticket Flow',
  description: 'Routes support tickets based on issue type',
  metadata: {
    name: 'Support Ticket Flow',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    status: 'published',
    tags: ['sample', 'support'],
  },
  entryNodeId: 'start-1',
  nodes: {
    'start-1': {
      id: 'start-1',
      type: 'start',
      config: {} as any,
      transitions: [{ id: 't1', targetNodeId: 'message-welcome', priority: 0 }],
    },
    'message-welcome': {
      id: 'message-welcome',
      type: 'message',
      config: {
        content: 'Welcome to support! Please select your issue type:',
        contentType: 'rich',
        buttons: [
          { id: 'btn-1', label: 'Technical Issue', action: 'reply', value: 'technical' },
          { id: 'btn-2', label: 'Billing Question', action: 'reply', value: 'billing' },
          { id: 'btn-3', label: 'General Inquiry', action: 'reply', value: 'general' },
        ],
      },
      transitions: [{ id: 't2', targetNodeId: 'question-issue', priority: 0 }],
    },
    'question-issue': {
      id: 'question-issue',
      type: 'question',
      config: {
        question: 'Please describe your issue:',
        expectedInputType: 'text',
        saveToVariable: 'issue_description',
        maxRetries: 3,
      },
      transitions: [{ id: 't3', targetNodeId: 'condition-routing', priority: 0 }],
    },
    'condition-routing': {
      id: 'condition-routing',
      type: 'condition',
      config: {
        expression: '{{issue_type}} == "technical"',
        evaluator: 'simple',
      },
      transitions: [
        {
          id: 't4-tech',
          targetNodeId: 'message-tech',
          condition: '{{issue_type}} == "technical"',
          priority: 0,
          label: 'Technical',
        },
        {
          id: 't4-billing',
          targetNodeId: 'message-billing',
          condition: '{{issue_type}} == "billing"',
          priority: 1,
          label: 'Billing',
        },
        {
          id: 't4-general',
          targetNodeId: 'message-general',
          priority: 2,
          label: 'General',
        },
      ],
    },
    'message-tech': {
      id: 'message-tech',
      type: 'message',
      config: {
        content: 'Our technical team will review your issue and respond within 24 hours.',
        contentType: 'text',
      },
      transitions: [{ id: 't5', targetNodeId: 'transfer-tech', priority: 0 }],
    },
    'transfer-tech': {
      id: 'transfer-tech',
      type: 'transfer_agent',
      config: {
        assignmentType: 'team',
        teamId: 1,
        message: 'Technical issue: {{issue_description}}',
        endFlow: true,
      },
      transitions: [],
    },
    'message-billing': {
      id: 'message-billing',
      type: 'message',
      config: {
        content: 'Our billing department will assist you shortly.',
        contentType: 'text',
      },
      transitions: [{ id: 't6', targetNodeId: 'transfer-billing', priority: 0 }],
    },
    'transfer-billing': {
      id: 'transfer-billing',
      type: 'transfer_agent',
      config: {
        assignmentType: 'team',
        teamId: 2,
        message: 'Billing question: {{issue_description}}',
        endFlow: true,
      },
      transitions: [],
    },
    'message-general': {
      id: 'message-general',
      type: 'message',
      config: {
        content: 'Thank you! A support agent will respond soon.',
        contentType: 'text',
      },
      transitions: [{ id: 't7', targetNodeId: 'end-1', priority: 0 }],
    },
    'end-1': {
      id: 'end-1',
      type: 'end',
      config: {
        reason: 'completed',
      },
      transitions: [],
    },
  },
  config: {
    timeoutSeconds: 7200,
    maxIterations: 100,
    errorBehavior: 'continue',
    variables: [
      { name: 'issue_type', type: 'string', required: true },
      { name: 'issue_description', type: 'string', required: true },
    ],
  },
};

/**
 * Sample 4: API Integration Flow
 * Start → Question (User ID) → API Call → Condition → Message
 */
export const apiIntegrationFlow: ExecutableFlow = {
  id: 'sample-api-004',
  version: 1,
  name: 'API Integration Flow',
  description: 'Demonstrates API call with conditional response',
  metadata: {
    name: 'API Integration Flow',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    status: 'published',
    tags: ['sample', 'api'],
  },
  entryNodeId: 'start-1',
  nodes: {
    'start-1': {
      id: 'start-1',
      type: 'start',
      config: {} as any,
      transitions: [{ id: 't1', targetNodeId: 'question-userid', priority: 0 }],
    },
    'question-userid': {
      id: 'question-userid',
      type: 'question',
      config: {
        question: 'Please enter your user ID:',
        expectedInputType: 'number',
        saveToVariable: 'user_id',
        maxRetries: 3,
      },
      transitions: [{ id: 't2', targetNodeId: 'api-getuser', priority: 0 }],
    },
    'api-getuser': {
      id: 'api-getuser',
      type: 'api',
      config: {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/users/{{user_id}}',
        headers: {},
        timeout: 5000,
        retries: 2,
        saveResponseTo: 'user_data',
        errorOnHttpError: true,
      },
      transitions: [
        {
          id: 't3-success',
          targetNodeId: 'message-success',
          condition: '{{_lastResult.status}} == "success"',
          priority: 0,
          label: 'Success',
        },
        {
          id: 't3-error',
          targetNodeId: 'message-error',
          condition: '{{_lastResult.status}} == "error"',
          priority: 1,
          label: 'Error',
        },
      ],
      retries: 2,
    },
    'message-success': {
      id: 'message-success',
      type: 'message',
      config: {
        content: 'Hello {{user_data.name}}! Your email is {{user_data.email}}.',
        contentType: 'text',
      },
      transitions: [{ id: 't4', targetNodeId: 'end-1', priority: 0 }],
    },
    'message-error': {
      id: 'message-error',
      type: 'message',
      config: {
        content: 'Sorry, we could not find a user with that ID.',
        contentType: 'text',
      },
      transitions: [{ id: 't5', targetNodeId: 'end-1', priority: 0 }],
    },
    'end-1': {
      id: 'end-1',
      type: 'end',
      config: {
        reason: 'completed',
      },
      transitions: [],
    },
  },
  config: {
    timeoutSeconds: 3600,
    maxIterations: 100,
    errorBehavior: 'continue',
    variables: [
      { name: 'user_id', type: 'number', required: true },
      { name: 'user_data', type: 'object', required: false },
    ],
  },
};

/**
 * All sample flows
 */
export const sampleFlows = {
  simpleWelcome: simpleWelcomeFlow,
  leadCapture: leadCaptureFlow,
  supportTicket: supportTicketFlow,
  apiIntegration: apiIntegrationFlow,
};

/**
 * Export as array for iteration
 */
export const sampleFlowsArray = Object.values(sampleFlows);
