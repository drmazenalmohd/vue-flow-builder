# Backend Handoff Documentation

## ✅ Frontend Complete - Ready for Backend Integration

This document serves as the **official handoff** from frontend to backend development. All frontend work for Phase 1 (Execution Layer) is complete.

---

## What's Ready

### ✅ Execution Schema
- **Location:** `src/models/execution/schema.ts`
- **Purpose:** Complete TypeScript contracts for backend
- **Key Types:**
  - `ExecutableFlow` - The flow definition backend will execute
  - `ExecutableNode` - Individual node execution config
  - `ExecutionContext` - Runtime state during execution
  - `ExecutionResult` - What nodes return after executing

### ✅ Flow Compiler
- **Location:** `src/services/FlowCompiler.ts`
- **Purpose:** Transforms UI schema → Executable schema
- **Validation:** Detects cycles, missing nodes, invalid transitions
- **Node Compilers:** 16 node types supported

### ✅ API Contracts
- **Location:** `src/api/types.ts`
- **Purpose:** TypeScript interfaces for all API endpoints
- **Coverage:** Flow CRUD, Execution, Testing, Publishing

### ✅ API Client
- **Location:** `src/api/flowApi.ts`
- **Purpose:** Frontend service to call backend APIs
- **Features:** Error handling, type-safe, retries

### ✅ Sample Flows
- **Location:** `src/utils/sampleFlows.ts`
- **Purpose:** 4 ready-to-test flows for backend development
- **Flows:**
  1. Simple Welcome (Start → Message → End)
  2. Lead Capture (Questions → Variables)
  3. Support Ticket (Branching with conditions)
  4. API Integration (External API call)

---

## What Backend Must Implement

### **Phase 2A: Core API (Week 1)**

#### 1. POST /api/v1/flows
**Purpose:** Create/update flow

**Request:**
```json
{
  "flow": { /* ExecutableFlow */ },
  "ui": { /* Optional: UIFlowData for re-editing */ }
}
```

**Response:**
```json
{
  "id": "uuid",
  "version": 1,
  "status": "draft",
  "createdAt": "2026-01-17T..."
}
```

**Storage:**
- PostgreSQL table: `flows`
- Columns: `id`, `version`, `executable_flow` (JSONB), `ui_data` (JSONB), `metadata`, `created_at`, `updated_at`

#### 2. GET /api/v1/flows/:id
**Purpose:** Retrieve flow by ID

**Response:**
```json
{
  "flow": { /* ExecutableFlow */ },
  "ui": { /* UIFlowData */ },
  "metadata": {
    "executions": 42,
    "successRate": 0.95,
    "avgDuration": 120
  }
}
```

#### 3. POST /api/v1/flows/:id/validate
**Purpose:** Validate flow before publishing

**Request:**
```json
{
  "flow": { /* ExecutableFlow */ }
}
```

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    { "code": "UNUSED_NODE", "message": "Node X is unreachable" }
  ]
}
```

**Backend Validation:**
- Variable existence checks
- Node configuration validation against schemas
- Chatwoot inbox ID validity
- Permission checks

---

### **Phase 2B: Execution Engine (Week 2-3)**

#### 4. Execution Orchestrator

**Purpose:** Execute flows step-by-step

**Key Functions:**
```typescript
class ExecutionOrchestrator {
  async startFlow(flowId: string, chatwootContext: ChatwootContext): Promise<void>
  async resumeFlow(executionId: string, userMessage?: string): Promise<void>
  private async executeNextNode(context: ExecutionContext): Promise<void>
}
```

**State Management:**
- **Redis:** Active executions (fast lookup)
  - Key: `execution:{executionId}` → ExecutionContext JSON
  - Key: `conversation:{conversationId}:execution` → executionId
- **PostgreSQL:** Execution history (audit trail)
  - Table: `executions`
  - Table: `execution_history` (append-only log)

#### 5. Node Executors

**Must implement for each node type:**
```typescript
interface NodeExecutor {
  execute(node: ExecutableNode, context: ExecutionContext): Promise<ExecutionResult>
  validate(config: NodeConfig): ValidationError[]
}
```

**Priority order:**
1. **Message Node** - Send message to Chatwoot
2. **Question Node** - Send message, wait for user input, validate, save to variable
3. **Condition Node** - Evaluate expression, choose transition
4. **API Node** - Make HTTP request, save response
5. **End Node** - Mark execution complete

**Reference Implementation:** See `ARCHITECTURE.md` Section "Part 3: Node Execution Contracts"

---

### **Phase 2C: Chatwoot Integration (Week 3-4)**

#### 6. Event Handler

**Chatwoot Webhooks to Handle:**
- `message_created` - User sends message
- `conversation_created` - New conversation starts
- `conversation_status_changed` - Conversation resolved/reopened

**Flow:**
```
Chatwoot Webhook
  → EventHandler.handleMessageCreated()
  → Find active execution (or create new)
  → ExecutionOrchestrator.resumeFlow()
  → Execute nodes until waiting/complete
  → Send messages back to Chatwoot
