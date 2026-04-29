# Tayseer Backend Implementation Plan

## Schema (New - not using schema.txt)

### New Models to Add to Prisma Schema
- Invoice + InvoiceItem (line items)
- AgentLog (dev dashboard activity feed)

---

## Implementation Steps

### Step 1: Extend Prisma Schema

Add these models to prisma/schema.prisma:
```prisma
model Invoice {
  id            String   @id @default(uuid())
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  invoiceNumber String   @unique
  amount        Decimal  @db.Decimal(12, 2)
  currency      String   @default("USD")
  stage         Int      @default(1)  // 1=Generated, 2=Received, 3=Funded, 4=Released
  dueDate       DateTime?
  items         InvoiceItem[]
  createdAt     DateTime @default(now())
}

model InvoiceItem {
  id          String  @id @default(uuid())
  invoiceId   String
  invoice     Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  description String
  amount      Decimal @db.Decimal(12, 2)
}

model AgentLog {
  id        String   @id @default(uuid())
  action    String   // milestone, invoice, escrow, payment, alert
  message   String
  projectId String?
  severity  String   // info, success, warning
  createdAt DateTime @default(now())
}
```

### Step 2: Prisma Setup
- Install Prisma
- Initialize Prisma
- Generate client
- Run migration

### Step 3: Server Actions (Dev Dashboard)

| Action | Purpose |
|--------|---------|
| getProjects() | List all projects |
| getProject(id) | Single project with clients, milestones, invoices |
| createProject(data) | Create project (title, taxRate, currency) |
| updateProject(id, data) | Update project settings |
| createClient(projectId, name, email?, platform?) | Invite client, generate token |
| getInvoices(projectId) | List invoices with items |
| createInvoice(projectId, items[], dueDate?) | Create invoice |
| updateInvoiceStage(id, stage) | Move through lifecycle |
| getMessages(projectId) | Chat history |
| createContract(projectId, content) | Store contract text |

### Step 4: Client API Routes

| Endpoint | Access | Returns |
|----------|--------|---------|
| GET /api/client/[token] | Client | Project, milestones (view-only), contract, invoices, messages |
| POST /api/client/[token]/message | Client | Send message |

### Step 5: Frontend

**Dev Dashboard**:
- Connect to server actions (replace mock data)

**Client Chat Page** (/client/[token]):
- Milestone list (view only)
- Contract view + PDF download
- Invoice list (full details)
- Chat (send/receive)

---

## Client Permissions (per user request)
- View milestone plan (no approve/reject)
- View contract (download as PDF)
- View invoice details (full)
- Send/receive messages in chat only