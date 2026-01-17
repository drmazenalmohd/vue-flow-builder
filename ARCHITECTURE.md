# Airochat Flow Builder - Architecture Documentation

## Overview

This document describes the architectural transformation from a UI-first prototype to a backend-ready flow execution system.

## Current Status: Phase 1 Complete ✅

The flow builder now supports **dual-schema architecture**:
- **UI Schema**: VueFlow-based visual representation
- **Execution Schema**: Backend-ready flow definition

## Architecture

### Data Flow

```
┌─────────────────┐
│   UI Builder    │
│  (BuilderCanvas)│
│                 │
│  - Drag & drop  │
│  - Visual edit  │
│  - Node props   │
└────────┬────────┘
         │
         │ Save/Publish
         ▼
┌─────────────────┐
│  Flow Compiler  │
│                 │
│  - Validates    │
│  - Transforms   │
│  - Detects bugs │
└────────┬────────┘
         │
         ├─────────────────┬──────────────┐
         ▼                 ▼              ▼
   ┌─────────┐      ┌──────────┐   ┌──────────┐
   │UI Schema│      │Executable│   │Validation│
   │(for edit)│     │  Schema  │   │  Errors  │
   └─────────┘      │(for exec)│   └──────────┘
                    └────┬─────┘
                         │
                         │ (Future: API)
                         ▼
                  ┌──────────────┐
                  │   Backend    │
                  │   Execution  │
                  │   Engine     │
                  └──────────────┘
```

## Key Components

### 1. Execution Schema (`src/models/execution/schema.ts`)

**Purpose**: Canonical contract between frontend and backend.

**Key Interfaces**:
- `ExecutableFlow` - The compiled, runtime-ready flow
- `ExecutableNode` - Individual node execution config
- `NodeTransition` - Routing between nodes
- `ExecutionContext` - Runtime state (for backend)

**What's EXCLUDED** (never sent to backend):
- Node positions (x, y coordinates)
- Viewport state (zoom, pan)
- UI colors, sizes, styles
- Selection state

**Example ExecutableNode**:
```typescript
{
  id: "node-123",
  type: "message",
  config: {
    content: "Hello {{user.name}}!",
    contentType: "text",
    buttons: [
      { id: "btn-1", label: "Yes", action: "reply", value: "yes" }
    ]
  },
  transitions: [
    { id: "t1", targetNodeId: "node-456", priority: 0 }
  ]
}
```

### 2. Flow Compiler (`src/services/FlowCompiler.ts`)

**Purpose**: Transforms UI schema → Execution schema with validation.

**Compilation Stages**:

1. **Pre-compilation Validation**
   - Checks for start node (exactly one)
   - Validates node types
   - Ensures nodes are connected

2. **Node Compilation**
   - Strips UI properties
   - Extracts execution config
   - Converts edges to transitions

3. **Post-compilation Validation**
   - Detects infinite loops (cycle detection)
   - Validates all transitions point to real nodes
   - Checks variable references

**Error Handling**:
```typescript
try {
  const executableFlow = compiler.compile(uiFlow, metadata);
} catch (error) {
  if (error instanceof CompilationError) {
    // Show user-friendly validation errors
    console.log(error.errors); // Array of ValidationError
  }
}
```

### 3. Node Compilers

Each node type has a dedicated compiler that knows how to extract execution config:

**Example: Message Node**
```typescript
// UI Node
{
  id: "1",
  type: "message",
  data: { text: "Hello", buttons: [{ text: "Click me" }] },
  position: { x: 100, y: 200 }  // ❌ Stripped out
}

// Compiled Node
{
  id: "1",
  type: "message",
  config: {
    content: "Hello",
    contentType: "rich",
    buttons: [{ id: "...", label: "Click me", action: "reply", value: "Click me" }]
  },
  transitions: [...]
}
```

**Supported Node Types**:
- ✅ Start
- ✅ Message
- ✅ Question
- ✅ Condition
- ✅ Advanced Condition
- ✅ API
- ✅ Delay
- ✅ Action
- ✅ Form
- ✅ Variable (Set Variable)
- ✅ Tag
- ✅ Segment

### 4. Integration in BuilderCanvas

**Save Flow** (Updated):
```typescript
const saveFlow = () => {
  const flowData = { nodes, edges, viewport };
  const executableFlow = compiler.compile(flowData, metadata);

  // Save BOTH schemas
  const saveData = {
    ui: flowData,           // For re-editing
    executable: executableFlow  // For backend
  };

  // Download as JSON
  downloadJSON(saveData);
};
```

**Publish Flow** (New):
```typescript
const handlePublish = async () => {
  const executableFlow = compiler.compile(flowData, metadata);

  // TODO: Send to backend API
  // await fetch('/api/v1/flows', {
  //   method: 'POST',
  //   body: JSON.stringify(executableFlow)
  // });

  alert('Flow compiled successfully!');
};
```

## Validation

### Compile-Time Validation

**Errors that prevent compilation**:
- ❌ No start node
- ❌ Multiple start nodes
- ❌ Invalid node types
- ❌ Infinite loops detected
- ❌ Transitions to non-existent nodes

**Example Error**:
```typescript
{
  code: 'NO_START_NODE',
  message: 'Flow must have exactly one Start node',
  nodeId: undefined
}
```

### Runtime Validation (Backend)

**Future: Backend will validate**:
- Variable existence before use
- API endpoint reachability
- Template syntax correctness
- Permission/auth requirements

## What's Next: Backend Integration

### Phase 2: API Contracts (Week 1-2)

