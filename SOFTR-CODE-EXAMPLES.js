/**
 * Softr Custom Integrations - Working Code Examples
 *
 * This file contains production-ready code examples for:
 * - REST API integration patterns
 * - Database CRUD operations
 * - Custom actions and triggers
 * - OAuth flow implementation
 * - Error handling and retry logic
 * - Field mapping and transformations
 * - Testing utilities
 *
 * Date: June 19, 2026
 */

'use strict';

/**
 * ============================================================================
 * CORE SOFTR CLIENT
 * ============================================================================
 */

class SoftrClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.SOFTR_API_KEY;
    this.appId = config.appId || process.env.SOFTR_APP_ID;
    this.baseUrl = config.baseUrl || 'https://api.softr.io/v1';
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
    this.retryDelayMs = config.retryDelayMs || 1000;
  }

  /**
   * Make an API request with automatic retry logic
   */
  async request(method, path, body = null, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-Request-ID': this._generateRequestId(),
      ...options.headers
    };

    let lastError;
    let delay = this.retryDelayMs;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : null,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return await response.json();
        }

        // Don't retry non-retryable errors
        if (![429, 500, 502, 503, 504].includes(response.status)) {
          const error = await response.json().catch(() => ({}));
          throw new ApiError(
            error.error?.message || `HTTP ${response.status}`,
            response.status,
            error
          );
        }

        lastError = new ApiError(
          `HTTP ${response.status}`,
          response.status
        );

        if (attempt < this.maxRetries - 1) {
          const jitter = delay * (0.1 + Math.random() * 0.1);
          const waitTime = delay + jitter;
          console.log(`Retry ${attempt + 1}/${this.maxRetries} after ${Math.round(waitTime)}ms`);
          await this._sleep(waitTime);
          delay *= 2;
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError(`Request timeout after ${this.timeout}ms`);
        }
        lastError = error;
      }
    }

    throw lastError || new Error('Unknown error');
  }

  /**
   * LIST OPERATIONS
   */

  async listApps() {
    return this.request('GET', '/apps');
  }

  async listTables(appId = this.appId) {
    return this.request('GET', `/apps/${appId}/tables`);
  }

  async getTableSchema(tableId, appId = this.appId) {
    return this.request('GET', `/apps/${appId}/tables/${tableId}`);
  }

  /**
   * QUERY OPERATIONS
   */

  async queryRecords(tableId, options = {}, appId = this.appId) {
    const queryParams = new URLSearchParams();

    if (options.pageSize) queryParams.append('pageSize', options.pageSize);
    if (options.offset !== undefined) queryParams.append('offset', options.offset);
    if (options.cursor) queryParams.append('cursor', options.cursor);
    if (options.where) queryParams.append('where', JSON.stringify(options.where));
    if (options.filters) queryParams.append('filters', JSON.stringify(options.filters));
    if (options.sortBy) queryParams.append('sortBy', JSON.stringify(options.sortBy));
    if (options.fields) queryParams.append('fields', JSON.stringify(options.fields));

    const path = `/apps/${appId}/tables/${tableId}/records?${queryParams}`;
    return this.request('GET', path);
  }

  /**
   * CRUD OPERATIONS
   */

  async createRecord(tableId, fields, appId = this.appId) {
    const path = `/apps/${appId}/tables/${tableId}/records`;
    return this.request('POST', path, { fields });
  }

  async getRecord(tableId, recordId, appId = this.appId) {
    const path = `/apps/${appId}/tables/${tableId}/records/${recordId}`;
    return this.request('GET', path);
  }

  async updateRecord(tableId, recordId, fields, appId = this.appId) {
    const path = `/apps/${appId}/tables/${tableId}/records/${recordId}`;
    return this.request('PATCH', path, { fields });
  }

  async deleteRecord(tableId, recordId, appId = this.appId) {
    const path = `/apps/${appId}/tables/${tableId}/records/${recordId}`;
    return this.request('DELETE', path);
  }

  /**
   * BATCH OPERATIONS
   */

  async createRecordsBatch(tableId, records, batchSize = 50, appId = this.appId) {
    const results = [];
    const errors = [];

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      const batchPromises = batch.map((fields, index) =>
        this.createRecord(tableId, fields, appId)
          .then(result => ({ index: i + index, result, error: null }))
          .catch(error => ({ index: i + index, result: null, error }))
      );

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach(item => {
        if (item.error) {
          errors.push({ index: item.index, error: item.error });
        } else {
          results.push({ index: item.index, record: item.result.data.record });
        }
      });

      console.log(`Batch complete: ${Math.min(i + batchSize, records.length)}/${records.length}`);
    }

    return { results, errors };
  }

  async updateRecordsBatch(tableId, updates, batchSize = 50, appId = this.appId) {
    const results = [];
    const errors = [];

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      const batchPromises = batch.map(({ recordId, fields }, index) =>
        this.updateRecord(tableId, recordId, fields, appId)
          .then(result => ({ index: i + index, result, error: null }))
          .catch(error => ({ index: i + index, result: null, error }))
      );

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach(item => {
        if (item.error) {
          errors.push({ index: item.index, error: item.error });
        } else {
          results.push({ index: item.index, record: item.result.data.record });
        }
      });

      console.log(`Batch update: ${Math.min(i + batchSize, updates.length)}/${updates.length}`);
    }

    return { results, errors };
  }

  /**
   * PAGINATION HELPERS
   */

  async *getAllRecords(tableId, pageSize = 100, appId = this.appId) {
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const response = await this.queryRecords(tableId, { offset, pageSize }, appId);
      const records = response.data.records;

      for (const record of records) {
        yield record;
      }

      hasMore = response.data.pageInfo.hasMore;
      offset += pageSize;
    }
  }

  /**
   * TRIGGER & WEBHOOK OPERATIONS
   */

  async createRecordTrigger(tableId, event, webhookUrl, conditions = {}, appId = this.appId) {
    const path = `/apps/${appId}/triggers/record`;
    return this.request('POST', path, {
      table: tableId,
      event, // 'created', 'updated', 'deleted'
      conditions,
      webhookUrl,
      retryPolicy: {
        maxRetries: 3,
        backoffMultiplier: 2,
        initialDelayMs: 1000
      }
    });
  }

  async createScheduleTrigger(schedule, webhookUrl, timezone = 'UTC', appId = this.appId) {
    const path = `/apps/${appId}/triggers/schedule`;
    return this.request('POST', path, {
      schedule, // Cron format
      webhookUrl,
      timezone
    });
  }

  async createWebhook(events, url, secret, appId = this.appId) {
    const path = `/apps/${appId}/webhooks`;
    return this.request('POST', path, {
      events,
      url,
      secret,
      active: true
    });
  }

  /**
   * UTILITY METHODS
   */

  _generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * ============================================================================
 * ERROR HANDLING
 * ============================================================================
 */

