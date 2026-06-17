# 🎯 eTravel Setup - Beginner's Guide (Super Simple!)

This is a **step-by-step guide** to get your eTravel travel booking system working. Don't worry - it's easier than it looks!

## What You're Setting Up

Think of it like this:
- **Airtable** = A database (like Excel in the cloud) that stores all your travel data
- **The Website** = Two websites you'll create:
  - One for **customers** to browse and book trips
  - One for **you (admin)** to manage everything

---

## STEP 1: Create Your Airtable Account (If You Don't Have One)

### What You Need:
- An email address
- A web browser

### Instructions:

1. Go to **https://airtable.com**
2. Click **"Sign up for free"** (top right)
3. Enter your email address
4. Create a password
5. Click **Sign up**
6. ✅ You now have an Airtable account!

---

## STEP 2: Get Your Secret Tokens (These Unlock the Website)

**What is a "token"?** 
- It's like a special password that lets the website talk to Airtable
- You need 2 tokens (one for customers, one for you as admin)

### Instructions:

1. Log in to Airtable
2. Click your **profile icon** (top right corner) → **Account**
3. On the left menu, click **"Developers"** → **"Personal access tokens"**
4. Click **"Create token"** button (top right)

**For Token #1 (Customer Token):**
- Name: `etravel-public-token`
- Click **"Scopes"** dropdown
- Check: `data.records:read` (this means read-only)
- Click **"Create token"**
- **COPY THE TOKEN** (it's a long string) - save it somewhere safe!

**For Token #2 (Admin Token):**
- Repeat the same steps but name it `etravel-admin-token`
- This time check BOTH:
  - `data.records:read`
  - `data.records:write`
- **COPY THIS TOKEN** too!

✅ You now have your 2 tokens!

---

## STEP 3: Create the `.env` File (Where You Put Your Tokens)

**What is `.env`?**
- It's a special file that stores your secret tokens
- It's private (never shared online)

### Instructions:

1. Open a text editor (like Notepad on Windows, TextEdit on Mac)
2. Copy and paste this:
```
AIRTABLE_PUBLIC_TOKEN=paste_your_public_token_here
AIRTABLE_ADMIN_TOKEN=paste_your_admin_token_here
```

3. Replace:
   - `paste_your_public_token_here` with your first token
   - `paste_your_admin_token_here` with your second token

4. Save the file as `.env` (just the filename, nothing else)
5. Put this file in the main folder: `/home/user/alexaura-website1/.env`

✅ Your `.env` file is now ready!

---

## STEP 4: Add an Admin User (So You Can Login)

**What is an "admin user"?**
- It's your staff account so you can login to manage everything

### Instructions:

1. Go to your Airtable account
2. Open the **"eTravel Agency"** base (you should see it in the list)
3. At the bottom, find the **"Admin Users"** table
4. Click **"+"** to add a new record
5. Fill in:
   - **Name:** Your name (e.g., "John Smith")
   - **Email:** Your email address (e.g., "john@example.com")
   - **Role:** Click dropdown → select **"Admin"**
   - **Status:** Click dropdown → select **"Active"**
   - **Created Date:** Today's date

6. Click **Save**

✅ You can now login!

---

## STEP 5: Test the Customer Portal

**What is the portal?**
- This is the website where customers can browse and book trips

### Instructions:

1. Open your web browser
2. Type in the address bar: **`http://localhost:3000/pages/portal.html`**
   - (Or ask your tech person what your website URL is)
3. You should see a page that says **"eTravel Agency"** with a search box
4. ✅ The portal is working!

---

## STEP 6: Test the Admin Dashboard

**What is the dashboard?**
- This is where YOU manage all the bookings, clients, and payments

### Instructions:

1. Open your web browser
2. Go to: **`http://localhost:3000/pages/admin-login.html`**
3. Enter:
   - **Email:** The email you created in Step 4
   - **Password:** (Leave blank for now - it's simplified for testing)
4. Click **"Sign In"**
5. ✅ You should see the Admin Dashboard!

---

## STEP 7: Add Some Travel Packages (So Customers Can Book)

**Why do this?**
- Without packages, there's nothing for customers to book!

### Instructions:

1. Go to your Airtable base
2. Open the **"Travel Packages"** table
3. Click **"+"** to add a new package
4. Fill in:
   - **Name:** e.g., "Paris City Tour"
   - **Description:** e.g., "Visit the Eiffel Tower and museums"
   - **Destination Name:** e.g., "Paris"
   - **Duration (Days):** e.g., "7"
   - **Price per Person:** e.g., "1500"
   - **Max Capacity:** e.g., "20"
   - **Current Bookings:** "0"
   - **Status:** "Active"
   - **Highlights:** e.g., "Eiffel Tower, Louvre Museum, Seine River"

5. Click **Save**

6. Add 2-3 more packages so customers have choices

✅ Customers can now see packages in the portal!

---

## STEP 8: Test a Booking

**Let's make sure the whole system works!**

### Instructions:

1. Go to the **Customer Portal** (`/pages/portal.html`)
2. You should see your packages listed
3. Click **"View Details"** on one
4. Fill in the booking form:
   - **Full Name:** e.g., "Jane Doe"
   - **Email:** e.g., "jane@example.com"
   - **Phone:** e.g., "555-1234"
   - **Departure Date:** Pick a date
   - **Return Date:** Pick a later date
   - **Number of Travelers:** "2"
   - **Special Requests:** Leave blank or type something

5. Click **"Book Now"**
6. You should see a success message with a booking ID!

✅ The booking system is working!

---

## STEP 9: Check the Booking in Admin Dashboard

**Verify the booking was saved**

### Instructions:

1. Login to **Admin Dashboard** (`/pages/admin-login.html`)
2. Click on **"Bookings"** tab
3. You should see the booking you just made!
4. Click on **"Analytics"** to see revenue stats

✅ Everything is connected and working!

---

## 🎉 You're Done!

Your eTravel system is now **live and working**!

### What You Can Do Now:

**As a Customer:**
- Browse travel packages
- Search and filter by price, duration, destination
- Submit booking requests

**As Admin:**
- View all bookings
- Manage clients
- Track payments
- View revenue reports
- Update booking status

---

## Troubleshooting: Something Doesn't Work?

### Problem: "Page not found" error

**Solution:**
- Make sure your website is running
- Ask your tech person to check the server

### Problem: Can't login to admin

**Solution:**
- Double-check the email address matches what you entered in Step 4
- Make sure the user status is "Active" in Airtable

### Problem: Packages not showing in portal

**Solution:**
- Make sure you added packages to the "Travel Packages" table
- Make sure they have Status = "Active"
- Refresh the page (press F5)

### Problem: "Token not configured" error

**Solution:**
- Check your `.env` file has both tokens
- Make sure tokens are pasted completely (they're long!)
- Restart the website

---

## Questions?

If something doesn't work:
1. Take a screenshot of the error
2. Write down what you were doing when it happened
3. Ask your tech team for help

You did it! 🚀
