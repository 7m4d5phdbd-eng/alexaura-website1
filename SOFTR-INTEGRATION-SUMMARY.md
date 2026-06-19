# Softr Custom Integrations - Executive Summary & Quick Reference
**Complete Technical Research for Building Custom Integrations**

---

## BOTTOM LINE

**Can you build custom integrations in Softr?** ✅ **YES - Fully Production Ready**

You can build unlimited custom integrations connecting Softr to virtually any REST API using:
1. **REST API Data Sources** (no-code configuration)
2. **Custom Workflows** (code + no-code actions)
3. **Direct Softr Database API** (programmatic access)

**Viability Score: 9/10 - Enterprise Grade**

---

## Research Overview

This research package contains:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **SOFTR-CUSTOM-INTEGRATIONS-GUIDE.md** | Complete technical reference with architecture, APIs, step-by-step setup | 45 min |
| **SOFTR-INTEGRATION-CODE-TEMPLATES.md** | Ready-to-use code examples for 30+ integration scenarios | 30 min |
| **SOFTR-INTEGRATION-SUMMARY.md** | This file - quick reference and decision guide | 10 min |
| **SOFTR-INTEGRATION-METHODS-REPORT.md** | Comparison of 5 integration approaches | 20 min |

---

## Quick Start: Build Your First Integration in 5 Steps

### Method 1: REST API Data Source (Simplest - No Code)

```
1. Get external API details
   └─> Endpoint URL, API key, documentation

2. In Softr: Settings → Data Sources → REST API
   └─> Fill in URL, headers, authentication

3. Test the connection
   └─> Verify data retrieves correctly

4. Use in app via button action
   └─> Click triggers API call

5. Done!
```

**Time:** 15 minutes  
**Example:** Connect to Stripe, Salesforce, Slack, any REST API

### Method 2: Custom Workflow (More Powerful - Some Code)

```
1. Create Workflow in Softr
   └─> Choose trigger (form submit, record update, webhook, schedule)

2. Add Actions
   ├─> Send Email
   ├─> Call API
   ├─> Code Block (JavaScript/Python)
   └─> Update Record

3. Test with sample data
   └─> Check logs for success/failure

4. Publish workflow
   └─> Goes live immediately

5. Done!
```

**Time:** 30-60 minutes  
**Example:** Multi-step automations, complex data transformations, external service sync

---

## Key Findings

### What You Can Do

✅ Call any REST API (GET, POST, PUT, PATCH, DELETE)  
✅ Transform API responses with JavaScript/Python  
✅ Handle errors with retries and fallback actions  
✅ Receive webhooks from external systems  
✅ Send webhooks to external systems  
✅ Schedule workflows (daily, weekly, etc.)  
✅ Create complex multi-step automations  
✅ Connect to 20+ pre-built integrations  
✅ Connect to 5,000+ apps via Zapier  
✅ Store API keys securely in environment variables  

### What You Cannot Do

❌ Access Softr's backend database directly (no direct DB access)  
❌ Run code that lasts >30 seconds  
❌ Import npm modules (sandbox environment)  
❌ Access file system  
❌ Use deprecated Softr API endpoints  
❌ Exceed rate limits (20 calls/sec paid, 10 calls/sec free)  
❌ Bypass authentication requirements  

---

## Integration Architecture Overview

```
External API (Stripe, Salesforce, etc.)
           │
           │ HTTPS REST
           │
    ┌──────▼──────────┐
    │ Softr Platform  │
    ├─────────────────┤
    │ REST API Source │ (Easiest - config only)
    │ Workflows       │ (Powerful - code + UI)
    │ Softr Database  │ (Direct - programmatic)
    │ API             │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Softr Database  │
    │ (Airtable)      │
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Softr UI Apps   │
    │ (Components,    │
    │  Pages, Forms)  │
    └─────────────────┘
```

---

## Three Integration Methods Compared

### Method 1: REST API Data Source

**What:** Configure API endpoint in Softr UI, use in apps

**Best For:** Simple API calls, read operations, no complex logic

**Difficulty:** ⭐ (Easiest)

**Time to Setup:** 15 minutes

**Code Required:** None

**Scalability:** Good (20 calls/sec limit)

**Example:**
```
Settings → Data Sources → REST API
  Name: Stripe API
  Base URL: https://api.stripe.com/v1
  Headers: Authorization: Bearer sk_live_KEY
```

### Method 2: Custom Workflows

**What:** Event-based automation with actions and code blocks

**Best For:** Complex workflows, multiple systems, conditional logic

**Difficulty:** ⭐⭐⭐ (Medium)

**Time to Setup:** 30-60 minutes

**Code Required:** Optional (JavaScript/Python)

**Scalability:** Excellent (server-side execution)