class ApiError extends Error {
  constructor(message, statusCode = null, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

class TimeoutError extends ApiError {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

class ValidationError extends ApiError {
  constructor(message, fields = []) {
    super(message);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

/**
 * ============================================================================
 * FIELD MAPPING & TRANSFORMATION
 * ============================================================================
 */

class FieldTransformer {
  /**
   * Transform external data to Softr format
   */
  static toSoftrFormat(externalData, fieldMapping) {
    const softrData = {};

    for (const [externalField, softrField] of Object.entries(fieldMapping)) {
      const value = externalData[externalField];

      if (value === null || value === undefined) {
        continue;
      }

      softrData[softrField.id] = this._transformValue(
        value,
        softrField.type,
        softrField
      );
    }

    return softrData;
  }

  /**
   * Transform Softr data to external format
   */
  static fromSoftrFormat(softrRecord, fieldMapping) {
    const externalData = {};

    for (const [externalField, softrField] of Object.entries(fieldMapping)) {
      const value = softrRecord.fields[softrField.id];

      if (value === null || value === undefined) {
        continue;
      }

      externalData[externalField] = this._reverseTransformValue(
        value,
        softrField.type
      );
    }

    return externalData;
  }

  static _transformValue(value, type, fieldConfig) {
    switch (type) {
      case 'singleLineText':
        return String(value).substring(0, 255);

      case 'longText':
        return String(value).substring(0, 10000);

      case 'number':
        return parseFloat(value);

      case 'singleSelect':
        return { id: this._findSelectOptionId(fieldConfig, value) };

      case 'multiSelect':
        return Array.isArray(value)
          ? value.map(v => ({ id: this._findSelectOptionId(fieldConfig, v) }))
          : [];

      case 'date':
        return new Date(value).toISOString().split('T')[0];

      case 'dateTime':
        return new Date(value).toISOString();

      case 'checkbox':
        return Boolean(value);

      case 'user':
        return { id: value };

      case 'link':
        return Array.isArray(value)
          ? value.map(id => ({ id }))
          : [{ id: value }];

      default:
        return value;
    }
  }

  static _reverseTransformValue(value, type) {
    switch (type) {
      case 'singleSelect':
        return value?.name;

      case 'multiSelect':
        return Array.isArray(value) ? value.map(v => v.name) : [];

      case 'user':
        return value?.email;

      case 'link':
        return Array.isArray(value) ? value.map(v => v.id) : [];

      default:
        return value;
    }
  }

  static _findSelectOptionId(fieldConfig, optionName) {
    if (!fieldConfig.options) return null;

    const option = fieldConfig.options.find(
      opt => opt.name.toLowerCase() === String(optionName).toLowerCase()
    );

    return option?.id;
  }
}

/**
 * ============================================================================
 * OAUTH IMPLEMENTATION
 * ============================================================================
 */

class OAuthManager {
  constructor(config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.scopes = config.scopes || ['app:read', 'records:write'];
    this.authUrl = config.authUrl || 'https://auth.softr.io';
    this.tokenStore = config.tokenStore; // Implement your own storage
  }

  /**
   * Generate authorization URL
   */
  generateAuthUrl(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scopes.join(' '),
      state
    });

    return `${this.authUrl}/authorize?${params}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code) {
    const response = await fetch(`${this.authUrl}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri
      })
    });

