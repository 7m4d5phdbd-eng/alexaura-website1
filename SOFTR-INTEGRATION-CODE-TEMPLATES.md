# Softr Custom Integrations - Code Templates & Examples
**Ready-to-Use Code Patterns for Common Integration Scenarios**

---

## Table of Contents

1. [REST API Call Templates](#rest-api-call-templates)
2. [Data Transformation Templates](#data-transformation-templates)
3. [Error Handling & Retry Patterns](#error-handling--retry-patterns)
4. [Webhook Reception Templates](#webhook-reception-templates)
5. [Specific Service Integrations](#specific-service-integrations)
6. [Complete Workflow Examples](#complete-workflow-examples)
7. [Testing & Debugging](#testing--debugging)

---

## REST API Call Templates

### Template 1: Simple GET Request

**Use For:** Retrieving data from external API

```javascript
// Softr Workflow Code Block
// Trigger: Button Click / Manual Workflow
// Input: Record with API endpoint URL

const apiUrl = input_data.apiUrl;  // e.g., 'https://api.example.com/users/123'
const apiKey = process.env.EXTERNAL_API_KEY;

try {
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return {
    success: true,
    data: data,
    fetchedAt: new Date().toISOString()
  };

} catch (error) {
  return {
    success: false,
    error: error.message,
    timestamp: new Date().toISOString()
  };
}
```

### Template 2: POST Request with JSON Body

**Use For:** Creating records in external systems

```javascript
// Create a new record in external API
// Input: { name, email, phone }

const payload = {
  firstName: input_data.firstName,
  lastName: input_data.lastName,
  email: input_data.email,
  phone: input_data.phone,
  source: 'softr-app'
};

try {
  const response = await fetch(
    'https://api.example.com/v1/contacts',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || 'Creation failed');
  }

  return {
    success: true,
    recordId: result.id,
    createdAt: result.createdAt
  };

} catch (error) {
  console.error('POST error:', error);
  throw error;
}
```

### Template 3: PATCH Request (Update)

**Use For:** Updating existing records

```javascript
// Update record in external API
// Input: { recordId, updates: { field1: value1, ... } }

const recordId = input_data.recordId;
const updates = input_data.updates;

const response = await fetch(
  `https://api.example.com/v1/records/${recordId}`,
  {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  }
);

if (!response.ok) {
  throw new Error(`Update failed: ${response.status}`);
}

const updated = await response.json();

return {
  success: true,
  recordId: updated.id,
  updatedAt: updated.updatedAt,
  changes: updates
};
```

### Template 4: DELETE Request

**Use For:** Removing records from external system

```javascript
// Delete record from external API
// Input: { recordId }

const recordId = input_data.recordId;

const response = await fetch(
  `https://api.example.com/v1/records/${recordId}`,
  {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`
    }
  }
);

if (response.status === 204) {
  return {
    success: true,
    deleted: recordId,
    timestamp: new Date().toISOString()
  };
} else if (response.ok) {
  const result = await response.json();
  return {
    success: true,
    deleted: recordId,
    message: result.message
  };
} else {
  throw new Error(`Delete failed: ${response.status}`);
}
```

### Template 5: Query String Parameters

**Use For:** Filtering, searching, pagination

```javascript
// GET request with query parameters
// Input: { search: 'term', limit: 10, offset: 0 }

const params = new URLSearchParams({
  q: input_data.search,
  limit: input_data.limit || 50,
  offset: input_data.offset || 0,
  sort: 'updated_desc'
});

const response = await fetch(
  `https://api.example.com/v1/search?${params.toString()}`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`
    }
  }
);

const results = await response.json();

return {
  total: results.total,
  count: results.items.length,
  items: results.items,
  nextOffset: results.nextOffset
};
```

### Template 6: Form-Encoded Data

**Use For:** APIs requiring form-encoded bodies (e.g., Stripe)

```javascript
// POST with form-encoded body
// Input: { amount, currency, description }

const formData = new URLSearchParams({
  amount: Math.round(input_data.amount * 100),  // Convert to cents
  currency: input_data.currency || 'usd',
  description: input_data.description,
  metadata: JSON.stringify({
    source: 'softr',
    timestamp: new Date().toISOString()
  })
});

const response = await fetch(
  'https://api.stripe.com/v1/payment_intents',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  }
);

const result = await response.json();

return {
  intentId: result.id,
  clientSecret: result.client_secret,
  amount: result.amount / 100,
  status: result.status
};
```

### Template 7: Custom Headers

**Use For:** APIs requiring special headers

```javascript
// Request with multiple custom headers
// Input: record data

const response = await fetch(
  'https://api.example.com/v1/data',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'X-API-Version': '2024-06',
      'X-Request-ID': generateUUID(),
      'X-Idempotency-Key': input_data.transactionId,
      'Content-Type': 'application/json',
      'User-Agent': 'Softr/1.0'
    },
    body: JSON.stringify(input_data)
  }
);

const result = await response.json();

return {
  success: response.ok,
  data: result,
  responseHeaders: {
    requestId: response.headers.get('x-request-id'),
    rateLimit: response.headers.get('x-ratelimit-remaining')
  }
};

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

---

## Data Transformation Templates

### Template 1: Simple Field Mapping

**Transform API response to Softr record format**

```javascript
// Input: Response from external API
// Output: Softr record fields

const apiResponse = input_data;

const transformed = {
  // Map external fields to Softr fields
  externalId: apiResponse.id,
  name: apiResponse.full_name || apiResponse.name,
  email: apiResponse.email_address || apiResponse.email,
  phone: apiResponse.phone_number,
  company: apiResponse.organization?.name,
  country: apiResponse.address?.country,
  
  // Add metadata
  lastSyncedAt: new Date().toISOString(),
  source: 'external_api'
};

// Validate required fields
if (!transformed.email) {
  throw new Error('Email is required but not provided');
}

return transformed;
```

### Template 2: Date Format Conversion

**Convert between date formats**

```javascript
// Input: Record with various date formats
// Output: ISO format dates for Softr

const record = input_data;

// Helper function
function toISODate(dateString) {
  if (!dateString) return null;
  
  // Try parsing as ISO
  const iso = new Date(dateString);
  if (!isNaN(iso)) return iso.toISOString();
  
  // Try parsing as timestamp (milliseconds)
  const ts = parseInt(dateString);
  if (!isNaN(ts)) return new Date(ts).toISOString();
  
  // Try manual parsing (MM/DD/YYYY)
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return new Date(parts[2], parts[0] - 1, parts[1]).toISOString();
  }
  
  throw new Error(`Cannot parse date: ${dateString}`);
}

const transformed = {
  recordId: record.id,
  createdAt: toISODate(record.created_date),
  modifiedAt: toISODate(record.modified_date),
  dueDate: toISODate(record.due_date)
};

return transformed;
```

### Template 3: Currency & Amount Conversion

**Normalize numeric values**

```javascript
// Input: Record with currency amounts
// Output: Standardized amounts

const record = input_data;

function normalizeAmount(value, fromCurrency = 'USD') {
  // Parse the value
  const amount = typeof value === 'string' 
    ? parseFloat(value.replace(/[^\d.]/g, ''))
    : parseFloat(value);

  if (isNaN(amount)) {
    throw new Error(`Invalid amount: ${value}`);
  }

  // Store in smallest unit (cents for USD)
  return Math.round(amount * 100);
}

const transformed = {
  recordId: record.id,
  amountInCents: normalizeAmount(record.price),
  amountUSD: parseFloat(record.price),
  currency: record.currency || 'USD',
  
  // Tax calculation
  taxRate: parseFloat(record.tax_percent) / 100 || 0.08,
  taxAmount: normalizeAmount(record.price) * (parseFloat(record.tax_percent) / 100 || 0.08),
  
  // Total
  totalAmount: normalizeAmount(record.price) * (1 + (parseFloat(record.tax_percent) / 100 || 0.08))
};

return transformed;
```

### Template 4: Array Flattening & Nesting

**Handle nested structures**

```javascript
// Input: Nested API response
// Output: Flattened for Softr or formatted structure

const apiResponse = input_data;

// Flatten nested object
const flattened = {
  id: apiResponse.id,
  name: apiResponse.name,
  
  // Flatten nested properties
  cityName: apiResponse.address?.city,
  stateName: apiResponse.address?.state,
  zipCode: apiResponse.address?.zip,
  
  // Join array of objects to string
  phoneNumbers: apiResponse.phones
    ?.map(p => p.number)
    .join(', '),
  
  // Get first item from array
  primaryEmail: apiResponse.emails?.[0]?.address,
  
  // Count array items
  contactCount: apiResponse.contacts?.length || 0
};

// Or create nested structure if needed
const nested = {
  id: apiResponse.id,
  name: apiResponse.name,
  address: {
    street: apiResponse.street,
    city: apiResponse.city,
    state: apiResponse.state,
    zip: apiResponse.zip
  },
  contacts: apiResponse.phones?.map(p => ({
    type: p.type,
    value: p.number
  })) || []
};

return flattened;  // or return nested;
```

### Template 5: Conditional Transformation

**Transform based on conditions**

```javascript
// Input: Record with various states
// Output: Transformed based on conditions

const record = input_data;

let status = 'unknown';
let priority = 'normal';
let category = 'other';

// Status transformation
if (record.resolved === true) {
  status = 'completed';
} else if (record.in_progress === true) {
  status = 'in_progress';
} else if (record.pending === true) {
  status = 'pending';
} else {
  status = 'not_started';
}

// Priority calculation
if (record.urgency === 'critical' || record.impact_score > 80) {
  priority = 'critical';
} else if (record.urgency === 'high' || record.impact_score > 50) {
  priority = 'high';
} else if (record.urgency === 'low' || record.impact_score < 20) {
  priority = 'low';
}

// Category mapping
const categoryMap = {
  'BUG': 'defect',
  'FEATURE': 'enhancement',
  'DOCS': 'documentation',
  'TASK': 'task'
};
category = categoryMap[record.type] || 'other';

const transformed = {
  recordId: record.id,
  title: record.title,
  status: status,
  priority: priority,
  category: category,
  escalated: priority === 'critical',
  requiresAttention: status !== 'completed'
};

return transformed;
```

---

## Error Handling & Retry Patterns

### Template 1: Basic Try-Catch

**Simple error handling**

```javascript
// Input: API request parameters

try {
  const response = await fetch(
    'https://api.example.com/data',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input_data)
    }
  );

  if (!response.ok) {
    throw new Error(
      `API returned ${response.status}: ${response.statusText}`
    );
  }

  const data = await response.json();

  return {
    success: true,
    data: data
  };

} catch (error) {
  // Log error details
  console.error('API call failed:', {
    message: error.message,
    input: input_data,
    timestamp: new Date().toISOString()
  });

  return {
    success: false,
    error: error.message,
    retryable: error.message.includes('timeout') ||
               error.message.includes('503') ||
               error.message.includes('429')
  };
}
```

### Template 2: Retry with Exponential Backoff

**Retry failed requests with increasing delays**

```javascript
// Configuration
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;  // 1 second
const MAX_DELAY = 30000;     // 30 seconds
const BACKOFF_MULTIPLIER = 2;

async function callWithRetry(options, attemptNumber = 1) {
  try {
    const response = await fetch(options.url, {
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    // Don't retry on client errors
    if (response.status >= 400 && response.status < 500) {
      throw new Error(`Client error: ${response.status}`);
    }

    // Retry on server errors or rate limiting
    if (response.status >= 500 || response.status === 429) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    // Check if we should retry
    const isRetryable = 
      error.message.includes('Server error') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED');

    if (isRetryable && attemptNumber < MAX_RETRIES) {
      // Calculate delay with exponential backoff
      const delay = Math.min(
        INITIAL_DELAY * Math.pow(BACKOFF_MULTIPLIER, attemptNumber - 1),
        MAX_DELAY
      );

      console.log(
        `Retry ${attemptNumber}/${MAX_RETRIES} after ${delay}ms`
      );

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Recursive retry
      return callWithRetry(options, attemptNumber + 1);
    }

    // No more retries or not retryable
    throw error;
  }
}

// Usage
try {
  const result = await callWithRetry({
    url: 'https://api.example.com/data',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: input_data
  });

  return { success: true, data: result };

} catch (error) {
  return {
    success: false,
    error: error.message,
    timestamp: new Date().toISOString()
  };
}
```

### Template 3: Timeout Handling

**Add timeout to prevent hanging requests**

```javascript
// Create fetch with timeout
function fetchWithTimeout(url, options = {}, timeout = 30000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => {
        reject(new Error('Request timeout after ' + timeout + 'ms'));
      }, timeout)
    )
  ]);
}

// Usage
try {
  const response = await fetchWithTimeout(
    'https://api.example.com/data',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input_data)
    },
    10000  // 10 second timeout
  );

  const data = await response.json();

  return {
    success: true,
    data: data,
    responseTime: response.headers.get('x-response-time')
  };

} catch (error) {
  if (error.message.includes('timeout')) {
    return {
      success: false,
      error: 'Request timeout - API is not responding quickly',
      retryable: true
    };
  }

  throw error;
}
```

### Template 4: Validation Before API Call

**Validate input before making API request**

```javascript
// Validation schema
const requiredFields = ['email', 'name'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

// Validation logic
function validateInput(data) {
  const errors = [];

  // Check required fields
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Email validation
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Phone validation (if provided)
  if (data.phone && !phoneRegex.test(data.phone.replace(/\D/g, ''))) {
    errors.push('Phone must be 10 digits');
  }

  // Amount validation
  if (data.amount && (data.amount <= 0 || data.amount > 1000000)) {
    errors.push('Amount must be between 0 and 1,000,000');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

// Use validation
const validation = validateInput(input_data);

if (!validation.valid) {
  return {
    success: false,
    error: 'Validation failed',
    details: validation.errors
  };
}

// Proceed with API call
const response = await fetch(
  'https://api.example.com/records',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input_data)
  }
);

const result = await response.json();

return {
  success: response.ok,
  data: result
};
```

---

## Webhook Reception Templates

### Template 1: Basic Webhook Handler

**Receive and process incoming webhook**

```javascript
// Softr Workflow Trigger: Webhook
// External system sends POST to Softr webhook URL

const webhook = input_data;

// Log receipt
console.log('Webhook received:', {
  timestamp: new Date().toISOString(),
  event: webhook.event,
  dataSize: JSON.stringify(webhook).length
});

// Process based on event type
let processed = {};

switch (webhook.event) {
  case 'payment.completed':
    processed = {
      type: 'payment',
      paymentId: webhook.data.id,
      amount: webhook.data.amount,
      currency: webhook.data.currency,
      status: 'completed'
    };
    break;

  case 'user.created':
    processed = {
      type: 'user',
      userId: webhook.data.id,
      email: webhook.data.email,
      name: webhook.data.name,
      status: 'new'
    };
    break;

  case 'order.updated':
    processed = {
      type: 'order',
      orderId: webhook.data.id,
      status: webhook.data.status,
      items: webhook.data.items?.length || 0
    };
    break;

  default:
    throw new Error(`Unknown event type: ${webhook.event}`);
}

return {
  processed: true,
  eventType: webhook.event,
  data: processed,
  receivedAt: new Date().toISOString()
};
```

### Template 2: Webhook Signature Verification

**Verify webhook authenticity**

```javascript
// Softr Workflow: Webhook Trigger
// Verify incoming webhook is from trusted source

const crypto = require('crypto');

const webhook = input_data;
const secret = process.env.WEBHOOK_SECRET;
const signature = webhook.signature;
const payload = webhook.payload;
const timestamp = webhook.timestamp;

// Verify signature
function verifySignature(payload, signature, secret) {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload) + timestamp)
    .digest('hex');

  return computedSignature === signature;
}

// Verify timestamp (prevent replay attacks)
function verifyTimestamp(timestamp, maxAge = 5 * 60 * 1000) {
  const webhookTime = new Date(timestamp).getTime();
  const now = Date.now();
  return (now - webhookTime) < maxAge;
}

// Perform verifications
if (!verifySignature(payload, signature, secret)) {
  throw new Error('Invalid webhook signature');
}

if (!verifyTimestamp(timestamp)) {
  throw new Error('Webhook timestamp too old - possible replay attack');
}

// Webhook is verified, process it
return {
  verified: true,
  data: payload,
  timestamp: timestamp
};
```

### Template 3: Webhook Retry Handling

**Handle webhook retries from external system**

```javascript
// Softr Workflow: Webhook Trigger
// Handle potential duplicate webhook deliveries

const webhook = input_data;
const idempotencyKey = webhook.idempotency_key || webhook.id;

// Check if we've already processed this webhook
async function isProcessed(key) {
  // In production, check database for processed webhooks
  // For now, return false (implement with Softr database)
  return false;
}

// Mark webhook as processed
async function markProcessed(key) {
  // Create a record in ProcessedWebhooks table
  // This prevents duplicate processing on retries
  console.log(`Marked webhook ${key} as processed`);
}

const alreadyProcessed = await isProcessed(idempotencyKey);

if (alreadyProcessed) {
  // Already processed this webhook, return success without re-processing
  console.log(`Webhook ${idempotencyKey} already processed, skipping`);
  return {
    success: true,
    duplicate: true,
    idempotencyKey: idempotencyKey
  };
}

// Process webhook
const result = processWebhook(webhook);

// Mark as processed
await markProcessed(idempotencyKey);

return {
  success: true,
  duplicate: false,
  result: result
};

function processWebhook(webhook) {
  // Your webhook processing logic here
  return {
    processed: true,
    event: webhook.event,
    timestamp: new Date().toISOString()
  };
}
```

---

## Specific Service Integrations

### Integration 1: Stripe Payment Processing

```javascript
// Softr Workflow: Process Payment
// Trigger: Form Submission

const payment = input_data;

// Validate input
if (!payment.amount || !payment.email) {
  throw new Error('Missing amount or email');
}

// Create Stripe payment intent
const response = await fetch(
  'https://api.stripe.com/v1/payment_intents',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      amount: Math.round(payment.amount * 100),  // Convert to cents
      currency: payment.currency || 'usd',
      customer_email: payment.email,
      description: payment.description,
      metadata: JSON.stringify({
        source: 'softr',
        timestamp: new Date().toISOString()
      })
    })
  }
);

const intent = await response.json();

if (!response.ok) {
  throw new Error(`Stripe error: ${intent.error.message}`);
}

return {
  clientSecret: intent.client_secret,
  intentId: intent.id,
  amount: intent.amount / 100,
  currency: intent.currency,
  status: intent.status
};
```

### Integration 2: Slack Notifications

```javascript
// Softr Workflow: Send Slack Message
// Trigger: Record Created/Updated

const record = input_data;
const slackWebhook = process.env.SLACK_WEBHOOK_URL;

const message = {
  channel: '#projects',
  username: 'Softr Bot',
  icon_emoji: ':softr:',
  attachments: [
    {
      fallback: `New project: ${record.title}`,
      color: '#36a64f',
      title: record.title,
      title_link: `https://softr.app/project/${record.id}`,
      text: record.description,
      fields: [
        {
          title: 'Status',
          value: record.status,
          short: true
        },
        {
          title: 'Owner',
          value: record.owner,
          short: true
        },
        {
          title: 'Budget',
          value: `$${record.budget}`,
          short: true
        },
        {
          title: 'Due Date',
          value: new Date(record.dueDate).toLocaleDateString(),
          short: true
        }
      ],
      ts: Math.floor(Date.now() / 1000)
    }
  ]
};

