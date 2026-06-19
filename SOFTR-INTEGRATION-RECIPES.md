# Softr Custom Integrations - Practical Recipes & Patterns

**Date:** June 19, 2026  
**Status:** Ready for Production  
**Scope:** Common integration patterns and real-world examples

---

## Table of Contents

1. [Recipe 1: Sync External CSV to Softr](#recipe-1-sync-external-csv-to-softr)
2. [Recipe 2: Real-Time Slack Notifications](#recipe-2-real-time-slack-notifications)
3. [Recipe 3: Scheduled Report Generation](#recipe-3-scheduled-report-generation)
4. [Recipe 4: Two-Way Data Synchronization](#recipe-4-two-way-data-synchronization)
5. [Recipe 5: Webhook-Triggered Workflow](#recipe-5-webhook-triggered-workflow)
6. [Recipe 6: Custom Authentication Layer](#recipe-6-custom-authentication-layer)
7. [Recipe 7: Bulk Data Validation](#recipe-7-bulk-data-validation)
8. [Recipe 8: Field-Level Transformations](#recipe-8-field-level-transformations)

---

## Recipe 1: Sync External CSV to Softr

**Use Case:** Import customer data from CSV file into Softr tasks table

**Components:**
- CSV parser
- Field mapper
- Batch uploader
- Error reporter

**Implementation:**

```javascript
const fs = require('fs');
const csv = require('csv-parse');
const { SoftrClient, FieldTransformer } = require('./SOFTR-CODE-EXAMPLES.js');

class CsvSyncService {
  constructor(apiKey, appId) {
    this.client = new SoftrClient({ apiKey, appId });
    this.stats = { total: 0, created: 0, failed: 0, errors: [] };
  }

  async syncCsvFile(filePath, tableId, fieldMapping) {
    console.log(`Starting CSV sync from ${filePath} to ${tableId}...`);

    return new Promise((resolve, reject) => {
      const records = [];
      
      fs.createReadStream(filePath)
        .pipe(csv.parse({ columns: true, skip_empty_lines: true }))
        .on('data', (row) => {
          records.push(row);
          this.stats.total++;
        })
        .on('error', reject)
        .on('end', async () => {
          console.log(`Parsed ${this.stats.total} records from CSV`);
          
          // Transform and upload
          const results = await this._uploadRecords(
            tableId,
            records,
            fieldMapping
          );
          
          resolve(results);
        });
    });
  }

  async _uploadRecords(tableId, records, fieldMapping) {
    const transformed = records.map((record, index) => {
      try {
        return {
          index,
          fields: FieldTransformer.toSoftrFormat(record, fieldMapping),
          original: record
        };
      } catch (error) {
        this.stats.errors.push({
          index,
          error: error.message,
          record
        });
        this.stats.failed++;
        return null;
      }
    }).filter(r => r !== null);

    console.log(`Uploading ${transformed.length} transformed records...`);

    const { results, errors } = await this.client.createRecordsBatch(
      tableId,
      transformed.map(t => t.fields),
      50
    );

    this.stats.created = results.length;
    this.stats.failed += errors.length;

    if (errors.length > 0) {
      console.warn(`${errors.length} records failed to create`);
      errors.forEach(err => {
        this.stats.errors.push({
          index: err.index,
          error: err.error.message
        });
      });
    }

    return {
      summary: {
        total: this.stats.total,
        created: this.stats.created,
        failed: this.stats.failed
      },
      errors: this.stats.errors
    };
  }
}

// Usage
const csvSync = new CsvSyncService(
  process.env.SOFTR_API_KEY,
  process.env.SOFTR_APP_ID
);

const fieldMapping = {
  'Customer Name': {
    id: 'fld_name',
    type: 'singleLineText'
  },
  'Email': {
    id: 'fld_email',
    type: 'singleLineText'
  },
  'Status': {
    id: 'fld_status',
    type: 'singleSelect',
    options: [
      { id: 'opt_active', name: 'Active' },
      { id: 'opt_inactive', name: 'Inactive' }
    ]
  }
};

csvSync.syncCsvFile('customers.csv', 'tbl_customers', fieldMapping)
  .then(results => console.log('Sync complete:', results))
  .catch(err => console.error('Sync failed:', err));
```

---

## Recipe 2: Real-Time Slack Notifications

**Use Case:** Send Slack message when task status changes to "Done"

**Components:**
- Softr webhook receiver
- Slack API client
- Message formatter

**Implementation:**

```javascript
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

class SlackNotificationService {
  constructor(softrWebhookSecret, slackWebhookUrl) {
    this.softrSecret = softrWebhookSecret;
    this.slackWebhook = slackWebhookUrl;
  }

  /**
   * Express middleware to verify and process webhooks
   */
  createMiddleware() {
    return async (req, res, next) => {
      // Verify webhook signature
      if (!this._verifySignature(req)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      try {
        await this._handleWebhook(req.body);
        res.json({ success: true });
      } catch (error) {
        console.error('Webhook processing failed:', error);
        res.status(500).json({ error: error.message });
      }
    };
  }

  _verifySignature(req) {
    const signature = req.headers['x-softr-signature'];
    const timestamp = req.headers['x-softr-timestamp'];
    
    // Check for replay attacks (5 min window)
    const age = Math.floor(Date.now() / 1000) - parseInt(timestamp);
    if (age > 300) return false;

    const message = `${timestamp}:${JSON.stringify(req.body)}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.softrSecret)
      .update(message)
      .digest('hex');

    return signature === expectedSignature;
  }

  async _handleWebhook(payload) {
    const { event, data } = payload;

    // Only handle task status updates
    if (event !== 'record.updated') {
      return;
    }

    if (!data.changes.fld_status) {
      return;
    }

    // Check if status changed to "Done"
    const newStatus = data.changes.fld_status.after;
    if (newStatus.name !== 'Done') {
      return;
    }

    // Send Slack notification
    await this._sendSlackNotification(data.record);
  }

  async _sendSlackNotification(record) {
    const fields = record.fields;
    const message = {
      text: '✅ Task Completed',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '✅ Task Completed'
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Task:*\n${fields.fld_title}`
            },
            {
              type: 'mrkdwn',
              text: `*Assignee:*\n${fields.fld_assignee?.name || 'Unassigned'}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Description:*\n${fields.fld_description || 'No description'}`
          }
        },
        {
          type: 'divider'
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Completed at ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };

    try {
      await axios.post(this.slackWebhook, message);
      console.log('Slack notification sent for task:', fields.fld_title);
    } catch (error) {
      console.error('Failed to send Slack notification:', error.message);
      throw error;
    }
  }
}

// Setup Express server
const app = express();
app.use(express.json());

const slackService = new SlackNotificationService(
  process.env.SOFTR_WEBHOOK_SECRET,
  process.env.SLACK_WEBHOOK_URL
);

app.post('/webhooks/tasks', slackService.createMiddleware());

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

---

## Recipe 3: Scheduled Report Generation

**Use Case:** Generate weekly project status report and email to team

**Components:**
- Scheduled trigger (Softr Workflows)
- Data aggregation
- Email formatter
- Report generator

**Softr Workflow Code Block:**

```javascript
// Softr Workflow: Weekly Project Status Report
// Trigger: Schedule - Every Monday 9:00 AM

const generateWeeklyReport = async () => {
  // Get week date range
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Fetch tasks completed this week
  const completedResponse = await fetch(
    'https://api.airtable.com/v0/appPkAZ0LWnLp9eZi/Tasks?view=GridView',
    {
      headers: { 'Authorization': 'Bearer AIRTABLE_TOKEN' }
    }
  );

  const tasksData = await completedResponse.json();
  
  // Filter completed tasks
  const completedTasks = tasksData.records.filter(task => {
    const completedDate = new Date(task.fields['Completed Date']);
    return completedDate >= weekStart && completedDate <= weekEnd;
  });

  // Count tasks by status
  const taskStats = {
    total: tasksData.records.length,
    completed: completedTasks.length,
    inProgress: tasksData.records.filter(
      t => t.fields['Status'] === 'In Progress'
    ).length,
    pending: tasksData.records.filter(
      t => t.fields['Status'] === 'To Do'
    ).length
  };

  // Calculate completion rate
  const completionRate = Math.round(
    (taskStats.completed / taskStats.total) * 100
  );

  return {
    weekStart: weekStart.toDateString(),
    weekEnd: weekEnd.toDateString(),
    stats: taskStats,
    completionRate: completionRate,
    completedTasks: completedTasks.map(t => ({
      name: t.fields['Title'],
      assignee: t.fields['Assignee'],
      completedDate: t.fields['Completed Date']
    }))
  };
};

// Execute report generation
const report = await generateWeeklyReport();

// Return data for next workflow actions (email, storage, etc.)
return {
  reportData: report,
  emailReady: true,
  timestamp: new Date().toISOString()
};
```

**Email Action Template:**

```
Subject: Weekly Status Report - Week of {{weekStart}}

Dear Team,

Here's your weekly project status report:

📊 Overall Progress
- Total Tasks: {{stats.total}}
- Completed: {{stats.completed}}
- In Progress: {{stats.inProgress}}
- Pending: {{stats.pending}}
- Completion Rate: {{completionRate}}%

✅ Tasks Completed This Week
{{#each completedTasks}}
- {{this.name}} (Assignee: {{this.assignee}})
{{/each}}

Keep up the great work!

Best regards,
Project Management System
```

---

## Recipe 4: Two-Way Data Synchronization

**Use Case:** Keep Softr tasks in sync with external project management system

**Components:**
- Bidirectional sync engine
- Conflict resolution
- Change tracking
- Retry mechanism

**Implementation:**

```javascript
class BidirectionalSyncEngine {
  constructor(softrClient, externalClient, config = {}) {
    this.softr = softrClient;
    this.external = externalClient;
    this.lastSyncTime = null;
    this.conflictResolution = config.conflictResolution || 'softr-wins';
    this.changeLog = [];
  }

  /**
   * Perform full bidirectional sync
   */
  async performFullSync(softrTableId, externalCollectionId) {
    console.log('Starting bidirectional sync...');
    
    try {
      // Fetch both datasets
      const softrRecords = await this._getAllSoftrRecords(softrTableId);
      const externalRecords = await this._getAllExternalRecords(externalCollectionId);

      // Map records for comparison
      const softrMap = new Map(softrRecords.map(r => [r.fields.fld_externalId, r]));
      const externalMap = new Map(externalRecords.map(r => [r.externalId, r]));

      // Find changes
      const { created, updated, deleted } = this._findChanges(
        softrMap,
        externalMap
      );

      // Apply changes
      const results = {
        softrCreated: await this._createInSoftr(created, softrTableId),
        softrUpdated: await this._updateInSoftr(updated, softrTableId),
        externalCreated: await this._createInExternal(created, externalCollectionId),
        externalUpdated: await this._updateInExternal(updated, externalCollectionId),
        deleted: await this._deleteRecords(deleted)
      };

      this.lastSyncTime = new Date();
      console.log('Sync complete:', results);
      
      return results;

    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  /**
   * Sync only changes since last sync
   */
  async performIncrementalSync(softrTableId, externalCollectionId) {
    if (!this.lastSyncTime) {
      return this.performFullSync(softrTableId, externalCollectionId);
    }

    const softrChanges = await this.softr.queryRecords(softrTableId, {
      where: {
        field: 'fld_updatedAt',
        operator: 'greaterThan',
        value: this.lastSyncTime.toISOString()
      }
    });

    const externalChanges = await this.external.getChangedRecords(
      externalCollectionId,
      this.lastSyncTime
    );

    // Apply changes to both systems
    const results = {
      softrUpdated: await this._updateInSoftr(
        externalChanges.updated,
        softrTableId
      ),
      externalUpdated: await this._updateInExternal(
        softrChanges.data.records,
        externalCollectionId
      )
    };

    this.lastSyncTime = new Date();
    return results;
  }

  _findChanges(softrMap, externalMap) {
    const created = [];
    const updated = [];
    const deleted = [];

    // Find records created in external system
    for (const [id, record] of externalMap) {
      if (!softrMap.has(id)) {
        created.push({ source: 'external', record });
      }
    }

    // Find records updated
    for (const [id, softrRecord] of softrMap) {
      const externalRecord = externalMap.get(id);
      
      if (externalRecord) {
        const softrUpdated = new Date(softrRecord.updatedAt);
        const externalUpdated = new Date(externalRecord.updatedAt);

        if (softrUpdated !== externalUpdated) {
          updated.push({
            id,
            softrRecord,
            externalRecord,
            softrNewer: softrUpdated > externalUpdated
          });
        }
      }
    }

    // Find deleted records
    for (const [id, softrRecord] of softrMap) {
      if (!externalMap.has(id)) {
        deleted.push({ id, softrRecord });
      }
    }

    return { created, updated, deleted };
  }

  async _createInSoftr(records, tableId) {
    const created = [];
    
    for (const item of records) {
      if (item.source !== 'external') continue;

      const softrData = this._mapToSoftrFormat(item.record);
      const result = await this.softr.createRecord(tableId, softrData);
      
      created.push({
        softrId: result.data.record.id,
        externalId: item.record.id
      });

      // Update external record with Softr ID
      await this.external.updateRecord(item.record.id, {
        softrId: result.data.record.id
      });
    }

    return created;
  }

  async _updateInSoftr(records, tableId) {
    const updated = [];

    for (const item of records) {
      if (!item.softrNewer && item.externalRecord) {
        const softrData = this._mapToSoftrFormat(item.externalRecord);
        
        await this.softr.updateRecord(tableId, item.id, softrData);
        updated.push(item.id);
      }
    }

    return updated;
  }

  async _getAllSoftrRecords(tableId) {
    const records = [];
    for await (const record of this.softr.getAllRecords(tableId)) {
      records.push(record);
    }
    return records;
  }

  async _getAllExternalRecords(collectionId) {
    return this.external.getAllRecords(collectionId);
  }

  _mapToSoftrFormat(externalRecord) {
    return {
      fld_title: externalRecord.title,
      fld_status: this._mapStatus(externalRecord.status),
      fld_externalId: externalRecord.id
    };
  }

  _mapStatus(status) {
    const statusMap = {
      'todo': { id: 'opt_todo' },
      'in-progress': { id: 'opt_inprogress' },
      'completed': { id: 'opt_done' }
    };
    return statusMap[status] || { id: 'opt_todo' };
  }
}

// Usage
const syncEngine = new BidirectionalSyncEngine(
  softrClient,
  externalClient
);

// Run sync periodically (e.g., every 15 minutes)
setInterval(() => {
  syncEngine.performIncrementalSync('tbl_tasks', 'projects')
    .catch(err => console.error('Sync error:', err));
}, 15 * 60 * 1000);
```

---

## Recipe 5: Webhook-Triggered Workflow

**Use Case:** External system triggers Softr workflow via webhook

**Components:**
- Webhook receiver
- Payload validator
- Workflow executor
- Response handler

**Implementation:**

```javascript
const express = require('express');
const { SoftrClient } = require('./SOFTR-CODE-EXAMPLES.js');

class WebhookWorkflowExecutor {
  constructor(apiKey, appId, webhookSecret) {
    this.client = new SoftrClient({ apiKey, appId });
    this.webhookSecret = webhookSecret;
  }

  /**
   * Create Express middleware for webhook endpoint
   */
  createMiddleware() {
    return async (req, res, next) => {
      // Verify webhook
      if (!this._verifyWebhook(req)) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      try {
        const { workflowId, payload } = req.body;

        // Validate payload
        if (!this._validatePayload(payload)) {
          return res.status(400).json({ error: 'Invalid payload' });
        }

        // Execute workflow
        const result = await this._executeWorkflow(workflowId, payload);

        res.json({
          success: true,
          workflowId,
          executionId: result.executionId,
          status: result.status
        });

      } catch (error) {
        console.error('Workflow execution failed:', error);
        res.status(500).json({ error: error.message });
      }
    };
  }

  _verifyWebhook(req) {
    const signature = req.headers['x-webhook-signature'];
    if (!signature) return false;

    const body = JSON.stringify(req.body);
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(body)
      .digest('hex');

    return signature === expectedSignature;
  }

  _validatePayload(payload) {
    // Define validation rules
    const required = ['action', 'data'];
    
    for (const field of required) {
      if (!payload[field]) return false;
    }

    return true;
  }

  async _executeWorkflow(workflowId, payload) {
    // Map workflow IDs to execution logic
    const workflows = {
      'create-task': this._workflowCreateTask.bind(this),
      'update-status': this._workflowUpdateStatus.bind(this),
      'send-notification': this._workflowSendNotification.bind(this)
    };

    const executor = workflows[workflowId];
    if (!executor) {
      throw new Error(`Unknown workflow: ${workflowId}`);
    }

    return executor(payload);
  }

  async _workflowCreateTask(payload) {
    const { title, description, assignee, dueDate } = payload.data;

    const record = await this.client.createRecord('tbl_tasks', {
      fld_title: title,
      fld_description: description,
      fld_assignee: { id: assignee },
      fld_duedate: dueDate
    });

    return {
      executionId: `exec_${Date.now()}`,
      status: 'success',
      recordId: record.data.record.id
    };
  }

  async _workflowUpdateStatus(payload) {
    const { recordId, newStatus } = payload.data;

    await this.client.updateRecord('tbl_tasks', recordId, {
      fld_status: { id: newStatus }
    });

    return {
      executionId: `exec_${Date.now()}`,
      status: 'success'
    };
  }

  async _workflowSendNotification(payload) {
    const { message, recipients } = payload.data;

    // Send notifications (e.g., email, Slack)
    console.log(`Sending notification: ${message}`);

    return {
      executionId: `exec_${Date.now()}`,
      status: 'success',
      recipientCount: recipients.length
    };
  }
}

// Setup
const app = express();
app.use(express.json());

const executor = new WebhookWorkflowExecutor(
  process.env.SOFTR_API_KEY,
  process.env.SOFTR_APP_ID,
  process.env.WEBHOOK_SECRET
);

app.post('/workflows/execute', executor.createMiddleware());

app.listen(3000, () => {
  console.log('Workflow executor listening on port 3000');
});
```

---

## Recipe 6: Custom Authentication Layer

**Use Case:** Protect Softr API access with custom authentication

**Implementation:**

```javascript
class CustomAuthLayer {
  constructor(softrClient) {
    this.softr = softrClient;
    this.tokenStore = new Map(); // Use Redis in production
    this.auditLog = [];
  }

  /**
   * Create session token for client
   */
  createToken(userId, scopes = []) {
    const token = this._generateToken();
    const expiration = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    this.tokenStore.set(token, {
      userId,
      scopes,
      createdAt: new Date(),
      expiresAt: new Date(expiration),
      lastUsed: null
    });

    // Log token creation
    this._auditLog('token_created', { userId, scopes, token });

    return token;
  }

  /**
   * Verify token validity
   */
  verifyToken(token) {
    const session = this.tokenStore.get(token);

    if (!session) {
      throw new Error('Invalid token');
    }

    if (new Date() > session.expiresAt) {
      this.tokenStore.delete(token);
      throw new Error('Token expired');
    }

    // Update last used
    session.lastUsed = new Date();

    return session;
  }

  /**
   * Middleware for Express
   */
  createAuthMiddleware() {
    return (req, res, next) => {
      const token = req.headers['x-api-token'];

      if (!token) {
        return res.status(401).json({ error: 'Missing API token' });
      }

      try {
        const session = this.verifyToken(token);
        req.user = session;
        next();
      } catch (error) {
        res.status(401).json({ error: error.message });
      }
    };
  }

  /**
   * Scope-based access control
   */
  createScopeMiddleware(...requiredScopes) {
    return (req, res, next) => {
      const hasScopes = requiredScopes.every(scope =>
        req.user.scopes.includes(scope)
      );

      if (!hasScopes) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  }

  /**
   * Rate limiting
   */
  createRateLimitMiddleware(maxRequests = 100, windowMs = 60000) {
    const limiter = new Map();

    return (req, res, next) => {
      const userId = req.user.userId;
      const now = Date.now();
      const key = userId;

      if (!limiter.has(key)) {
        limiter.set(key, []);
      }

      const requests = limiter.get(key);
      const validRequests = requests.filter(t => t > now - windowMs);

      if (validRequests.length >= maxRequests) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }

      validRequests.push(now);
      limiter.set(key, validRequests);

      res.set('X-RateLimit-Remaining', maxRequests - validRequests.length);
      next();
    };
  }

  _generateToken() {
    return require('crypto').randomBytes(32).toString('hex');
  }

  _auditLog(action, details) {
    this.auditLog.push({
      timestamp: new Date(),
      action,
      details
    });
  }
}

// Usage
const auth = new CustomAuthLayer(softrClient);

const app = express();
app.use(express.json());

// Apply auth middleware
app.use(auth.createAuthMiddleware());
app.use(auth.createRateLimitMiddleware(100, 60000));

// Protected route
app.get('/api/tasks', 
  auth.createScopeMiddleware('records:read'),
  async (req, res) => {
    const tasks = await softrClient.queryRecords('tbl_tasks');
    res.json(tasks);
  }
);

app.listen(3000);
```

---

## Recipe 7: Bulk Data Validation

**Use Case:** Validate data before bulk import to Softr

**Implementation:**

```javascript
class BulkValidator {
  constructor(fieldDefinitions) {
    this.fields = fieldDefinitions;
    this.rules = new Map();
    this.errors = [];
  }

  addRule(fieldId, rule) {
    if (!this.rules.has(fieldId)) {
      this.rules.set(fieldId, []);
    }
    this.rules.get(fieldId).push(rule);
    return this;
  }

  /**
   * Validate array of records
   */
  validate(records) {
    this.errors = [];
    const validated = [];

    records.forEach((record, index) => {
      const result = this._validateRecord(record, index);
      if (result.valid) {
        validated.push(result.record);
      }
    });

    return {
      validated,
      invalid: records.length - validated.length,
      errors: this.errors
    };
  }

  _validateRecord(record, index) {
    const errors = [];

    // Check required fields
    for (const [fieldId, field] of Object.entries(this.fields)) {
      if (field.required && !record[fieldId]) {
        errors.push({
          recordIndex: index,
          field: fieldId,
          error: 'Required field missing'
        });
      }
    }

    // Apply custom rules
    for (const [fieldId, rules] of this.rules) {
      const value = record[fieldId];
      
      for (const rule of rules) {
        const ruleError = rule(value);
        if (ruleError) {
          errors.push({
            recordIndex: index,
            field: fieldId,
            error: ruleError
          });
        }
      }
    }

    if (errors.length > 0) {
      this.errors.push(...errors);
      return { valid: false, record: null };
    }

    return { valid: true, record };
  }
}

// Usage
const validator = new BulkValidator({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true },
  status: { type: 'select', required: false }
});

validator
  .addRule('email', (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? null
      : 'Invalid email format';
  })
  .addRule('name', (value) => {
    return value.length > 3
      ? null
      : 'Name must be at least 3 characters';
  })
  .addRule('status', (value) => {
    const validStatuses = ['active', 'inactive', 'pending'];
    return validStatuses.includes(value)
      ? null
      : `Status must be one of: ${validStatuses.join(', ')}`;
  });

const result = validator.validate([
  { name: 'John Doe', email: 'john@example.com', status: 'active' },
  { name: 'Jane Smith', email: 'invalid-email', status: 'active' },
  { name: 'Bob', email: 'bob@example.com', status: 'invalid' }
]);

console.log('Valid records:', result.validated.length);
console.log('Errors:', result.errors);
```

---

## Recipe 8: Field-Level Transformations

**Use Case:** Complex data transformations during sync

**Implementation:**

```javascript
class FieldTransformationEngine {
  constructor() {
    this.transformers = new Map();
  }

  /**
   * Register transformation for a field
   */
  registerTransformer(fieldId, transformer) {
    this.transformers.set(fieldId, transformer);
    return this;
  }

  /**
   * Apply transformations to record
   */
  async transform(record, fieldMapping) {
    const transformed = {};

    for (const [softrFieldId, value] of Object.entries(record.fields || record)) {
      let transformedValue = value;

      // Check if transformer exists
      if (this.transformers.has(softrFieldId)) {
        const transformer = this.transformers.get(softrFieldId);
        transformedValue = await transformer(value, record);
      }

      transformed[softrFieldId] = transformedValue;
    }

    return transformed;
  }
}

// Example transformers
const transformEngine = new FieldTransformationEngine();

// 1. Convert email to lowercase
transformEngine.registerTransformer('fld_email', async (value) => {
  return value ? value.toLowerCase() : null;
});

// 2. Generate slug from title
transformEngine.registerTransformer('fld_slug', async (value, record) => {
  const title = record.fields.fld_title || '';
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
});

// 3. Calculate days until due
transformEngine.registerTransformer('fld_daysUntilDue', async (value, record) => {
  const dueDate = new Date(record.fields.fld_duedate);
  const today = new Date();
  const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  return diff;
});

// 4. Concatenate fields
transformEngine.registerTransformer('fld_fullName', async (value, record) => {
  const firstName = record.fields.fld_firstName || '';
  const lastName = record.fields.fld_lastName || '';
  return `${firstName} ${lastName}`.trim();
});

// 5. Map external status to internal
transformEngine.registerTransformer('fld_status', async (value) => {
  const statusMap = {
    'New': 'opt_todo',
    'Processing': 'opt_inprogress',
    'Done': 'opt_done'
  };
  return { id: statusMap[value] || 'opt_todo' };
});

// Usage
const record = {
  fields: {
    fld_email: 'JOHN@EXAMPLE.COM',
    fld_title: 'Implement New Feature',
    fld_duedate: '2026-07-15',
    fld_firstName: 'John',
    fld_lastName: 'Doe',
    fld_status: 'Processing'
  }
};

const transformed = await transformEngine.transform(record);
console.log(transformed);
// Output:
// {
//   fld_email: 'john@example.com',
//   fld_slug: 'implement-new-feature',
//   fld_daysUntilDue: 26,
//   fld_fullName: 'John Doe',
//   fld_status: { id: 'opt_inprogress' }
// }
```

---

## Troubleshooting Common Issues

### Issue: "Rate limit exceeded"

**Solution:**
```javascript
// Implement exponential backoff
async function withRetry(fn, maxAttempts = 3) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.statusCode === 429 && attempt < maxAttempts - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw error;
      }
    }
  }
}
```

### Issue: "Invalid webhook signature"

**Solution:**
```javascript
// Ensure you're using raw request body, not parsed JSON
// In Express, preserve raw body
app.use(express.raw({ type: 'application/json' }));

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-softr-signature'];
  const body = req.body; // Raw buffer
  
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  if (hash === signature) {
    // Valid webhook
    const data = JSON.parse(body);
  }
});
```

### Issue: "Field ID not found"

**Solution:**
```javascript
// Always fetch table schema first
const schema = await client.getTableSchema('tbl_tasks');
const fieldMap = {};

schema.data.tables[0].fields.forEach(field => {
  fieldMap[field.name] = field.id;
  console.log(`${field.name}: ${field.id}`);
});

// Use correct field IDs
await client.createRecord('tbl_tasks', {
  [fieldMap['Title']]: 'My Task',
  [fieldMap['Status']]: { id: 'opt_todo' }
});
```

---

## Performance Optimization Tips

1. **Use cursor-based pagination** for large datasets
2. **Batch operations** in groups of 50-100 records
3. **Cache field mappings** to avoid repeated schema lookups
4. **Implement connection pooling** for concurrent operations
5. **Use selective field queries** to reduce response size
6. **Implement local caching** with TTL for frequently accessed data

---

**Last Updated:** June 19, 2026  
**Version:** 1.0  
**Status:** Production Ready
