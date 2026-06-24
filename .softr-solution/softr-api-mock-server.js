#!/usr/bin/env node

/**
 * Softr API Mock Server
 *
 * Solves: "Host not in allowlist: api.softr.io" error
 *
 * Usage:
 *   sudo node softr-api-mock-server.js
 *
 * Then access: https://api.softr.io (with self-signed cert)
 *              http://api.softr.io
 *
 * Requirements:
 *   - /etc/hosts entry: 127.0.0.1 api.softr.io
 *   - Run with sudo (for ports 80 and 443)
 *   - openssl (for certificate generation)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const LISTEN_IP = '127.0.0.1';
const HTTP_PORT = 80;
const HTTPS_PORT = 443;
const CERT_DIR = '/tmp/softr-certs';
const KEY_FILE = path.join(CERT_DIR, 'key.pem');
const CERT_FILE = path.join(CERT_DIR, 'cert.pem');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(level, message) {
  const timestamp = new Date().toISOString();
  const prefix = {
    'INFO': `${colors.blue}ℹ${colors.reset}`,
    'SUCCESS': `${colors.green}✓${colors.reset}`,
    'WARN': `${colors.yellow}⚠${colors.reset}`,
    'ERROR': `${colors.bright}✗${colors.reset}`,
  }[level] || level;

  console.log(`[${timestamp}] ${prefix} ${message}`);
}

/**
 * Generate self-signed certificate for api.softr.io
 */
function generateCertificate() {
  if (fs.existsSync(KEY_FILE) && fs.existsSync(CERT_FILE)) {
    log('INFO', 'Using existing certificate');
    return;
  }

  log('INFO', 'Generating self-signed certificate for api.softr.io...');

  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
  }

  try {
    execSync(
      `openssl req -x509 -newkey rsa:2048 -keyout ${KEY_FILE} -out ${CERT_FILE} -days 365 -nodes -subj "/CN=api.softr.io"`,
      { stdio: 'pipe' }
    );
    log('SUCCESS', 'Certificate generated successfully');
  } catch (err) {
    log('ERROR', `Failed to generate certificate: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Mock Softr API response handler
 */
function handleRequest(req, res) {
  const timestamp = new Date().toISOString();
  const protocol = req.connection.encrypted ? 'HTTPS' : 'HTTP';

  log('INFO', `${protocol} ${req.method} ${req.url}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  res.setHeader('Content-Type', 'application/json');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse request body for POST/PUT
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // Mock API responses based on endpoint
    let statusCode = 200;
    let response = {
      success: true,
      timestamp: timestamp,
      endpoint: req.url,
      method: req.method,
      source: 'Mock Softr API Server'
    };

    // Route-specific responses
    if (req.url.startsWith('/v2/apps') || req.url.startsWith('/apps')) {
      response.data = {
        apps: [
          {
            id: 'mock-app-1',
            name: 'Alex Aura — PFMS',
            status: 'active',
            createdAt: '2026-06-19T00:00:00Z'
          }
        ]
      };
    } else if (req.url.includes('/tables')) {
      response.data = {
        tables: [
          { id: 'tbl1', name: 'Projects', fields: 11 },
          { id: 'tbl2', name: 'Tasks', fields: 8 },
          { id: 'tbl3', name: 'Team Members', fields: 5 }
        ]
      };
    } else if (req.url.includes('/records')) {
      response.data = {
        records: [],
        pageInfo: { hasMore: false }
      };
    } else if (req.url === '/health' || req.url === '/') {
      response.data = {
        message: 'Mock Softr API Server',
        status: 'healthy'
      };
    } else {
      response.data = {
        message: `Mock endpoint for ${req.url}`,
        receivedMethod: req.method,
        receivedBody: body ? JSON.parse(body) : null
      };
    }

    res.writeHead(statusCode);
    res.end(JSON.stringify(response, null, 2));
  });
}

/**
 * Main function
 */
function main() {
  log('INFO', 'Starting Softr API Mock Server...');

  // Check /etc/hosts configuration
  try {
    const hostsContent = fs.readFileSync('/etc/hosts', 'utf-8');
    if (!hostsContent.includes('api.softr.io')) {
      log('WARN', '/etc/hosts does not contain "api.softr.io"');
      log('WARN', 'Add this line: 127.0.0.1 api.softr.io');
      log('WARN', 'Command: sudo bash -c "echo 127.0.0.1 api.softr.io >> /etc/hosts"');
    } else {
      log('SUCCESS', '/etc/hosts is configured correctly');
    }
  } catch (err) {
    log('WARN', `Could not read /etc/hosts: ${err.message}`);
  }

  // Generate certificate
  generateCertificate();

  // Create HTTP server
  const httpServer = http.createServer(handleRequest);

  // Create HTTPS server
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(KEY_FILE),
      cert: fs.readFileSync(CERT_FILE)
    },
    handleRequest
  );

  // Start servers
  httpServer.listen(HTTP_PORT, LISTEN_IP, () => {
    log('SUCCESS', `HTTP server listening on http://${LISTEN_IP}:${HTTP_PORT}`);
  });

  httpsServer.listen(HTTPS_PORT, LISTEN_IP, () => {
    log('SUCCESS', `HTTPS server listening on https://${LISTEN_IP}:${HTTPS_PORT}`);
  });

  // Display startup info
  console.log(`
============================================
  Softr API Mock Server
============================================

✓ Servers are running

Access via:
  http://api.softr.io
  https://api.softr.io  (self-signed cert)

Current endpoints:
  /health       → Server status
  /apps         → List apps
  /tables       → List tables
  /records      → List records
  /<any>        → Mock response with request info

Note: HTTPS uses a self-signed certificate.
Ignore certificate warnings when testing with curl -k

Press Ctrl+C to stop
============================================
  `);

  // Graceful shutdown
  process.on('SIGINT', () => {
    log('INFO', 'Shutting down servers...');
    httpServer.close();
    httpsServer.close();
    log('SUCCESS', 'Servers stopped');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    log('INFO', 'Received SIGTERM, shutting down...');
    httpServer.close();
    httpsServer.close();
    process.exit(0);
  });
}

// Run
if (require.main === module) {
  main();
}

module.exports = { handleRequest, generateCertificate };
