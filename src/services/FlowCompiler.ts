// ============================================================================
// FLOW COMPILER - Transforms UI schema to Execution schema
// ============================================================================

import type { FlowData } from '../types/nodes';
import type {
  ExecutableFlow,
  ExecutableNode,
  NodeTransition,
  FlowMetadata,
  FlowConfig,
  ValidationResult,
  ValidationError,
  MessageConfig,
  QuestionConfig,
  ConditionConfig,
  ApiConfig,
  DelayConfig,
  ActionConfig,
  FormConfig,
  VariableConfig,
  TagConfig,
  SegmentConfig,
} from '../models/execution/schema';

export class CompilationError extends Error {
  constructor(message: string, public errors?: ValidationError[]) {
    super(message);
    this.name = 'CompilationError';
  }
}

interface NodeCompiler {
  compile(uiNode: any, edges: any[]): ExecutableNode;
}

export class FlowCompiler {
  /**
   * Main compilation entry point
   */
  compile(uiFlow: FlowData, metadata: FlowMetadata): ExecutableFlow {
    const validationResult = this.validatePreCompile(uiFlow);
    if (!validationResult.valid) {
      throw new CompilationError('Pre-compilation validation failed', validationResult.errors);
    }

    const executableNodes = this.compileNodes(uiFlow.nodes, uiFlow.edges);
    const entryNode = this.findEntryNode(executableNodes);

    const compiledFlow: ExecutableFlow = {
      id: crypto.randomUUID(),
      version: 1,
      name: metadata.name || 'Untitled Flow',
      description: metadata.description,
      metadata,
      entryNodeId: entryNode.id,
      nodes: Object.fromEntries(executableNodes.map(n => [n.id, n])),
      config: this.buildFlowConfig(uiFlow),
    };

    const runtimeValidation = this.validatePostCompile(compiledFlow);
    if (!runtimeValidation.valid) {
      throw new CompilationError('Post-compilation validation failed', runtimeValidation.errors);
    }

    return compiledFlow;
  }