```

#### 7. Action Executor

**Chatwoot API Calls:**
```typescript
class ChatwootActionExecutor {
  async sendMessage(conversationId, content, buttons?)
  async updateContact(contactId, updates)
  async addLabel(conversationId, labels)
  async assignAgent(conversationId, agentId)
  async closeConversation(conversationId)
}
```

**Chatwoot Client:**
- Use official Chatwoot API client or REST API
- Base URL: `{chatwoot_url}/api/v1/accounts/{account_id}`
- Auth: `api_access_token` header

---

## Sample Flow Execution Trace

**Flow:** Lead Capture (see `sampleFlows.ts`)

**Expected Backend Behavior:**

```
1. User opens conversation
   → Chatwoot: conversation_created event
   → Backend: Start flow (sample-lead-capture-002)
   → Execute node: start-1
   → Execute node: question-name
   → Send to Chatwoot: "What is your name?"
   → Update state: waiting_input (save to: user_name)

2. User replies: "John"
   → Chatwoot: message_created event
   → Backend: Resume execution
   → Validate input: "John" (text) ✅
   → Save variable: user_name = "John"
   → Execute node: question-email
   → Send to Chatwoot: "What is your email address?"
   → Update state: waiting_input (save to: user_email)

3. User replies: "john@example.com"
   → Chatwoot: message_created event
   → Backend: Resume execution
   → Validate input: "john@example.com" (email regex) ✅
   → Save variable: user_email = "john@example.com"
   → Execute node: message-thanks
   → Template rendering: "Thank you, {{user_name}}!" → "Thank you, John!"
   → Send to Chatwoot: "Thank you, John! We will contact you at john@example.com."
   → Execute node: end-1
   → Mark execution complete
```

---

## API Testing

### Using Sample Flows

```bash
# 1. Start backend server
npm run dev

# 2. Test flow creation
curl -X POST http://localhost:3000/api/v1/flows \
  -H "Content-Type: application/json" \
  -d @src/utils/sampleFlows/simpleWelcome.json

# 3. Test flow execution
curl -X POST http://localhost:3000/api/v1/flows/{flowId}/execute \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": 123,
    "testMode": true,
    "mockData": {
      "contactName": "Test User",
      "contactEmail": "test@example.com"
    }
  }'
```

### Frontend Testing

1. **Start backend** (port 3000)
2. **Start frontend** (`npm run dev` - port 5173)
3. **Create flow** in builder
4. **Click "Publish"** → Should call `POST /api/v1/flows`
5. **Check console** for API response

---

## Database Schema

### flows table
```sql
CREATE TABLE flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version INTEGER NOT NULL DEFAULT 1,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Execution definition (backend uses this)
  executable_flow JSONB NOT NULL,

  -- UI definition (for re-editing)
  ui_data JSONB,

  -- Metadata
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,

  -- Chatwoot integration
  chatwoot_inbox_id INTEGER,
  trigger_event VARCHAR(100),

  UNIQUE(id, version)
);

CREATE INDEX idx_flows_status ON flows(status);
CREATE INDEX idx_flows_inbox ON flows(chatwoot_inbox_id);
```

### executions table
```sql
CREATE TABLE executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES flows(id),
  flow_version INTEGER NOT NULL,
  conversation_id INTEGER NOT NULL,

  -- State
  status VARCHAR(50) NOT NULL DEFAULT 'running',
  current_node_id VARCHAR(100),
  context JSONB NOT NULL, -- ExecutionContext

  -- Timing
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,

  -- Outcome
  completion_reason VARCHAR(100),
  error JSONB,

  FOREIGN KEY (flow_id, flow_version) REFERENCES flows(id, version)
);