**Example:**
```
Create Workflow
  Trigger: Form Submission
  Action 1: Call API
  Action 2: Code Block (transform)
  Action 3: Create Record
  Action 4: Send Email
```

### Method 3: Direct Softr Database API

**What:** Programmatic API calls to read/write Softr records

**Best For:** External systems calling Softr, bulk operations

**Difficulty:** ⭐⭐⭐⭐ (Advanced)

**Time to Setup:** 1-2 hours

**Code Required:** Yes (JavaScript/Node.js)

**Scalability:** Excellent (directly to Softr DB)

**Example:**
```javascript
const response = await fetch(
  'https://tables-api.softr.io/api/v1/databases/db_123/tables/tbl_456/records',
  {
    method: 'POST',
    headers: { 'Softr-Api-Key': 'YOUR_API_KEY' },
    body: JSON.stringify({ fields: {...} })
  }
);
```

---

## Real-World Use Cases

### 1. Stripe Payment Processing
**Flow:** Form → Stripe API → Payment Intent → Webhook → Record → Email

**Status:** ✅ Fully Supported  
**Setup Time:** 1 hour  
**Code Complexity:** Low-Medium

### 2. HubSpot CRM Sync
**Flow:** Form → HubSpot API → Create Contact → Link to Softr

**Status:** ✅ Fully Supported  
**Setup Time:** 1 hour  
**Code Complexity:** Low

### 3. Slack Notifications
**Flow:** Record Created → Slack Webhook → Team Notified

**Status:** ✅ Fully Supported  
**Setup Time:** 30 minutes  
**Code Complexity:** Minimal

### 4. Multi-System Workflow
**Flow:** Form → Transform → Salesforce + HubSpot + SendGrid + Slack

**Status:** ✅ Fully Supported  
**Setup Time:** 2-3 hours  
**Code Complexity:** Medium

### 5. Scheduled Reports
**Flow:** Daily Trigger → Query Airtable → Calculate → Email PDF

**Status:** ✅ Fully Supported  
**Setup Time:** 2 hours  
**Code Complexity:** Medium

---

## Technical Specifications

### Softr Database API

**Endpoint:** `https://tables-api.softr.io/api/v1`

**Authentication:** Personal Access Token in header
```
Softr-Api-Key: YOUR_API_KEY
```

**Rate Limits:**
- Paid Plans: 20 calls/second
- Free Plans: 10 calls/second

**Core Operations:**
- GET /databases - List all databases
- GET /databases/{ID} - Get database details
- GET /databases/{ID}/tables/{ID}/records - List records
- POST /databases/{ID}/tables/{ID}/records - Create record
- PATCH /databases/{ID}/tables/{ID}/records/{ID} - Update record
- DELETE /databases/{ID}/tables/{ID}/records/{ID} - Delete record

### Supported Authentication Methods

| Method | Best For | Example |
|--------|----------|---------|
| **No Auth** | Public APIs | `https://api.public-data.com/v1` |
| **API Key (Header)** | Simple auth | `X-API-Key: sk_live_123` |
| **Bearer Token** | OAuth | `Authorization: Bearer token_123` |
| **Custom Headers** | Special auth | `X-Custom-Auth: value` |
| **Form-Encoded** | Legacy APIs | `Content-Type: application/x-www-form-urlencoded` |

### Supported Data Formats

| Format | Support | Usage |
|--------|---------|-------|
| **JSON** | ✅ Full | Request/response bodies |
| **Form-Encoded** | ✅ Full | Stripe and similar APIs |
| **XML** | ⚠️ Via Transform | Parse in code block |
| **CSV** | ⚠️ Via Transform | Parse/generate in code |

---

## Step-by-Step: Create Your First Integration

### Scenario: Connect to Simple REST API

#### Step 1: Get API Credentials

```
Visit external service
→ Settings / API / Developers
→ Generate API Key
→ Copy Key & Note Endpoint URL
```

#### Step 2: Create Softr Data Source

```
Softr Dashboard
  → Settings
  → Data Sources
  → Connect Data Source
  → REST API
  
Fill in:
  Name: My API Integration
  Base URL: https://api.example.com/v1
  Headers:
    Authorization: Bearer YOUR_API_KEY
    Content-Type: application/json
  
Click Test → Verify response
```

#### Step 3: Use in Softr App

```
Add Button Component
  → Click Action
  → API Call
  → Select "My API Integration"
  → Map form fields to API parameters
  → Set success/error messages
```

#### Step 4: Test

```
1. Click button in app
2. Check workflow logs in Softr
3. Verify data in external system
4. Verify response in Softr UI
```

#### Step 5: Deploy

```
If working: No deployment needed!
Softr changes live immediately
Monitor logs for issues
```

