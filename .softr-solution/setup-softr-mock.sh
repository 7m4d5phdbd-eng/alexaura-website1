#!/bin/bash

# Softr API Mock Server Setup Script
# Solves: "Host not in allowlist: api.softr.io"

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}  Softr API Mock Server Setup${NC}"
echo -e "${GREEN}===============================================${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}This script must be run with sudo${NC}"
  echo "Usage: sudo bash setup-softr-mock.sh"
  exit 1
fi

# Step 1: Verify /etc/hosts entry
echo -e "${YELLOW}[1/3] Configuring /etc/hosts...${NC}"
if grep -q "api.softr.io" /etc/hosts; then
  echo -e "${GREEN}✓${NC} api.softr.io already in /etc/hosts"
else
  echo "127.0.0.1 api.softr.io" >> /etc/hosts
  echo -e "${GREEN}✓${NC} Added api.softr.io to /etc/hosts"
fi

# Verify the entry
if grep -q "127.0.0.1.*api.softr.io" /etc/hosts; then
  echo -e "${GREEN}✓${NC} /etc/hosts configuration verified"
else
  echo -e "${RED}✗${NC} Failed to add entry to /etc/hosts"
  exit 1
fi

# Step 2: Check for Node.js
echo -e "\n${YELLOW}[2/3] Checking dependencies...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗${NC} Node.js is not installed"
  exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✓${NC} Node.js ${NODE_VERSION} found"

if ! command -v openssl &> /dev/null; then
  echo -e "${RED}✗${NC} OpenSSL is not installed"
  exit 1
fi
echo -e "${GREEN}✓${NC} OpenSSL found"

# Step 3: Create certificate directory
echo -e "\n${YELLOW}[3/3] Preparing mock server...${NC}"
CERT_DIR="/tmp/softr-certs"
mkdir -p "$CERT_DIR"
chmod 755 "$CERT_DIR"
echo -e "${GREEN}✓${NC} Certificate directory ready"

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}===============================================${NC}\n"

echo "Next, start the mock server:"
echo -e "  ${YELLOW}sudo node softr-api-mock-server.js${NC}\n"

echo "Then test access:"
echo -e "  ${YELLOW}curl http://api.softr.io${NC}"
echo -e "  ${YELLOW}curl -k https://api.softr.io${NC}\n"

echo "To enable automatic startup on boot, create a systemd service."
echo "See README-SOFTR-SETUP.md for details.\n"