CREATE INDEX idx_executions_conversation ON executions(conversation_id);
CREATE INDEX idx_executions_status ON executions(status);
CREATE INDEX idx_executions_flow ON executions(flow_id);
```

### execution_history table (append-only)
```sql
CREATE TABLE execution_history (
  id SERIAL PRIMARY KEY,
  execution_id UUID NOT NULL REFERENCES executions(id),
  node_id VARCHAR(100) NOT NULL,
  node_type VARCHAR(50) NOT NULL,

  -- What happened
  result JSONB NOT NULL, -- ExecutionResult
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),

  -- For debugging
  variables_snapshot JSONB,
  error JSONB
);

CREATE INDEX idx_history_execution ON execution_history(execution_id);
```

---

## Environment Variables

```bash
# Backend .env
DATABASE_URL=postgresql://user:pass@localhost:5432/airochat
REDIS_URL=redis://localhost:6379
CHATWOOT_URL=https://app.chatwoot.com
CHATWOOT_API_KEY=your_api_key_here
CHATWOOT_ACCOUNT_ID=1
PORT=3000
```

---

## Testing Checklist

### Unit Tests
- [ ] Flow compiler transforms UI → Executable correctly
- [ ] Each node executor handles valid inputs
- [ ] Validation catches invalid node configs
- [ ] Template rendering works ({{variable}} substitution)
- [ ] Condition evaluation works (simple + javascript)

### Integration Tests
- [ ] POST /api/v1/flows creates flow in database
- [ ] GET /api/v1/flows/:id retrieves flow
- [ ] Flow execution starts from entry node
- [ ] Question node pauses and waits for input
- [ ] Condition node branches correctly
- [ ] API node makes HTTP requests
- [ ] Variables are saved and retrieved
- [ ] Messages are sent to Chatwoot

### End-to-End Tests
- [ ] User starts conversation → Flow triggers
- [ ] Bot sends question → User replies → Bot continues
- [ ] Conditional routing works based on user input
- [ ] Flow completes and marks execution finished
- [ ] Agent handoff works (transfer_agent node)
- [ ] Errors are logged and execution stops gracefully

---

## API Reference

Full API specification: `src/api/types.ts`

**Base URL:** `http://localhost:3000/api/v1`

**Authentication:** TODO (add JWT or API key)

**Rate Limiting:** TODO (add rate limits)

**Error Format:**
```json
{
  "error": "ValidationError",
  "message": "Flow has no start node",
  "code": "NO_START_NODE",
  "details": { /* additional context */ }
}
```

---

## Next Steps for Backend Team

### Week 1: Foundation
1. Set up project structure (Node.js/Python/Go)
2. Set up PostgreSQL + Redis
3. Implement flow storage (POST, GET /flows)
4. Return mock responses to frontend

### Week 2: Execution
5. Implement ExecutionOrchestrator
6. Implement MessageNodeExecutor
7. Implement QuestionNodeExecutor
8. Test with sample flows

### Week 3: Chatwoot
9. Set up Chatwoot webhooks
10. Implement ChatwootActionExecutor
11. Implement event handling
12. End-to-end test with real Chatwoot instance

### Week 4: Polish
13. Add error handling and logging
14. Add tests (unit + integration)
15. Add monitoring (execution metrics)
16. Deploy to staging

---

## Questions for Backend Team

**Answered by frontend:**
- ✅ What format do flows use? → `ExecutableFlow` (see `schema.ts`)
- ✅ How are nodes executed? → See `NodeExecutor` interface
- ✅ How are transitions resolved? → Priority order, condition evaluation
- ✅ How are variables stored? → In `ExecutionContext.variables`

**For backend to decide:**
- ⏳ Authentication strategy (JWT, API key, OAuth)?
- ⏳ Chatwoot deployment (cloud or self-hosted)?
- ⏳ Tech stack (Node.js, Python, Go)?
- ⏳ Deployment platform (AWS, GCP, Heroku)?

---

## Contact

**Frontend complete:** All execution layer code finished

**Questions?** Refer to:
- `ARCHITECTURE.md` - Full architectural overview
- `src/models/execution/schema.ts` - Execution contracts
- `src/utils/sampleFlows.ts` - Sample flows for testing

**Ready for backend handoff:** ✅ YES

---

**Last Updated:** January 17, 2026
**Frontend Phase:** 1 (Execution Layer) - Complete
**Backend Phase:** 2 (API + Execution) - Ready to Start