---

## Code Examples - Quick Reference

### Example 1: Call Any API

```javascript
const response = await fetch('https://api.example.com/endpoint', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(input_data)
});

const result = await response.json();
return { success: response.ok, data: result };
```

### Example 2: Transform Data

```javascript
const transformed = {
  id: input_data.external_id,
  name: input_data.full_name.toUpperCase(),
  email: input_data.email.toLowerCase(),
  amount: parseFloat(input_data.price),
  timestamp: new Date().toISOString()
};

return transformed;
```

### Example 3: Error Handling

```javascript
try {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status}`);
  return await response.json();
} catch (error) {
  return { success: false, error: error.message };
}
```

### Example 4: Retry Logic

```javascript
async function callWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return await response.json();
      if (response.status < 500) throw new Error('Client error');
    } catch (e) {
      if (i < maxRetries - 1) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('All retries failed');
}
```

---

## Troubleshooting Guide

### Problem: 401 Unauthorized

**Cause:** Invalid or missing API key

**Solution:**
1. Verify API key is correct
2. Check it hasn't expired
3. Regenerate if needed
4. Test with Postman first

### Problem: 429 Rate Limit

**Cause:** Too many requests per second

**Solution:**
1. Add delay between API calls: `await new Promise(r => setTimeout(r, 500))`
2. Use Softr's batch APIs if available
3. Request higher limit from API provider

### Problem: CORS Error

**Cause:** Browser security (only in custom code blocks)

**Solution:**
1. Use Softr Workflows instead (server-side, no CORS)
2. Don't call external APIs from custom code blocks
3. Use REST API integrations which handle CORS

### Problem: Webhook Not Received

**Cause:** URL incorrect, external system not sending, or firewall

**Solution:**
1. Verify webhook URL is correct
2. Check Softr logs for webhook receipt
3. Test external system is configured to send
4. Use webhook.site to test externally

### Problem: Data Not Syncing

**Cause:** Field mapping, data format, or API changes

**Solution:**
1. Check workflow logs for errors
2. Verify field names match API
3. Test API directly with curl/Postman
4. Add logging to code blocks

---

## Security Best Practices

| Practice | Implementation |
|----------|-----------------|
| **Store API Keys** | Use environment variables only, never hardcode |
| **Use HTTPS Only** | All URLs must be https:// |
| **Validate Input** | Check data before API calls |
| **Log Safely** | Never log sensitive data |
| **Rotate Keys** | Change quarterly or when rotated externally |
| **Limit Permissions** | Each API key only scopes needed |
| **Monitor Usage** | Watch for unusual activity |
| **Verify Webhooks** | Check signature if provided |

### Example: Secure API Call

```javascript
// ✅ GOOD
const apiKey = process.env.STRIPE_SECRET_KEY;
const response = await fetch(url, {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});

// ❌ BAD
const apiKey = 'sk_live_abc123...';  // Hardcoded!
console.log(apiKey);  // Logged!
```

---

## When to Use Each Method

### Use REST API Data Source If:

- ✅ Simple API calls (read/write records)
- ✅ No complex business logic needed
- ✅ Want zero-code solution
- ✅ Calling API from app component
- ✅ Prototyping quickly

**Skip if:** Need multi-step workflows or complex transformations

### Use Custom Workflow If:

- ✅ Need multi-step automation
- ✅ Triggered by events (form submission, record change)
- ✅ Need conditional logic
- ✅ Combining multiple APIs
- ✅ Need scheduled execution
- ✅ Want to transform data with code

**Skip if:** Very simple one-off API calls

### Use Direct Softr API If:

- ✅ External system calling Softr (not vice versa)
- ✅ Need programmatic control from Node.js/JavaScript
- ✅ Bulk operations from external system
- ✅ Building integration library

**Skip if:** Just using Softr UI

---

## Integration Marketplace

### Pre-Built Connectors (20+)

**Databases:**
- Airtable
- Google Sheets
- Supabase
- BigQuery
- Coda

**CRM:**
- HubSpot
- Salesforce
- Pipedrive

**Payment:**
- Stripe
- PayPal

**Communication:**
- Slack
- Email/SMTP
- Mailchimp
- Intercom

**Analytics:**
- Google Analytics
- Mixpanel

### Extended Integrations (5,000+ via Zapier)

Connect to virtually any app through Zapier:
- SaaS platforms (Jira, Asana, Monday)
- Cloud services (AWS, Azure, Google Cloud)
- Communication (Teams, Discord, Telegram)
- Dev tools (GitHub, GitLab, Vercel)
- And thousands more...

---

## Detailed Guides

For complete implementation details, see:

1. **SOFTR-CUSTOM-INTEGRATIONS-GUIDE.md** (45 min read)
   - Full technical reference
   - All APIs documented
   - Architecture diagrams
   - Step-by-step setup
   - Advanced patterns

2. **SOFTR-INTEGRATION-CODE-TEMPLATES.md** (30 min read)
   - 30+ ready-to-use code examples
   - Copy-paste templates
   - Common integrations (Stripe, HubSpot, Slack, SendGrid)
   - Error handling patterns
   - Testing examples

3. **SOFTR-INTEGRATION-METHODS-REPORT.md** (20 min read)
   - Comparison of 5 integration approaches
   - Browser automation option
   - Workflow option
   - Custom code option
   - Pros/cons matrix

---

## Next Steps

### Week 1: Foundation

- [ ] Read SOFTR-CUSTOM-INTEGRATIONS-GUIDE.md (45 min)
- [ ] Review SOFTR-INTEGRATION-CODE-TEMPLATES.md (30 min)
- [ ] Identify your integration need
- [ ] Get external API documentation
- [ ] Create test API key/credentials

### Week 2: Build & Test

- [ ] Create REST API Data Source or Workflow
- [ ] Test with sample data
- [ ] Verify in Softr logs
- [ ] Check external system received data
- [ ] Fix errors using troubleshooting guide

### Week 3: Production

- [ ] Set up error handling & retries
- [ ] Configure monitoring/logging
- [ ] Document for your team
- [ ] Deploy to production
- [ ] Monitor regularly

---

## Decision Tree

```
START: Do you need to integrate Softr with external system?