    if (!response.ok) {
      throw new ApiError('Failed to exchange code for token', response.status);
    }

    const tokens = await response.json();
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      expiresAt: Date.now() + tokens.expires_in * 1000
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    const response = await fetch(`${this.authUrl}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret
      })
    });

    if (!response.ok) {
      throw new ApiError('Failed to refresh token', response.status);
    }

    const tokens = await response.json();
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      expiresAt: Date.now() + tokens.expires_in * 1000
    };
  }

  /**
   * Verify token is still valid
   */
  isTokenExpired(token) {
    return Date.now() > token.expiresAt;
  }

  /**
   * Get valid access token, refreshing if necessary
   */
  async getValidAccessToken(token) {
    if (this.isTokenExpired(token)) {
      return this.refreshToken(token.refreshToken);
    }
    return token;
  }
}

/**
 * ============================================================================
 * WEBHOOK UTILITIES
 * ============================================================================
 */

const crypto = require('crypto');

class WebhookManager {
  /**
   * Verify webhook signature
   */
  static verifySignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(`sha256=${expectedSignature}`)
    );
  }

  /**
   * Create a test webhook payload
   */
  static createTestPayload(event, data, secret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(16).toString('hex');
    const payload = JSON.stringify({ event, data, timestamp, nonce });

    const signature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return {
      headers: {
        'X-Softr-Signature': `sha256=${signature}`,
        'X-Softr-Timestamp': timestamp.toString(),
        'X-Softr-Nonce': nonce,
        'Content-Type': 'application/json'
      },
      body: payload
    };
  }
}

/**
 * ============================================================================
 * TESTING UTILITIES
 * ============================================================================
 */

class SoftrMockServer {
  static createMockFetch(responses = {}) {
    return async (url, options) => {
      const methodPath = `${options.method || 'GET'} ${url}`;

      for (const [pattern, response] of Object.entries(responses)) {
        if (methodPath.match(new RegExp(pattern))) {
          return new Response(
            JSON.stringify(typeof response === 'function' ? response() : response),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Not mocked' }),
        { status: 404 }
      );
    };
  }
}

/**
 * ============================================================================
 * EXAMPLE USAGE
 * ============================================================================
 */

async function exampleUsage() {
  // Initialize client
  const client = new SoftrClient({
    apiKey: process.env.SOFTR_API_KEY,
    appId: process.env.SOFTR_APP_ID
  });

  try {
    // List tables
    const tables = await client.listTables();
    console.log('Tables:', tables);

    // Query records with filtering
    const tasks = await client.queryRecords('tbl_tasks', {
      where: {
        field: 'fld_status',
        operator: 'equals',
        value: { id: 'opt_done' }
      },
      sortBy: [{ field: 'fld_duedate', direction: 'asc' }],
      pageSize: 50
    });
    console.log('Done tasks:', tasks.data.records);

    // Create a new record
    const newTask = await client.createRecord('tbl_tasks', {
      fld_title: 'New Task from API',
      fld_status: { id: 'opt_todo' },
      fld_priority: 'High'
    });
    console.log('Created:', newTask.data.record);

    // Transform and create from external data
    const externalData = {
      name: 'External Task',
      status: 'In Progress',
      dueDate: '2026-07-15'
    };

    const fieldMapping = {
      name: { id: 'fld_title', type: 'singleLineText' },
      status: { id: 'fld_status', type: 'singleSelect' },
      dueDate: { id: 'fld_duedate', type: 'date' }
    };

    const softrData = FieldTransformer.toSoftrFormat(externalData, fieldMapping);
    const created = await client.createRecord('tbl_tasks', softrData);
    console.log('Created from external:', created.data.record);

    // Update record
    await client.updateRecord('tbl_tasks', created.data.record.id, {
      fld_status: { id: 'opt_done' }
    });

    // Iterate through all records
    for await (const record of client.getAllRecords('tbl_tasks')) {
      console.log('Record:', record.id, record.fields.fld_title);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * Export for use in Node.js
 */
module.exports = {
  SoftrClient,
  ApiError,
  TimeoutError,
  ValidationError,
  FieldTransformer,
  OAuthManager,
  WebhookManager,
  SoftrMockServer,
  exampleUsage
};