**Endpoints to implement**:
```typescript
POST   /api/v1/flows              // Create/update flow
GET    /api/v1/flows/:id          // Get flow
POST   /api/v1/flows/:id/validate // Validate before publish
POST   /api/v1/flows/:id/publish  // Publish to Chatwoot
GET    /api/v1/flows/:id/versions // Version history
```

**Request Format**:
```json
{
  "flow": { /* ExecutableFlow */ },
  "ui": { /* UIFlowData (optional) */ }
}
```

### Phase 3: Chatwoot Integration (Week 3-4)

**How flows execute**:
1. User sends message to Chatwoot inbox
2. Chatwoot webhook → Airochat backend
3. Backend finds active flow for conversation
4. Execute current node → Send Chatwoot message
5. Wait for user response or move to next node

**Key Integrations**:
- Chatwoot webhooks (message.created, conversation.created)
- Chatwoot API (send messages, update contacts, assign agents)
- State persistence (Redis for active executions, PostgreSQL for history)

## Testing

### Manual Testing

1. **Build a simple flow**:
   - Start → Message → Question → Message

2. **Click "Save"**:
   - Downloads JSON with both UI and executable schemas
   - Check console for compilation logs

3. **Click "Publish"**:
   - Compiles flow
   - Shows success alert with flow ID
   - Check console for compiled output

### Validation Testing

**Test case: Missing start node**
1. Delete the start node
2. Click Save
3. Should show error: "Flow must have exactly one Start node"

**Test case: Infinite loop**
1. Create cycle: Node A → Node B → Node A
2. Click Save
3. Should show error: "Potential infinite loop detected"

## File Structure

```
src/
├── models/
│   └── execution/
│       └── schema.ts              # ✅ NEW: Execution contracts
│
├── services/
│   └── FlowCompiler.ts            # ✅ NEW: Compiler service
│
├── components/
│   └── builder/
│       ├── BuilderCanvas.vue      # ✅ UPDATED: Compiler integration
│       ├── nodes/                 # Unchanged (UI components)
│       └── ...
│
└── types/
    └── nodes.ts                   # Unchanged (UI types)
```

## Migration Checklist

### ✅ Phase 1: Execution Layer (COMPLETE)
- [x] Create execution schema
- [x] Build flow compiler
- [x] Add node compilers (16 types)
- [x] Integrate into BuilderCanvas
- [x] Validate compilation works
- [x] Update save/publish functions

### 🔄 Phase 2: API Integration (NEXT)
- [ ] Define OpenAPI spec for backend
- [ ] Create API client (`src/api/flowApi.ts`)
- [ ] Mock backend for testing
- [ ] Wire publish button to API
- [ ] Add error handling for API failures
- [ ] Show publish success with flow ID

### ⏳ Phase 3: Backend Development (BACKEND TEAM)
- [ ] Implement flow storage (PostgreSQL)
- [ ] Build execution engine
- [ ] Integrate Chatwoot webhooks
- [ ] Implement node executors
- [ ] Add state management (Redis)
- [ ] Testing & deployment

## Design Decisions

### Why Dual Schema?

**Problem**: VueFlow uses UI-centric data model with positions, styles, viewport.

**Solution**: Keep UI schema for editing, generate execution schema for runtime.

**Benefits**:
- Clean separation of concerns
- Backend doesn't process UI cruft
- Can version execution schema independently
- Easier to test backend without UI

### Why Compile at Save Time?

**Alternative**: Compile on backend when flow executes.

**Chosen approach**: Compile in frontend on save/publish.

**Rationale**:
- **Immediate validation** - User sees errors while editing
- **Backend simplicity** - Backend only stores/executes, doesn't transform
- **Type safety** - Compilation errors caught early
- **Versioning** - Each publish is pre-validated

### Why Not Rebuild UI?

**Considered**: Rewrite UI to use execution schema as source of truth.

**Decision**: Keep existing UI, add compiler layer.

**Rationale**:
- **Time**: Refactoring UI would take 2-3 weeks
- **Risk**: Could break existing functionality
- **Value**: UI works fine, just needs better data output
- **Migration path**: Can refactor UI later without blocking backend

## Known Limitations

### Current
- No undo/redo (was already missing)
- No real-time collaboration
- No A/B testing
- No flow versioning (in UI)
- No execution preview/dry-run

### Future Backend Requirements
- Authentication/authorization
- Flow permissions
- Multi-tenant support
- Execution monitoring
- Error tracking/logging
- Performance optimization

## Success Criteria

### Phase 1 ✅ (Complete)
- [x] Flow compiles to ExecutableFlow format
- [x] All 16 node types supported
- [x] Validation catches common errors
- [x] Save exports both UI + executable
- [x] Build passes without errors

### Phase 2 (Backend Ready)
- [ ] Backend can import ExecutableFlow JSON
- [ ] Backend can execute Message nodes
- [ ] Backend can execute Question nodes (wait for input)
- [ ] Backend can execute Condition nodes (branching)
- [ ] Backend can send Chatwoot messages
- [ ] End-to-end test: User message → Flow executes → Response sent

## Contact

For questions about architecture or backend integration, refer to:
- Execution schema: `src/models/execution/schema.ts`
- Compiler implementation: `src/services/FlowCompiler.ts`
- Integration example: `src/components/builder/BuilderCanvas.vue` (line 421+)

---

**Status**: ✅ Phase 1 Complete - Ready for API integration
**Next Step**: Define backend API contracts and implement mock server
**Blocker**: None - frontend work complete, backend can start