const response = await fetch(slackWebhook, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(message)
});

if (!response.ok) {
  throw new Error('Failed to send Slack message');
}

return {
  success: true,
  message: 'Slack notification sent'
};
```

### Integration 3: SendGrid Email

```javascript
// Softr Workflow: Send Email via SendGrid
// Trigger: Form Submission / Record Update

const email = input_data;

const emailPayload = {
  personalizations: [
    {
      to: [{ email: email.to }],
      subject: email.subject
    }
  ],
  from: {
    email: process.env.SENDGRID_FROM_EMAIL,
    name: 'PFMS System'
  },
  content: [
    {
      type: 'text/html',
      value: email.htmlContent
    }
  ],
  replyTo: {
    email: email.replyTo || process.env.SENDGRID_FROM_EMAIL
  }
};

const response = await fetch(
  'https://api.sendgrid.com/v3/mail/send',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailPayload)
  }
);

if (!response.ok) {
  throw new Error(`SendGrid error: ${response.status}`);
}

return {
  success: true,
  message: 'Email queued successfully',
  to: email.to,
  timestamp: new Date().toISOString()
};
```

### Integration 4: HubSpot CRM

```javascript
// Softr Workflow: Create/Update HubSpot Contact
// Trigger: Form Submission

const contact = input_data;