  /**
   * VALIDATION STAGE 1: Pre-compilation
   */
  private validatePreCompile(uiFlow: FlowData): ValidationResult {
    const errors: ValidationError[] = [];

    // Check for exactly one start node
    const startNodes = uiFlow.nodes.filter(n => n.type === 'start');
    if (startNodes.length === 0) {
      errors.push({ code: 'NO_START_NODE', message: 'Flow must have exactly one Start node' });
    }
    if (startNodes.length > 1) {
      errors.push({ code: 'MULTIPLE_START_NODES', message: 'Flow has multiple Start nodes' });
    }

    // Check all nodes have valid types
    const validTypes = new Set([
      'start',
      'message',
      'question',
      'condition',
      'api',
      'delay',
      'action',
      'form',
      'variable',
      'tag',
      'segment',
      'input',
      'mediaMessage',
      'carousel',
      'dynamicText',
      'advancedCondition',
    ]);

    uiFlow.nodes.forEach(node => {
      if (!validTypes.has(node.type)) {
        errors.push({
          code: 'INVALID_NODE_TYPE',
          message: `Unknown node type: ${node.type}`,
          nodeId: node.id,
        });
      }
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * VALIDATION STAGE 2: Post-compilation
   */
  private validatePostCompile(flow: ExecutableFlow): ValidationResult {
    const errors: ValidationError[] = [];

    // Check for infinite loops
    const cycles = this.detectCycles(flow);
    if (cycles.length > 0) {
      cycles.forEach(cycle => {
        errors.push({
          code: 'INFINITE_LOOP',
          message: `Potential infinite loop detected: ${cycle.join(' → ')}`,
          nodeId: cycle[0],
        });
      });
    }

    // Check all transitions point to valid nodes
    Object.entries(flow.nodes).forEach(([nodeId, node]) => {
      node.transitions.forEach(transition => {
        if (!flow.nodes[transition.targetNodeId]) {
          errors.push({
            code: 'INVALID_TRANSITION',
            message: `Transition points to non-existent node: ${transition.targetNodeId}`,
            nodeId,
          });
        }
      });
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * Compile all nodes
   */
  private compileNodes(uiNodes: any[], uiEdges: any[]): ExecutableNode[] {
    return uiNodes.map(uiNode => {
      const compiler = NODE_COMPILERS[uiNode.type];
      if (!compiler) {
        // Default compiler for unsupported types
        return this.defaultCompile(uiNode, uiEdges);
      }
      return compiler.compile(uiNode, uiEdges);
    });
  }

  /**
   * Default compiler for nodes without specific compiler
   */
  private defaultCompile(uiNode: any, uiEdges: any[]): ExecutableNode {
    return {
      id: uiNode.id,
      type: uiNode.type as any,
      config: uiNode.data as any,
      transitions: this.compileEdgesToTransitions(uiEdges, uiNode.id),
    };
  }

  /**
   * Convert edges to transitions
   */
  private compileEdgesToTransitions(uiEdges: any[], sourceNodeId: string): NodeTransition[] {
    return uiEdges
      .filter(edge => edge.source === sourceNodeId)
      .map((edge, index) => ({
        id: edge.id,
        targetNodeId: edge.target,
        condition: edge.sourceHandle ? this.handleToCondition(edge.sourceHandle) : undefined,
        priority: index,
        label: edge.label || edge.sourceHandle,
      }));
  }

  /**
   * Convert UI handle names to execution conditions
   */
  private handleToCondition(handle: string): string | undefined {
    const conditionMap: Record<string, string> = {
      'true': '{{_lastResult}} == true',
      'false': '{{_lastResult}} == false',
      'yes': '{{_lastResult}} == true',
      'no': '{{_lastResult}} == false',
      'success': '{{_lastResult.status}} == "success"',
      'error': '{{_lastResult.status}} == "error"',
    };
    return conditionMap[handle.toLowerCase()];
  }

  /**
   * Find entry node
   */
  private findEntryNode(nodes: ExecutableNode[]): ExecutableNode {
    const entryNode = nodes.find(n => n.type === 'start');
    if (!entryNode) {
      throw new CompilationError('No start node found');
    }
    return entryNode;
  }

  /**
   * Build flow config
   */
  private buildFlowConfig(uiFlow: FlowData): FlowConfig {
    return {
      timeoutSeconds: 3600, // 1 hour default
      maxIterations: 100,
      errorBehavior: 'fail',
      variables: [],
    };
  }

  /**
   * Detect cycles in flow
   */
  private detectCycles(flow: ExecutableFlow): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string, path: string[]) => {
      visited.add(nodeId);
      recStack.add(nodeId);
      path.push(nodeId);

      const node = flow.nodes[nodeId];
      if (node) {
        for (const transition of node.transitions) {
          if (!visited.has(transition.targetNodeId)) {
            dfs(transition.targetNodeId, [...path]);
          } else if (recStack.has(transition.targetNodeId)) {
            const cycleStart = path.indexOf(transition.targetNodeId);
            cycles.push([...path.slice(cycleStart), transition.targetNodeId]);
          }
        }
      }

      recStack.delete(nodeId);
    };

    dfs(flow.entryNodeId, []);
    return cycles;
  }

  /**
   * Export compiled flow as JSON
   */
  exportJSON(flow: ExecutableFlow): string {
    return JSON.stringify(flow, null, 2);
  }

  /**
   * Import and validate compiled flow
   */
  importJSON(json: string): ExecutableFlow {
    const flow = JSON.parse(json) as ExecutableFlow;

    const validation = this.validatePostCompile(flow);
    if (!validation.valid) {
      throw new CompilationError('Invalid imported flow', validation.errors);
    }

    return flow;
  }
}

// ============================================================================
// NODE COMPILERS
// ============================================================================

const NODE_COMPILERS: Record<string, NodeCompiler> = {
  start: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'start',
        config: {} as any,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  message: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      const buttons = uiNode.data.buttons?.map((btn: any) => ({
        id: crypto.randomUUID(),
        label: btn.text || btn.label,
        action: 'reply' as const,
        value: btn.action || btn.text || btn.label,
      })) || [];

      return {
        id: uiNode.id,
        type: 'message',
        config: {
          content: uiNode.data.text || uiNode.data.content || '',
          contentType: buttons.length > 0 ? 'rich' : 'text',
          buttons: buttons.length > 0 ? buttons : undefined,
        } as MessageConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  question: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'question',
        config: {
          question: uiNode.data.question || uiNode.data.text || '',
          expectedInputType: uiNode.data.inputType || 'text',
          saveToVariable: uiNode.data.variable || `answer_${uiNode.id}`,
          maxRetries: uiNode.data.maxRetries || 3,
        } as QuestionConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  condition: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'condition',
        config: {
          expression: uiNode.data.condition || '',
          evaluator: 'simple',
        } as ConditionConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  advancedCondition: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'condition',
        config: {
          expression: uiNode.data.condition || uiNode.data.conditions?.[0]?.expression || '',
          evaluator: 'javascript',
        } as ConditionConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  api: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'api',
        config: {
          method: uiNode.data.method || 'GET',
          url: uiNode.data.apiUrl || uiNode.data.url || '',
          headers: uiNode.data.headers || {},
          body: uiNode.data.body,
          timeout: uiNode.data.timeout || 5000,
          retries: uiNode.data.retries || 0,
          saveResponseTo: uiNode.data.saveResponseTo || `api_response_${uiNode.id}`,
          errorOnHttpError: true,
        } as ApiConfig,
        transitions: compileTransitions(edges, uiNode.id),
        retries: uiNode.data.retries || 0,
      };
    },
  },

  delay: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'delay',
        config: {
          duration: parseInt(uiNode.data.delay || uiNode.data.duration || '0'),
          unit: uiNode.data.unit || 'seconds',
        } as DelayConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  action: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'action',
        config: {
          actionType: uiNode.data.actionType || 'webhook',
          parameters: uiNode.data.parameters || {},
        } as ActionConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  form: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'form',
        config: {
          fields: uiNode.data.fields || [],
          submitButtonText: uiNode.data.submitButtonText || 'Submit',
          saveToVariable: uiNode.data.saveToVariable || `form_${uiNode.id}`,
        } as FormConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  variable: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'variable',
        config: {
          variableName: uiNode.data.variable || uiNode.data.variableName || 'temp',
          operation: uiNode.data.operation || 'set',
          value: uiNode.data.value || '',
        } as VariableConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  tag: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'tag',
        config: {
          tagNames: uiNode.data.tags || uiNode.data.tagNames || [],
          operation: uiNode.data.operation || 'add',
        } as TagConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },

  segment: {
    compile(uiNode: any, edges: any[]): ExecutableNode {
      return {
        id: uiNode.id,
        type: 'segment',
        config: {
          segmentId: uiNode.data.segmentId || '',
          operation: uiNode.data.operation || 'add',
        } as SegmentConfig,
        transitions: compileTransitions(edges, uiNode.id),
      };
    },
  },
};

/**
 * Helper: Compile edges to transitions
 */
function compileTransitions(edges: any[], sourceNodeId: string): NodeTransition[] {
  return edges
    .filter(edge => edge.source === sourceNodeId)
    .map((edge, index) => ({
      id: edge.id,
      targetNodeId: edge.target,
      condition: edge.sourceHandle ? handleToCondition(edge.sourceHandle) : undefined,
      priority: index,
      label: edge.label || edge.sourceHandle,
    }));
}

/**
 * Helper: Convert handle to condition
 */
function handleToCondition(handle: string): string | undefined {
  const conditionMap: Record<string, string> = {
    'true': '{{_lastResult}} == true',
    'false': '{{_lastResult}} == false',
    'yes': '{{_lastResult}} == true',
    'no': '{{_lastResult}} == false',
    'success': '{{_lastResult.status}} == "success"',
    'error': '{{_lastResult.status}} == "error"',
  };
  return conditionMap[handle.toLowerCase()];
}