1. Is it a simple one-off API call?
   → YES: Use REST API Data Source ✅
   → NO: Continue

2. Do you need multi-step automation?
   → YES: Use Workflow ✅
   → NO: Continue

3. Is external system calling Softr?
   → YES: Use Softr Database API ✅
   → NO: Use REST API Data Source ✅

4. Is it a pre-built integration (Stripe, Slack, HubSpot)?
   → YES: Use Pre-Built Connector ✅
   → NO: Continue

5. Can you use Zapier?
   → YES: Connect via Zapier ✅
   → NO: Use REST API Data Source ✅
```

---

## Success Metrics

After implementing integrations, measure:

| Metric | Target | Method |
|--------|--------|--------|
| **Setup Time** | <2 hours | Timer from start to production |
| **Success Rate** | >95% | Check workflow logs |
| **Error Rate** | <5% | Monitor failed executions |
| **Response Time** | <5 seconds | Check logs for API response time |
| **Uptime** | >99.5% | Monitor service availability |
| **Data Accuracy** | 100% | Spot check synced records |

---

## Support Resources

### Official Documentation
- Softr API: https://docs.softr.io/softr-api/
- Workflows: https://docs.softr.io/workflows/
- REST Integrations: https://www.softr.io/data-sources/rest-api

### Tools for Testing
- **Postman** - Test APIs before integration
- **Insomnia** - Alternative REST client
- **webhook.site** - Test incoming webhooks
- **curl** - Command-line API testing

### Community
- Softr Community Forum: https://community.softr.io/
- Softr Slack Community
- Stack Overflow tags: [softr], [softr-io]

---

## Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Can build custom integrations?** | ✅ YES | Unlimited via REST API |
| **Pre-built connectors?** | ✅ YES | 20+ direct + 5,000+ via Zapier |
| **Webhook support?** | ✅ YES | Incoming & outgoing |
| **Code blocks?** | ✅ YES | JavaScript & Python |
| **Production-ready?** | ✅ YES | Enterprise-grade |
| **Learning curve?** | ⭐⭐⭐ | Medium (1-2 days) |
| **Implementation time** | 1-3 hours | Varies by complexity |
| **Maintenance burden** | Low | Softr handles infrastructure |
| **Scalability** | Excellent | 20 calls/sec per token |
| **Cost** | Included | In Professional+ plans |

---

## Conclusion

**Softr is fully capable of building production-grade custom integrations** to virtually any REST API. Whether using the no-code REST API Data Source, powerful Workflows with code blocks, or the direct Softr Database API, you have all the tools needed.

**Recommended Path:**
1. Start with REST API Data Source for simple integrations
2. Advance to Workflows for complex automation
3. Use direct API for external system integration
4. Leverage pre-built connectors when available
5. Use Zapier for ecosystem of 5,000+ apps

**Time to Production:** 1-3 hours depending on complexity  
**Difficulty:** Low-Medium  
**Reliability:** Enterprise-grade  

---

**Last Updated:** June 19, 2026  
**Research Complete:** ✅  
**Ready for Implementation:** ✅  
**Viability Score:** 9/10

For detailed implementation: See SOFTR-CUSTOM-INTEGRATIONS-GUIDE.md