const hubspotPayload = {
  properties: {
    firstname: contact.firstName,
    lastname: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    city: contact.city,
    state: contact.state,
    country: contact.country,
    lifecyclestage: contact.stage || 'subscriber'
  }
};

const response = await fetch(
  'https://api.hubapi.com/crm/v3/objects/contacts',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hubspotPayload)
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(`HubSpot error: ${result.message}`);
}

return {
  success: true,
  hubspotId: result.id,
  email: contact.email,
  createdAt: result.createdAt
};
```

---

## Complete Workflow Examples

### Example 1: Lead to Customer Flow

```javascript
// Complete workflow: Lead form → Enrich → Create in CRM → Send email

// Step 1: Validate input
const lead = input_data;
const requiredFields = ['email', 'name', 'company'];

const validation = requiredFields.filter(field => !lead[field]);
if (validation.length > 0) {
  throw new Error(`Missing fields: ${validation.join(', ')}`);
}

// Step 2: Enrich with IP geolocation
const geoResponse = await fetch(
  `https://ipapi.co/json/?callback=geoData`,
  { method: 'GET' }
);
const geoData = await geoResponse.json();

// Step 3: Create in HubSpot
const hubspotPayload = {
  properties: {
    firstname: lead.name.split(' ')[0],
    lastname: lead.name.split(' ')[1] || '',
    email: lead.email,
    company: lead.company,
    phone: lead.phone,
    country: geoData.country_name,
    source: 'softr-form'
  }
};

