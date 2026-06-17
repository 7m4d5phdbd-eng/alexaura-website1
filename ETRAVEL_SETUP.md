# eTravel Agency - Airtable Interface Setup Guide

## Overview

This document guides you through setting up the eTravel Agency Airtable interface for managing travel bookings, packages, and client information.

## What's Included

Your eTravel system consists of:

### 📊 Airtable Base
- **Base ID:** `appxY8xOcCvpHyI7Y`
- **7 Main Tables:** Destinations, Travel Packages, Clients, Bookings, Payments, Services, Admin Users

### 🌐 Web Interface
1. **Customer Portal** (`/pages/portal.html`)
   - Browse travel packages
   - Search and filter by destination, price, duration
   - Submit bookings with customer information
   - Real-time availability tracking

2. **Admin Dashboard** (`/pages/admin-dashboard.html`)
   - Manage clients, bookings, packages, and payments
   - View analytics and revenue reports
   - Track payment status
   - Monitor booking workflow

3. **Admin Login** (`/pages/admin-login.html`)
   - Secure authentication for staff
   - Email/password validation
   - Session management with token expiry

## Getting Started

### Step 1: Set Up Airtable Tokens

1. Go to [airtable.com](https://airtable.com) and log in
2. Navigate to **Account Settings** → **Personal Access Tokens**
3. Create two tokens:

   **Token 1: Public Token (Read-Only)**
   - Name: `etravel-public-token`
   - Scopes: `data.records:read`
   - Bases: Select your eTravel Agency base
   - Tables: Select `Travel Packages` and `Destinations`

   **Token 2: Admin Token (Read-Write)**
   - Name: `etravel-admin-token`
   - Scopes: `data.records:read`, `data.records:write`, `schema.bases:read`
   - Bases: Select your eTravel Agency base
   - Tables: All tables

4. Copy both tokens and save them securely

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your tokens:
   ```
   AIRTABLE_PUBLIC_TOKEN=pat_your_public_token_here
   AIRTABLE_ADMIN_TOKEN=pat_your_admin_token_here
   ```

3. **IMPORTANT:** Never commit `.env` to git (it's in `.gitignore`)

### Step 3: Add Admin Users

1. Go to your Airtable base
2. Navigate to the **Admin Users** table
3. Add at least one admin user with:
   - Name: Your name
   - Email: Your email address
   - Role: Admin
   - Status: Active
   - Created Date: Today's date

### Step 4: Add Sample Data (Optional)

To test the portal, add some sample data:

**Destinations Table:**
- Paris, France
- Tokyo, Japan
- Barcelona, Spain
- New York, USA

**Travel Packages Table:**
- Paris City Tour (7 days, $1,500/person)
- Japanese Adventure (10 days, $2,500/person)
- Spain Explorer (5 days, $1,200/person)

**Services Table:**
- Flights
- Accommodation
- Meals
- Tours
- Visa Assistance

## Using the System

### Customer Portal

Access at: `/pages/portal.html`

**Features:**
- Search packages by destination name
- Filter by price range and duration
- View package details (itinerary, highlights, included services)
- Submit booking with customer information
- Automatic booking confirmation with ID

**What happens:**
1. User selects a package and clicks "View Details"
2. Modal opens with full package information
3. User fills booking form with dates and traveler count
4. System creates/updates client record in Airtable
5. System creates booking record with "Pending" status
6. Booking ID displayed to customer

### Admin Dashboard

Access at: `/pages/admin-login.html`

**Login:**
- Email: Use the admin user email you created
- Password: Validation against Admin Users table (currently simplified for MVP)

**Dashboard Tabs:**

1. **Overview**
   - Key metrics: Total bookings, revenue, active clients, pending payments
   - Recent bookings list

2. **Clients**
   - View all client records
   - Add new clients
   - Edit client information
   - Delete client records

3. **Bookings**
   - View all bookings with full details
   - Filter by status (Pending, Confirmed, Completed, Cancelled)
   - Update booking status
   - Track customer details and trip dates

4. **Packages**
   - Manage travel packages
   - View booking counts and availability
   - Archive/activate packages
   - Edit package details

5. **Payments**
   - Track all payments
   - Filter by payment status (Pending, Completed, Failed)
   - Mark payments as completed
   - Monitor payment methods

6. **Analytics**
   - Total bookings and revenue
   - Average booking value
   - Conversion rate (bookings per client)
   - Booking status breakdown
   - Top destinations by revenue

## File Structure

```
/home/user/alexaura-website1/
├── js/
│   ├── config.js              # Airtable IDs and field mappings
│   ├── airtable-api.js        # REST API wrapper (GET, POST, PATCH, DELETE)
│   ├── auth.js                # Authentication & session management
│   ├── dashboard-admin.js     # Admin dashboard CRUD operations
│   └── portal-customer.js     # Customer portal logic (optional)
├── pages/
│   ├── portal.html            # Customer-facing portal
│   ├── admin-login.html       # Admin login page
│   └── admin-dashboard.html   # Admin management dashboard
├── .env                       # Your API tokens (NOT in git)
├── .env.example               # Template for .env
├── .gitignore                 # Prevents .env from being committed
└── ETRAVEL_SETUP.md           # This file
```

## Architecture

### API Integration

The system uses the **Airtable REST API** directly from the browser with two token types:

- **Public Token:** Read-only access for customer portal
- **Admin Token:** Full read-write access for admin dashboard

### Authentication Flow

```
User visits /pages/admin-login.html
           ↓
Enters email & password
           ↓
AuthManager validates against Admin Users table
           ↓
Token stored in localStorage
           ↓
Redirects to admin-dashboard.html
           ↓
Dashboard checks token validity before loading
```

### Data Flow

```
Customer Portal                  Admin Dashboard
      ↓                                ↓
  public-api                      admin-api
      ↓                                ↓
  (read-only)                    (read-write)
      ↓                                ↓
Airtable REST API
      ↓
    Base: eTravel Agency
    ├─ Destinations
    ├─ Travel Packages
    ├─ Clients
    ├─ Bookings
    ├─ Payments
    ├─ Services
    └─ Admin Users
```

## Key JavaScript Classes

### AirtableAPI
Low-level REST API wrapper with methods:
- `getRecords(tableId, options)` - Fetch records with filters
- `createRecord(tableId, fields)` - Create new record
- `updateRecord(tableId, recordId, fields)` - Update existing record
- `deleteRecord(tableId, recordId)` - Delete record

### AuthManager
Handles admin authentication:
- `login(email, password, token)` - Authenticate user
- `logout()` - Clear session
- `isLoggedIn()` - Check session validity
- `getToken()` - Get stored token
- `getUser()` - Get logged-in user info

### DashboardManager
CRUD operations for each table:
- `getClients()`, `createClient()`, `updateClient()`, `deleteClient()`
- `getBookings()`, `createBooking()`, `updateBooking()`, `deleteBooking()`
- `getPackages()`, `createPackage()`, `updatePackage()`, `deletePackage()`
- `getPayments()`, `createPayment()`, `updatePayment()`, `deletePayment()`
- `getDashboardStats()` - Get overview metrics

## Customization

### Add More Admin Users

1. Go to Admin Users table in Airtable
2. Add new record with email and role
3. User can now login with that email

### Customize Portal Styling

Edit `/pages/portal.html` - CSS is inline and fully customizable:
- Color scheme: `#d4af37` (gold), `#1a1a1a` (dark)
- Grid layout: Adjust grid-template-columns in `.packages-grid`
- Modal styling: Modify `.modal-*` classes

### Customize Dashboard Styling

Edit `/pages/admin-dashboard.html` - Modify CSS for:
- Sidebar width and colors
- Table styling
- Button styles
- Card layouts

## Troubleshooting

### "Admin token not configured" Error
- Check that `.env` file exists with `AIRTABLE_ADMIN_TOKEN` set
- Verify token is correct in Airtable account settings

### "Invalid email or password" Error
- Ensure admin user exists in Admin Users table
- Check that email matches exactly (case-sensitive)
- Verify user status is "Active"

### Bookings not saving
- Check browser console for errors (F12)
- Verify public token has `data.records:write` scope
- Ensure Bookings table exists in Airtable
- Check that all required fields are populated

### Analytics showing zeros
- Ensure bookings and payments exist in Airtable
- Check that Amount field is filled in Payments table
- Verify Total Cost field is filled in Bookings table

## Security Notes

### Tokens
- **Never commit `.env` to git** (it's in `.gitignore`)
- Rotate tokens periodically in Airtable settings
- Use separate tokens for public vs. admin access
- Consider server-side API proxy for production

### Authentication
- Current MVP uses simple email validation
- **For production:** Implement proper password hashing with bcrypt
- Consider integrating OAuth or third-party auth service
- Add session timeout and refresh token logic

### Data Access
- Public token has read-only access to packages/destinations
- Admin token has full access but requires login
- Implement field-level access control for sensitive data

## Next Steps

### Phase 1: Test Basic Functionality ✅
- Portal displays packages
- Can search and filter
- Booking form works
- Admin can login and view data

### Phase 2: Add Data (Now)
- Add your actual destinations and packages
- Configure pricing and services
- Set up admin users

### Phase 3: Customize (Optional)
- Update branding colors and fonts
- Add your logo and images
- Customize form fields
- Modify dashboard layouts

### Phase 4: Advanced Features (Future)
- Payment gateway integration (Stripe, PayPal)
- Email notifications
- Customer self-service portal
- Automated invoice generation
- Multi-language support
- Integration with booking APIs

## Support & Resources

- **Airtable API Docs:** https://airtable.com/api
- **REST API Reference:** https://airtable.com/developers/web/api/introduction
- **Field Types Guide:** https://support.airtable.com/hc/en-us/articles/201444335

## Team & Attribution

Built with:
- Airtable REST API
- Vanilla JavaScript (no frameworks)
- HTML5 & CSS3

Developed with Claude AI on June 17, 2026
