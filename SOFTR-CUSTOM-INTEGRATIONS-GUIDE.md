# Softr Custom Integrations & Workflows - Complete Guide
**Comprehensive Technical Reference for Building Custom Integrations**

**Date:** June 19, 2026  
**Version:** 1.0 - Complete  
**Status:** Research Complete - Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Can You Build Custom Integrations?](#can-you-build-custom-integrations)
3. [Integration Architecture](#integration-architecture)
4. [Build Integrations Feature Overview](#build-integrations-feature-overview)
5. [Custom Workflows Capabilities](#custom-workflows-capabilities)
6. [Softr Database API Reference](#softr-database-api-reference)
7. [REST API Integration Guide](#rest-api-integration-guide)
8. [Webhook Integration Patterns](#webhook-integration-patterns)
9. [Step-by-Step Integration Setup](#step-by-step-integration-setup)
10. [Code Examples & Implementation Patterns](#code-examples--implementation-patterns)
11. [Authentication & Security](#authentication--security)
12. [Integration Marketplace & Pre-Built Connectors](#integration-marketplace--pre-built-connectors)
13. [Advanced Patterns](#advanced-patterns)
14. [Troubleshooting & Best Practices](#troubleshooting--best-practices)
15. [Complete Use Case Example](#complete-use-case-example)

---

## Executive Summary

**Can you build custom integrations?** ✅ **YES - Fully Supported**

Softr provides a powerful no-code/low-code platform for building custom integrations with virtually any REST API. Here's the viability breakdown:

| Aspect | Capability | Score |
|--------|-----------|-------|
| **Custom REST API Integrations** | ✅ Unlimited | 9/10 |
| **Webhook Triggers** | ✅ Full Support | 9/10 |
| **Custom Workflows** | ✅ Server-Side Code | 8/10 |
| **Authentication Methods** | ✅ Multiple Options | 9/10 |
| **Pre-Built Integrations** | ✅ 20+ Direct + 5,000+ via Zapier | 9/10 |
| **Overall Integration Maturity** | ✅ Production-Ready | 8/10 |

**Bottom Line:** Softr is enterprise-grade for custom integrations. You can connect virtually any REST API, automate workflows with code, and expose webhooks for external systems.

---

## Can You Build Custom Integrations?

### Short Answer: YES

You can build custom integrations through **three primary methods:**

1. **REST API Data Sources** (No-Code)
   - Connect any REST API as a data source
   - Use in Softr apps immediately
   - Requires Business plan or higher

2. **Custom Workflows** (Code & No-Code)
   - Event-triggered automation
   - Built-in API call actions
   - JavaScript/Python code blocks
   - Webhook triggers for external systems

3. **Direct Softr API** (Code)
   - Call Softr's database API directly
   - Read/create/update records programmatically
   - Personal access tokens for authentication

### What Protocols Are Supported?

- **HTTPS REST** (required for all requests)
- **JSON** request/response bodies
- **HTTP Methods:** GET, POST, PUT, PATCH, DELETE
- **Webhooks:** HTTP POST, PUT, GET for incoming triggers
- **Authentication:** API Keys, Bearer tokens, OAuth, custom headers

### Process Overview

```
┌─────────────────────────────────────────┐
│ External System / REST API              │
│ (Stripe, Salesforce, HubSpot, etc.)    │
└────────────┬────────────────────────────┘
             │ HTTPS REST API Calls
             │
┌────────────▼────────────────────────────┐
│ Softr Custom Integration Layer          │
│ (REST API Data Source or Workflow)      │
│ ├─ Authentication: API Key, Bearer, etc │
│ ├─ Request/Response Mapping             │
│ ├─ Error Handling & Retries             │
│ └─ Rate Limiting (20 calls/sec)        │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│ Softr Database / Airtable               │
│ (Store integrated data)                 │
└─────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│ Softr UI Components                     │
│ (Display and manage data)               │
└─────────────────────────────────────────┘
```

---

## Integration Architecture

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│ SOFTR PLATFORM                                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────┐      ┌──────────────┐              │
│  │ REST API Data  │      │ Workflows    │              │
│  │ Sources        │      │ Engine       │              │
│  ├────────────────┤      ├──────────────┤              │
│  │ • Call any API │      │ • Triggers   │              │
│  │ • Config once  │      │ • Actions    │              │
│  │ • Reuse in app │      │ • Code blocks│              │
│  └────────────────┘      └──────────────┘              │
│         │                        │                     │
│         └───────────┬────────────┘                     │
│                     │                                  │
│              ┌──────▼──────┐                          │
│              │ Softr API   │                          │
│              │ Gateway     │                          │
│              └──────┬──────┘                          │
│                     │                                  │
│  ┌──────────────────┼──────────────────┐             │
│  │                  │                  │             │
│  ▼                  ▼                  ▼             │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐       │
│ │ Database   │ │ Airtable   │ │ Webhooks   │       │
│ │ Records    │ │ Sync       │ │ Out        │       │
│ └────────────┘ └────────────┘ └────────────┘       │
│                                                      │
└──────────────────────────────────────────────────────┘
         │              │              │
         │              │              │
┌────────▼──────┐ ┌────▼─────┐ ┌─────▼────┐
│ Softr UI      │ │ External │ │ External │
│ Components    │ │ Systems  │ │ Webhooks │
└───────────────┘ └──────────┘ └──────────┘
```

### Data Flow Example: Stripe Integration

```
1. Customer submits form in Softr app
   └─> Form data captured

2. Softr Workflow triggered
   └─> Check for action "Call Stripe API"

3. Call Stripe REST API
   ├─ POST https://api.stripe.com/v1/payment_intents
   ├─ Headers: Authorization: Bearer STRIPE_SECRET_KEY
   └─ Body: { amount, currency, customer_email }

4. Stripe responds with payment intent
   └─> { id, client_secret, amount, status }

5. Softr processes response
   └─> Code block validates & transforms data

6. Update Softr database
   └─> Create/update Payment record in Airtable

7. Send webhook to external system
   └─> POST https://your-api.com/softr-webhook
       { paymentId, amount, status, timestamp }

8. External system receives webhook
   └─> Completes transaction in their system
```

---

## Build Integrations Feature Overview

### What Is "Build Integrations"?

Softr's **Build Integrations** feature (formerly called Data Sources) allows you to connect any REST API without writing backend code. It's a configuration-based approach where you:

1. Specify the API endpoint
2. Configure authentication
3. Map request/response fields
4. Use the integration in your Softr apps

### How to Access

**In Softr Dashboard:**
```
Settings → Data Sources → Connect Data Source → REST API
```

### Configuration Required

| Field | Description | Example |
|-------|-------------|---------|
| **Name** | Friendly name for integration | "Stripe API" |
| **Base URL** | API endpoint | `https://api.stripe.com/v1` |
| **Authentication** | Auth method | `Bearer Token` |
| **Headers** | Custom headers | `Authorization: Bearer sk_live_...` |
| **Method** | HTTP method | `POST` |
| **Endpoint Path** | Specific endpoint | `/payment_intents` |
| **Parameters** | Query/body params | `amount`, `currency` |

### Step 1: Create REST API Data Source

**Dashboard Flow:**

```
1. Settings → Data Sources
2. Click "Connect Data Source"
3. Select "REST API"
4. Fill in:
   - Name: "My Custom API"
   - Base URL: https://api.example.com/v1
   - Headers:
     * Authorization: Bearer YOUR_API_KEY
     * Content-Type: application/json
   - Test connection
5. Save
```

### Step 2: Configure Specific Endpoint

**Example: Stripe Payment Intent**

```
Base URL: https://api.stripe.com/v1

Endpoint: /payment_intents
Method: POST

Headers:
  Authorization: Bearer sk_live_YOUR_KEY
  Content-Type: application/json

Parameters:
  - amount (from form input)
  - currency (from app config)
  - description (from form input)
  - customer_email (from form input)
```

### Step 3: Use in Softr App

Once configured, use REST API queries in your apps:

**Button Action:**
```
1. Add "Button" component
2. Click Action → API Call → Select "Stripe API"
3. Map form fields to API parameters
4. Configure success/error handling
5. Test with button click
```

### Plan Requirements

| Plan | REST API | Webhooks | Workflows |
|------|:---:|:---:|:---:|
| **Free** | ❌ | ❌ | ❌ |
| **Professional** | ✅ | ✅ | ✅ |
| **Business** | ✅ | ✅ | ✅ |
| **Enterprise** | ✅ | ✅ | ✅ |

---

## Custom Workflows Capabilities

### What Are Softr Workflows?

**Softr Workflows** are automated processes that respond to events (triggers) and execute actions. They support:

- Event-based triggers (form submit, record change, schedule)
- Multiple action types (API calls, emails, data updates)
- Custom code blocks (JavaScript/Python)
- Conditional logic
- Retry mechanisms

### Workflow Structure

```
TRIGGER (When does this happen?)
  ↓
CONDITIONS (Additional rules?)
  ↓
ACTIONS (What to do?)
  ├─ Action 1: Send Email
  ├─ Action 2: Call API
  ├─ Action 3: Code Block
  ├─ Action 4: Update Record
  └─ Action N: ...
  ↓
ERROR HANDLING (If something fails?)
  └─ Retry/Fallback actions
```

### Supported Triggers

| Trigger | Fired When | Data Available |
|---------|-----------|-----------------|
| **Record Created** | New record added | Record fields, table info |
| **Record Updated** | Existing record changed | Old values, new values, changed fields |
| **Record Deleted** | Record removed | Record ID, deleted data |
| **Webhook** | External POST to webhook URL | Custom JSON payload |
| **Schedule** | Time interval (daily, weekly, etc.) | Current timestamp |
| **Button Click** | User clicks workflow button | Form data, context |

### Supported Actions

| Action | Purpose | Example |
|--------|---------|---------|
| **Send Email** | Notify users | Send task completion email |
| **Call API** | Integrate external services | POST to Salesforce/Stripe |
| **Create Record** | Add data | Create activity log entry |
| **Update Record** | Modify data | Mark record as processed |
| **Code Block** | Custom logic | Transform data, calculate values |
| **Send to Zapier** | Trigger Zapier workflow | Complex automation |
| **Trigger Webhook** | Send data to external system | Notify webhook listener |
| **Conditional Block** | Branch logic | If X then Y else Z |

### Code Block Support

**JavaScript Example:**

```javascript
// Input: Record that triggered workflow
const record = input_data;

// Custom logic
const calculated = record.amount * 1.1;  // Add 10%
const status = record.value > 1000 ? 'premium' : 'standard';

// Output to next action
return {
  recordId: record.id,
  calculatedValue: calculated,
  tierStatus: status,
  timestamp: new Date().toISOString()
};
```

**Python Example:**

```python
import json
from datetime import datetime

record = input_data

# Custom logic
calculated = record['amount'] * 1.1
status = 'premium' if record['value'] > 1000 else 'standard'

# Output
return {
    'recordId': record['id'],
    'calculatedValue': calculated,
    'tierStatus': status,
    'timestamp': datetime.now().isoformat()
}
```

---

## Softr Database API Reference

### Overview

The **Softr Database API** allows you to read and write records programmatically.

**Base URL:** `https://tables-api.softr.io/api/v1`

### Authentication

**Method:** Personal Access Token

**Header:**
```
Softr-Api-Key: YOUR_API_KEY
```

**Get Your API Key:**
```
Dashboard → Workspace Settings → API Keys → Create New Token
```

### Rate Limits

- **Paid Plans:** 20 calls/second per API token
- **Free Plans:** 10 calls/second per API token
- **Error:** HTTP 429 (Too Many Requests)

### Core Endpoints

#### 1. List Databases

**Request:**
```http
GET /databases
Headers:
  Softr-Api-Key: YOUR_API_KEY
```

**Response:**
```json
{
  "databases": [
    {
      "id": "db_123abc",
      "name": "PFMS Database",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

#### 2. Get Database Details

**Request:**
```http
GET /databases/{DATABASE_ID}
Headers:
  Softr-Api-Key: YOUR_API_KEY
```

**Response:**
```json
{
  "id": "db_123abc",
  "name": "PFMS Database",
  "tables": [
    {
      "id": "tbl_tasks_456def",
      "name": "Tasks",
      "fields": [
        {
          "id": "fld_title_789ghi",
          "name": "Title",
          "type": "text"
        }
      ]
    }
  ]
}
```

#### 3. List Records

**Request:**
```http
GET /databases/{DATABASE_ID}/tables/{TABLE_ID}/records
Headers:
  Softr-Api-Key: YOUR_API_KEY
Query Params:
  offset: 0
  limit: 100
```

**Response:**
```json
{
  "records": [
    {
      "id": "rec_task_001",
      "fields": {
        "Title": "Complete project report",
        "Status": "In Progress",
        "DueDate": "2024-06-30"
      },
      "createdAt": "2024-06-15T10:30:00Z",
      "updatedAt": "2024-06-18T14:25:30Z"
    }
  ],
  "total": 150,
  "offset": 0,
  "limit": 100
}
```

#### 4. Create Record

**Request:**
```http
POST /databases/{DATABASE_ID}/tables/{TABLE_ID}/records
Headers:
  Softr-Api-Key: YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "fields": {
    "Title": "New task from API",
    "Status": "To Do",
    "AssignedTo": "user@example.com"
  }
}
```

**Response:**
```json
{
  "id": "rec_task_999",
  "fields": {
    "Title": "New task from API",
    "Status": "To Do",
    "AssignedTo": "user@example.com"
  },
  "createdAt": "2024-06-19T10:30:00Z"
}
```

#### 5. Update Record

**Request:**
```http
PATCH /databases/{DATABASE_ID}/tables/{TABLE_ID}/records/{RECORD_ID}
Headers:
  Softr-Api-Key: YOUR_API_KEY
  Content-Type: application/json

Body:
{
  "fields": {
    "Status": "Done",
    "CompletedDate": "2024-06-19"
  }
}
```

**Response:**
```json
{
  "id": "rec_task_001",
  "fields": {
    "Title": "Complete project report",
    "Status": "Done",
    "CompletedDate": "2024-06-19"
  },
  "updatedAt": "2024-06-19T15:45:00Z"
}
```

#### 6. Delete Record

**Request:**
```http
DELETE /databases/{DATABASE_ID}/tables/{TABLE_ID}/records/{RECORD_ID}
Headers:
  Softr-Api-Key: YOUR_API_KEY
```

**Response:**
```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "error": "Invalid request body",
  "details": "Field 'Title' is required"
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid API key",
  "code": "INVALID_AUTH"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## REST API Integration Guide

### What Is a REST API Integration?

A **REST API Integration** in Softr is a configured connection to an external REST API. It allows you to:

1. Call external APIs from Softr apps
2. Store responses in Softr database
3. Use API data in UI components
4. Automate workflows with external services

### Supported HTTP Methods

- **GET** - Retrieve data
- **POST** - Create records
- **PUT** - Replace records
- **PATCH** - Partial updates
- **DELETE** - Remove records

### Authentication Methods

#### 1. No Authentication

For public APIs without auth:

```
No headers needed
Base URL: https://api.publicapi.com/v1
```

#### 2. API Key (Header)

For APIs using API key in header:

```
Header:
  X-API-Key: sk_live_YOUR_KEY
  
OR
  
  Authorization: Bearer sk_live_YOUR_KEY
```

#### 3. Bearer Token

For OAuth 2.0 or bearer token auth:

```
Header:
  Authorization: Bearer your_access_token_here
```

#### 4. Custom Headers

For APIs requiring custom headers:

```
Headers:
  Authorization: Bearer TOKEN
  X-Custom-Header: value
  Content-Type: application/json
```

### Request/Response Mapping

**Example: Stripe Payment Integration**

**API Specification:**
```
Endpoint: POST https://api.stripe.com/v1/payment_intents
Headers:
  Authorization: Bearer sk_live_YOUR_SECRET_KEY
Body (form-encoded):
  amount: 2000 (in cents)
  currency: usd
  description: "Purchase from PFMS"
```

**Softr Integration Configuration:**

```
Name: Stripe Payment
Base URL: https://api.stripe.com/v1
Method: POST
Endpoint: /payment_intents

Authentication:
  Type: Bearer Token
  Token: sk_live_YOUR_SECRET_KEY

Request Parameters:
  amount: form.amount * 100  (convert to cents)
  currency: "usd"
  description: form.description

Request Headers:
  Content-Type: application/x-www-form-urlencoded
```

**Expected Response:**

```json
{
  "id": "pi_1234567890",
  "object": "payment_intent",
  "amount": 2000,
  "currency": "usd",
  "customer": "cus_XXXXX",
  "description": "Purchase from PFMS",
  "status": "requires_payment_method",
  "client_secret": "pi_123456_secret_XXX"
}
```

**Using in Softr App:**

```javascript
// In Softr Button Action
1. Click Action → Call API → Select Stripe Payment
2. Map:
   form.amount → amount parameter
   form.description → description parameter
3. On Success:
   Create record in Payments table
   Store response.id as transaction_id
4. On Error:
   Show error message to user
   Log to error tracking
```

### Example: Salesforce CRM Integration

**Setup:**

```
Base URL: https://YOUR_INSTANCE.salesforce.com/services/data/v57.0

Headers:
  Authorization: Bearer YOUR_SALESFORCE_ACCESS_TOKEN
  Content-Type: application/json
```

**Create Contact:**

```http
POST /sobjects/Contact
Body:
{
  "FirstName": "John",
  "LastName": "Doe",
  "Email": "john@example.com",
  "Phone": "(555) 123-4567"
}
```

**Update Contact:**

```http
PATCH /sobjects/Contact/003XXXXX
Body:
{
  "Email": "newemail@example.com",
  "Phone": "(555) 987-6543"
}
```

**Query Contacts:**

```http
GET /query?q=SELECT+Id,FirstName,LastName,Email+FROM+Contact
```

---

## Webhook Integration Patterns

### Incoming Webhooks (External → Softr)

External systems can trigger Softr workflows by sending HTTP POST to a webhook URL.

#### Create Webhook in Softr

**In Softr Workflow:**

```
1. Create New Workflow
2. Select Trigger: "Webhook"
3. System generates URL:
   https://softr-webhooks.your-app-id.events
4. Copy URL to external system
5. Configure what data webhook receives
```

#### Configure External System to Send

**Example: Zapier sending to Softr**

```
Zapier Action: Make a POST request
URL: https://softr-webhooks.your-app-id.events
Headers:
  Content-Type: application/json
Body:
{
  "userId": {{userId}},
  "action": "{{action}}",
  "timestamp": "{{timestamp}}"
}
```

#### Webhook Payload in Softr Workflow

```javascript
// The payload is available in workflow
const webhookData = input_data;

console.log(webhookData);
// {
//   "userId": "user123",
//   "action": "purchase_completed",
//   "timestamp": "2024-06-19T10:30:00Z"
// }

// Process the data
return {
  processed: true,
  userId: webhookData.userId,
  action: webhookData.action
};
```

### Outgoing Webhooks (Softr → External)

Softr can send data to external systems after events occur.

#### Method 1: Trigger Webhook Action

**In Softr Workflow:**

```
1. Add Action → Trigger Webhook
2. Configure:
   Webhook URL: https://your-api.com/softr-webhook
   HTTP Method: POST
   Headers: Authorization: Bearer YOUR_TOKEN
   Body: 
   {
     "event": "record_created",
     "recordId": "{{record.id}}",
     "timestamp": "{{timestamp}}"
   }
```

#### Method 2: Call API Action

More flexible for external API calls:

```
1. Add Action → Call API
2. Configure:
   Method: POST
   URL: https://your-api.com/process
   Headers: 
     Authorization: Bearer YOUR_TOKEN
     Content-Type: application/json
   Body:
   {
     "action": "process_task",
     "taskId": "{{record.id}}",
     "taskTitle": "{{record.title}}",
     "timestamp": "{{now()}}"
   }
```

#### Receiving Webhook in External System

**Express.js Example:**

```javascript
const express = require('express');
const app = express();

app.post('/softr-webhook', express.json(), (req, res) => {
  const payload = req.body;
  
  console.log('Received from Softr:', payload);
  // {
  //   event: 'record_created',
  //   recordId: 'rec_123',
  //   timestamp: '2024-06-19T...'
  // }
  
  // Process the data
  processTask(payload.recordId);
  
  // Send success response
  res.json({ success: true, processed: payload.recordId });
});

app.listen(3000, () => console.log('Listening for Softr webhooks'));
```

### Webhook Best Practices

1. **Always return 2xx status** - Softr expects success response
2. **Verify payload signature** - If using API keys in headers
3. **Handle retries** - Softr retries failed webhooks
4. **Process asynchronously** - Don't block on long operations
5. **Log everything** - Keep audit trail of integrations

---

## Step-by-Step Integration Setup

### Scenario 1: Stripe Payment Processing

**Goal:** Users pay via Stripe, record payment in Softr

#### Step 1: Get Stripe API Key

```
Stripe Dashboard → API Keys → Copy Secret Key (sk_live_...)
```

#### Step 2: Create Softr Data Source

```
Softr Dashboard:
  Settings → Data Sources
  → Connect Data Source
  → REST API
  
Configuration:
  Name: "Stripe Payments"
  Base URL: https://api.stripe.com/v1
  
  Headers:
    Authorization: Bearer sk_live_YOUR_KEY
    Content-Type: application/x-www-form-urlencoded
```

#### Step 3: Create Workflow

```
Create Workflow → Name: "Process Payment"
  
Trigger: Form Submission (Payment Form)
  
Condition (Optional):
  amount > 0
  
Action 1: Call API
  Method: POST
  Endpoint: /payment_intents
  Parameters:
    amount: form.amount * 100
    currency: form.currency || 'usd'
    customer_email: form.email
  
Action 2: Code Block (Transform Response)
  const response = input_data;
  return {
    stripe_id: response.id,
    client_secret: response.client_secret,
    amount: response.amount / 100,
    status: response.status
  };
  
Action 3: Create Record
  Table: Payments
  Fields:
    StripeIntentId: output.stripe_id
    CustomerEmail: form.email
    Amount: output.amount
    Status: output.status
    
Action 4: Send Email
  To: form.email
  Subject: Payment Received
  Body: Your payment has been processed...
```

#### Step 4: Add Payment Button to App

```
Add Button Component
  Label: "Pay Now"
  Action: Trigger Workflow → "Process Payment"
  
On Success:
  Show: "Payment successful!"
  Redirect: /thank-you
  
On Error:
  Show: Error message
  Log: error details
```

#### Step 5: Test

```
1. Fill payment form
2. Click "Pay Now"
3. Check Softr logs
4. Verify payment in Stripe Dashboard
5. Verify record created in Softr
6. Check email delivery
```

### Scenario 2: HubSpot CRM Sync

**Goal:** Create HubSpot contacts from Softr form submissions

#### Step 1: Get HubSpot API Token

```
HubSpot → Settings → API → Private Apps → Create Token
Copy token and note scopes needed:
  - crm.objects.contacts.write
  - crm.objects.contacts.read
```

#### Step 2: Create Softr Data Source

```
Settings → Data Sources → REST API

Name: "HubSpot Contacts"
Base URL: https://api.hubapi.com/crm/v3

Headers:
  Authorization: Bearer YOUR_HUBSPOT_TOKEN
  Content-Type: application/json
```

#### Step 3: Create Workflow

```
Workflow: "Sync Contact to HubSpot"

Trigger: Form Submission (Contact Form)

Action 1: Call API (Create or Update Contact)
  Method: POST
  Endpoint: /objects/contacts
  Body:
  {
    "properties": {
      "firstname": form.firstName,
      "lastname": form.lastName,
      "email": form.email,
      "phone": form.phone,
      "company": form.company
    }
  }
  
Action 2: Code Block (Extract Contact ID)
  const response = input_data;
  return {
    hubspot_id: response.id,
    email: response.properties.email.value
  };
  
Action 3: Create Record (Store link)
  Table: Contacts
  Fields:
    FirstName: form.firstName
    LastName: form.lastName
    Email: form.email
    HubSpotID: output.hubspot_id
    SyncedAt: "{{now()}}"
    
Action 4: Trigger Webhook
  URL: https://your-system.com/contact-synced
  Body:
  {
    "softrId": "{{record.id}}",
    "hubspotId": output.hubspot_id,
    "email": form.email
  }
```

#### Step 4: Test & Monitor

```
1. Submit contact form
2. Check workflow logs
3. Verify in HubSpot CRM
4. Verify record in Softr
5. Monitor both systems for sync
```

---

## Code Examples & Implementation Patterns

### Example 1: Basic API Call

**JavaScript in Softr Workflow:**

```javascript
// Simple POST request to external API
const response = await fetch('https://api.example.com/tasks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: input_data.title,
    description: input_data.description,
    assignee: input_data.assignee
  })
});

const result = await response.json();

return {
  success: response.ok,
  externalId: result.id,
  status: result.status
};
```

### Example 2: Data Transformation

**Transform API response before storing:**

```javascript
// Input: Data from form or webhook
const incoming = input_data;

// Transform
const transformed = {
  recordId: incoming.id,
  title: incoming.name.toUpperCase(),
  description: incoming.details || 'No description',
  amount: parseFloat(incoming.price),
  category: incoming.type.toLowerCase(),
  createdAt: new Date(incoming.dateCreated).toISOString(),
  tags: incoming.keywords ? incoming.keywords.split(',') : []
};

// Validate
if (!transformed.recordId) {
  throw new Error('Missing record ID');
}

return transformed;
```

### Example 3: Error Handling & Retries

**Robust API call with error handling:**

```javascript
const API_URL = 'https://api.example.com/data';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function callWithRetry(attempt = 1) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input_data)
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      // Wait before retrying
      await new Promise(resolve => 
        setTimeout(resolve, RETRY_DELAY * attempt)
      );
      return callWithRetry(attempt + 1);
    }
    
    // All retries failed
    throw new Error(`Failed after ${MAX_RETRIES} attempts: ${error.message}`);
  }
}

try {
  const result = await callWithRetry();
  return { success: true, data: result };
} catch (error) {
  return { 
    success: false, 
    error: error.message,
    timestamp: new Date().toISOString()
  };
}
```

### Example 4: Conditional Logic

**Branch based on data:**

```javascript
const record = input_data;

// Determine action based on data
let action = 'none';
let priority = 'normal';

if (record.amount > 10000) {
  action = 'review_required';
  priority = 'high';
} else if (record.amount > 5000) {
  action = 'notify_manager';
  priority = 'medium';
} else {
  action = 'auto_approve';
  priority = 'low';
}

// Prepare response
return {
  recordId: record.id,
  action: action,
  priority: priority,
  requiresReview: priority === 'high',
  timestamp: new Date().toISOString()
};
```

### Example 5: API Pagination

**Handle paginated API responses:**

```javascript
const API_BASE = 'https://api.example.com/items';
const PAGE_SIZE = 50;
let allItems = [];
let currentPage = 1;

while (true) {
  const response = await fetch(
    `${API_BASE}?page=${currentPage}&limit=${PAGE_SIZE}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`
      }
    }
  );

  const data = await response.json();
  allItems = allItems.concat(data.items);

  // Check if more pages
  if (data.items.length < PAGE_SIZE || !data.hasMore) {
    break;
  }

  currentPage++;
}

return {
  totalItems: allItems.length,
  items: allItems,
  fetchedAt: new Date().toISOString()
};
```

### Example 6: Webhook Reception & Processing

**Handle incoming webhook in Softr Workflow:**

```javascript
// Webhook data received
const webhook = input_data;

// Validate webhook signature (if using one)
const signature = webhook.signature;
const secret = process.env.WEBHOOK_SECRET;

// Validate timestamp (prevent replay attacks)
const webhookTime = new Date(webhook.timestamp).getTime();
const now = Date.now();
const timeDiff = Math.abs(now - webhookTime);

if (timeDiff > 5 * 60 * 1000) {  // 5 minutes
  throw new Error('Webhook timestamp too old');
}

// Process based on event type
let processedData = {};

switch (webhook.event) {
  case 'payment.completed':
    processedData = {
      type: 'payment',
      amount: webhook.data.amount,
      currency: webhook.data.currency,
      status: 'completed'
    };
    break;
    
  case 'user.created':
    processedData = {
      type: 'user',
      userId: webhook.data.id,
      email: webhook.data.email,
      status: 'active'
    };
    break;
    
  default:
    throw new Error(`Unknown event type: ${webhook.event}`);
}

return {
  processed: true,
  eventType: webhook.event,
  data: processedData
};
```

---

## Authentication & Security

### API Key Management

**Store API Keys Securely:**

1. **Never hardcode** in workflows
2. **Use environment variables:**
   ```javascript
   const apiKey = process.env.STRIPE_SECRET_KEY;
   ```
3. **Rotate regularly** (quarterly recommended)
4. **Limit permissions** (only scopes needed)

### Bearer Token Patterns

```
Header: Authorization: Bearer YOUR_TOKEN

JavaScript:
const token = process.env.API_TOKEN;
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### OAuth 2.0 Flow

Softr increasingly supports OAuth for integrations:

```
1. User clicks "Connect [Service]"
2. Browser redirected to service auth page
3. User grants permission
4. Service returns code to Softr
5. Softr exchanges code for access token
6. Token stored securely (Softr backend)
7. Softr uses token for future API calls
```

**Advantages:**
- No storing user passwords
- Granular permission control
- Easy revocation
- Industry standard

### Rate Limiting Strategies

**Softr Rate Limits:**
- Paid: 20 calls/second
- Free: 10 calls/second

**Respect External API Limits:**

```javascript
// Add delay between calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function respectRateLimit() {
  for (const item of items) {
    await callAPI(item);
    await delay(500);  // 500ms between calls = 2 per second
  }
}
```

### Security Best Practices

| Practice | Implementation |
|----------|-----------------|
| **Verify HTTPS** | Only use https:// URLs |
| **Validate responses** | Check status codes before using data |
| **Use API keys** | Instead of passwords for integrations |
| **Log appropriately** | Never log sensitive data |
| **Implement timeouts** | Prevent hanging requests |
| **Sanitize user input** | Prevent injection attacks |
| **Check IP whitelisting** | If API supports it |
| **Monitor usage** | Watch for anomalies |

---

## Integration Marketplace & Pre-Built Connectors

### Native Softr Integrations (20+)

**Database & CRM:**
- Airtable (bi-directional sync)
- Google Sheets
- Supabase
- BigQuery
- HubSpot CRM
- Coda

**Payment Processing:**
- Stripe
- PayPal
- Buy Me a Coffee

**Analytics:**
- Google Analytics
- Mixpanel
- Amplitude

**Communication:**
- Slack
- Email (SMTP)
- Mailchimp
- Intercom

**Automation Platforms:**
- Zapier (5,000+ apps)
- Make/Integromat
- Pipedream
- n8n

### Extended Ecosystem (5,000+ via Zapier)

Softr connects to virtually any service through Zapier:

```
Softr ←→ Zapier ←→ 5,000+ apps

Includes:
- Salesforce, Oracle, SAP
- Jira, Asana, Monday.com
- Slack, Teams, Discord
- GitHub, GitLab
- AWS, Azure, Google Cloud
- And thousands more...
```

### Pre-Built Integration Examples

**Airtable Sync:**
```
Data source in Softr → Show Airtable records in UI
↓
User updates in Softr → Auto-saves to Airtable
```

**Stripe Payments:**
```
Payment button in Softr → Call Stripe API
↓
Create payment intent → Send to Stripe.js
↓
Payment completes → Create record in Softr
```

**Slack Notifications:**
```
Record created in Softr → Trigger workflow
↓
Send Slack message → Notify team
↓
Team clicks link → Go back to Softr record
```

---

## Advanced Patterns

### Pattern 1: Multi-Step API Chain

**Call multiple APIs in sequence:**

```javascript
// Step 1: Get customer from API
const customerRes = await fetch(
  `https://crm.example.com/customers/${input_data.customerId}`,
  { headers: { 'Authorization': `Bearer ${process.env.CRM_KEY}` } }
);
const customer = await customerRes.json();

// Step 2: Get invoices for customer
const invoicesRes = await fetch(
  `https://billing.example.com/invoices?customer=${customer.id}`,
  { headers: { 'Authorization': `Bearer ${process.env.BILLING_KEY}` } }
);
const invoices = await invoicesRes.json();

// Step 3: Calculate total owed
const totalOwed = invoices.items.reduce((sum, inv) => 
  sum + (inv.amount - inv.paid), 0
);

// Step 4: Update CRM with total owed
const updateRes = await fetch(
  `https://crm.example.com/customers/${customer.id}`,
  {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.CRM_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ totalOwed: totalOwed })
  }
);

return {
  customer: customer.name,
  invoiceCount: invoices.items.length,
  totalOwed: totalOwed
};
```

### Pattern 2: Batch Processing

**Process multiple records efficiently:**

```javascript
const records = input_data.records;  // Array of records
const results = [];

for (const record of records) {
  try {
    const response = await fetch('https://api.example.com/process', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(record)
    });

    const result = await response.json();
    results.push({
      recordId: record.id,
      status: 'success',
      externalId: result.id
    });
  } catch (error) {
    results.push({
      recordId: record.id,
      status: 'failed',
      error: error.message
    });
  }
}

return {
  processed: records.length,
  succeeded: results.filter(r => r.status === 'success').length,
  failed: results.filter(r => r.status === 'failed').length,
  results: results
};
```

### Pattern 3: Bi-Directional Sync

**Keep Softr and external system in sync:**

```
Softr Workflow A:
  Trigger: Record updated in Softr
  Action: Call API to update external system
  
External System:
  Trigger: Webhook from external system
  Action: Softr receives webhook
  
Softr Workflow B:
  Trigger: Webhook received
  Action: Update Softr record with external data
```

**Implementation:**

```javascript
// Softr Workflow: Sync to External
// Trigger: Record Updated

const record = input_data;

// Update external system
const externalUpdate = await fetch(
  `https://external-api.com/records/${record.externalId}`,
  {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.EXT_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: record.title,
      status: record.status,
      lastSyncedAt: new Date().toISOString()
    })
  }
);

const externalData = await externalUpdate.json();

return {
  softrId: record.id,
  externalId: record.externalId,
  synced: externalUpdate.ok,
  timestamp: new Date().toISOString()
};
```

### Pattern 4: Data Enrichment

**Call multiple APIs to enrich data:**

```javascript
const lead = input_data;

// Enrich with geographic data
const geoRes = await fetch(
  `https://api.geocoding.com/location?city=${lead.city}`,
  { headers: { 'Authorization': `Bearer ${process.env.GEO_KEY}` } }
);
const geoData = await geoRes.json();

// Enrich with company data
const companyRes = await fetch(
  `https://api.companydatabase.com/search?name=${lead.company}`,
  { headers: { 'Authorization': `Bearer ${process.env.COMPANY_KEY}` } }
);
const companyData = await companyRes.json();

// Combine
const enriched = {
  ...lead,
  geoLocation: geoData.coordinates,
  companyInfo: companyData.company,
  enrichedAt: new Date().toISOString()
};

return enriched;
```

---

## Troubleshooting & Best Practices

### Common Issues & Solutions

**Issue: 401 Unauthorized**
```
Cause: Invalid API key or expired token
Solution:
1. Verify API key is correct
2. Check token expiration
3. Regenerate token if needed
4. Test with Postman first
```

**Issue: 429 Rate Limit**
```
Cause: Too many requests per second
Solution:
1. Add delay between API calls
2. Use batch APIs if available
3. Contact API provider for limit increase
4. Implement request queuing
```

**Issue: CORS Error**
```
Cause: Browser security restriction (only in client-side code)
Solution:
1. Use Softr Workflows (server-side, no CORS)
2. Don't call external APIs from custom code blocks
3. Use Softr's REST API integrations instead
```

**Issue: Webhook Not Received**
```
Cause: External system not sending or URL incorrect
Solution:
1. Verify webhook URL is correct
2. Check firewall/security settings
3. Test webhook with curl/Postman
4. Verify response is 2xx status
5. Check external system logs
```

**Issue: Payload Too Large**
```
Cause: Request body exceeds API limit
Solution:
1. Reduce data size
2. Split into multiple requests
3. Compress data if supported
4. Contact API provider
```

### Performance Best Practices

| Practice | Benefit |
|----------|---------|
| **Add timeouts** | Prevent hanging requests |
| **Use pagination** | Handle large datasets |
| **Cache results** | Reduce API calls |
| **Batch operations** | Fewer individual calls |
| **Async processing** | Don't block UI |
| **Monitor logs** | Identify bottlenecks |
| **Test thoroughly** | Catch errors early |
| **Document APIs** | Easier maintenance |

### Monitoring & Logging

**In Softr Workflow Logs:**
```
Dashboard → Workflows → [Your Workflow] → Logs

View:
- Execution time
- Status (success/failed)
- Error messages
- Input/output data
- Retry attempts
```

**Example Log Entry:**
```
2024-06-19 10:30:45
Workflow: "Stripe Payment"
Status: SUCCESS
Duration: 1.23s
Input: { amount: 99.99, email: "user@example.com" }
Output: { stripe_id: "pi_1234567", status: "requires_payment_method" }
```

---

## Complete Use Case Example

### Scenario: Project Management System with Stripe Payments

**Business Requirements:**
1. Users submit project proposals in Softr
2. Proposal requests payment via Stripe
3. Payment confirmed → Create project in Softr
4. Project created → Send Slack notification
5. Team notified to start work

### Architecture

```
1. Softr Form (User Proposes Project)
   ↓
2. Workflow: Validate & Request Payment
   ├─ Validate project data
   └─ Call Stripe API
   ↓
3. Frontend: Stripe Checkout (Client-side)
   ↓
4. Stripe Confirms Payment
   ↓
5. Webhook: Payment Received
   ├─ Create project record
   ├─ Send Slack notification
   └─ Log transaction
   ↓
6. Team Alerted & Starts Work
```

### Implementation Steps

#### Step 1: Create Form in Softr

**Fields:**
- Project Title
- Description
- Estimated Hours
- Client Email
- Budget

#### Step 2: Create Workflow 1 - "Request Payment"

```javascript
// Trigger: Form Submission
// Action: Call Stripe API

const project = input_data;
const amount = project.estimatedHours * 150 * 100;  // $150/hour, in cents

const paymentIntent = await fetch(
  'https://api.stripe.com/v1/payment_intents',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      amount: amount,
      currency: 'usd',
      customer_email: project.clientEmail,
      description: `Project: ${project.title}`,
      metadata: {
        projectTitle: project.title,
        estimatedHours: project.estimatedHours
      }
    })
  }
);

const intent = await paymentIntent.json();

if (!paymentIntent.ok) {
  throw new Error(`Stripe error: ${intent.error.message}`);
}

return {
  clientSecret: intent.client_secret,
  intendId: intent.id,
  amount: intent.amount / 100,
  currency: intent.currency
};
```

**Next Action: Create Record**
```
Table: ProjectProposals
Fields:
  Title: project.title
  Description: project.description
  ClientEmail: project.clientEmail
  StripeIntentId: output.clientSecret
  Amount: output.amount
  Status: "Awaiting Payment"
```

#### Step 3: Create Workflow 2 - "Process Payment Confirmation"

```
Trigger: Webhook
  (Stripe sends payment success webhook)

Action 1: Code Block - Validate
  const webhook = input_data;
  
  if (webhook.type !== 'payment_intent.succeeded') {
    return { skip: true };  // Not a payment event
  }
  
  return {
    stripeIntentId: webhook.data.object.id,
    amount: webhook.data.object.amount / 100,
    email: webhook.data.object.customer_email
  };

Action 2: Find Related Proposal
  Query Proposals table for StripeIntentId = webhook intent ID

Action 3: Create Project Record
  Table: Projects
  Fields:
    Title: proposal.title
    Description: proposal.description
    ClientEmail: proposal.clientEmail
    Budget: output.amount
    Status: "Not Started"
    CreatedFrom: proposal.id
    PaymentConfirmedAt: "{{now()}}"

Action 4: Update Proposal
  Update Proposals record
  Status: "Payment Confirmed"
  ProjectId: new_project.id

Action 5: Send Slack Notification
  Channel: #new-projects
  Message: 
    "New project: {{project.title}}
     Client: {{project.clientEmail}}
     Budget: ${{project.budget}}
     View: [Link to project]"

Action 6: Send Email to Client
  To: project.clientEmail
  Subject: "Payment Received - Project {{project.title}}"
  Body: "Thank you! Your project has been created..."
```

#### Step 4: Add Payment Button to UI

**In Softr:**
1. Add "Button" component: "Process Payment"
2. On click: Open Stripe checkout with clientSecret
3. After payment: Refresh page

**HTML/JavaScript (in custom code block):**
```html
<script src="https://js.stripe.com/v3/"></script>

<div id="payment-element"></div>
<button id="submit">Pay Now</button>

<script>
  const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');
  const elements = stripe.elements({
    clientSecret: window.softrData.paymentClientSecret
  });
  
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');
  
  document.getElementById('submit').addEventListener('click', async () => {
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href + '?payment=success'
      }
    });
    
    if (error) {
      console.error(error);
    }
  });
</script>
```

#### Step 5: Test End-to-End

```
1. ✓ Submit project form
2. ✓ See Stripe payment button
3. ✓ Use test card: 4242 4242 4242 4242
4. ✓ Complete payment
5. ✓ Receive success page
6. ✓ Check Softr database for new project record
7. ✓ Verify Slack notification in #new-projects
8. ✓ Receive confirmation email
```

---

## Conclusion

### Key Takeaways

✅ **Yes, you can build custom integrations in Softr**

**Three Methods:**
1. **REST API Data Sources** (easiest, no-code)
2. **Custom Workflows** (powerful, code blocks supported)
3. **Direct Softr API** (most flexible, code required)

**Supported Protocols:**
- HTTPS REST with JSON
- All HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Webhooks for external triggers
- Multiple authentication methods

**Integration Marketplace:**
- 20+ pre-built connectors
- 5,000+ via Zapier
- Unlimited custom via REST API

**Production Ready:**
- Enterprise-grade reliability
- Rate limiting & error handling
- Security best practices
- Logging & monitoring

### Next Steps

1. **Identify your integration need**
   - What external system to connect?
   - What data to sync?
   - How often?

2. **Get API documentation**
   - Endpoint URLs
   - Authentication method
   - Request/response format
   - Rate limits

3. **Create in Softr**
   - Data source OR workflow
   - Test with sample data
   - Monitor & optimize

4. **Deploy to production**
   - Verify security
   - Set up logging
   - Monitor usage
   - Plan maintenance

---

## Resources

### Official Documentation
- [Softr Database API](https://docs.softr.io/softr-api/)
- [REST API Integration Guide](https://www.softr.io/data-sources/rest-api)
- [Workflows Documentation](https://docs.softr.io/workflows/workflows)
- [Call API Action](https://docs.softr.io/actions/call-api)
- [Webhook Integration](https://docs.softr.io/integrations/)

### API Standards
- [REST API Best Practices](https://restfulapi.net/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [JSON Schema Documentation](https://json-schema.org/)

### Tools for Testing
- [Postman](https://www.postman.com/) - API testing
- [Insomnia](https://insomnia.rest/) - REST client
- [Webhook.site](https://webhook.site/) - Test webhooks
- [RequestBin](https://requestbin.com/) - Inspect requests

### Community Resources
- [Softr Community Forum](https://community.softr.io/)
- [Zapier/Make Integration Examples](https://zapier.com/apps)
- [API Documentation Search](https://api.openai.com) - Format reference

---

**Last Updated:** June 19, 2026  
**Viability Score:** 9/10 - PRODUCTION READY  
**Recommendation:** Start with REST API Data Sources for simplicity, advance to Workflows for complex automation

---

*This guide is a comprehensive reference for building custom integrations with Softr. All information current as of June 2026.*