const crmResponse = await fetch(
  'https://api.hubapi.com/crm/v3/objects/contacts',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(hubspotPayload)
  }
);

const crmResult = await crmResponse.json();

// Step 4: Create in Softr database
const softrRecord = {
  leadId: crmResult.id,
  name: lead.name,
  email: lead.email,
  company: lead.company,
  country: geoData.country_name,
  source: 'web-form',
  createdAt: new Date().toISOString()
};

// Step 5: Send welcome email
const emailResponse = await fetch(
  'https://api.sendgrid.com/v3/mail/send',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: lead.email }],
        subject: `Welcome ${lead.name}`
      }],
      from: {
        email: process.env.FROM_EMAIL,
        name: 'Our Team'
      },
      content: [{
        type: 'text/html',
        value: `<h1>Welcome ${lead.name}!</h1><p>Thank you for your interest.</p>`
      }]
    })
  }
);

// Return complete result
return {
  success: true,
  hubspotId: crmResult.id,
  softrRecord: softrRecord,
  emailSent: emailResponse.ok,
  timestamp: new Date().toISOString()
};
```

### Example 2: Sync to Multiple Systems

```javascript
// Sync a single record to multiple external systems

const record = input_data;
const results = [];

// Target systems
const integrations = [
  {
    name: 'Salesforce',
    url: 'https://YOUR_INSTANCE.salesforce.com/services/data/v57.0/sobjects/Account',
    key: process.env.SALESFORCE_TOKEN,
    mapping: { name: 'Name', email: 'Email__c', phone: 'Phone' }
  },
  {
    name: 'HubSpot',
    url: 'https://api.hubapi.com/crm/v3/objects/companies',
    key: process.env.HUBSPOT_TOKEN,
    mapping: { name: 'name', email: 'email', phone: 'phone' }
  },
  {
    name: 'Pipedrive',
    url: 'https://api.pipedrive.com/v1/companies?api_token=YOUR_TOKEN',
    key: process.env.PIPEDRIVE_TOKEN,
    mapping: { name: 'name', email: 'email', phone: 'phone' }
  }
];

// Sync to each system
for (const integration of integrations) {
  try {
    // Map fields
    const payload = {};
    Object.entries(integration.mapping).forEach(([softrField, externalField]) => {
      payload[externalField] = record[softrField];
    });

    // Make request
    const response = await fetch(integration.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integration.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    results.push({
      system: integration.name,
      success: response.ok,
      externalId: result.id || result.data?.id,
      error: !response.ok ? result.error : null
    });
  } catch (error) {
    results.push({
      system: integration.name,
      success: false,
      error: error.message
    });
  }
}

return {
  recordId: record.id,
  syncResults: results,
  allSuccess: results.every(r => r.success),
  timestamp: new Date().toISOString()
};
```

---

## Testing & Debugging

### Testing Locally with curl

```bash
# Test Softr Webhook
curl -X POST https://softr-webhooks.your-app-id.events \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.completed",
    "data": {
      "id": "test-123",
      "amount": 99.99,
      "email": "test@example.com"
    }
  }'

# Test API Integration
curl -X POST https://api.example.com/v1/records \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Record",
    "email": "test@example.com"
  }'
```

### Debug Logging Template

```javascript
// Add to any workflow for detailed debugging

const record = input_data;
const debugInfo = {
  timestamp: new Date().toISOString(),
  inputData: JSON.stringify(record),
  environment: {
    hasAPIKey: !!process.env.API_KEY,
    nodeVersion: process.version
  }
};

console.log('DEBUG:', JSON.stringify(debugInfo, null, 2));

try {
  // Your code here
  const response = await fetch('https://api.example.com/test', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`
    },
    body: JSON.stringify(record)
  });

  console.log('DEBUG Response:', {
    status: response.status,
    headers: Object.fromEntries(response.headers),
    bodySize: (await response.text()).length
  });

} catch (error) {
  console.error('DEBUG Error:', {
    message: error.message,
    stack: error.stack,
    type: error.constructor.name
  });

  throw error;
}
```

---

## Tips for Success

1. **Test Incrementally** - Build and test one integration step at a time
2. **Use Environment Variables** - Never hardcode API keys
3. **Log Everything** - Make debugging easier with detailed logging
4. **Handle Errors** - Always plan for failures with try-catch
5. **Validate Input** - Check data before making API calls
6. **Respect Rate Limits** - Add delays between bulk operations
7. **Document APIs** - Keep reference of external API specifications
8. **Monitor Workflows** - Check Softr logs regularly
9. **Test Webhooks** - Use webhook.site for testing
10. **Keep Secrets Secure** - Rotate API keys regularly

---

**Last Updated:** June 19, 2026  
**Version:** 1.0 - Production Ready
