# 📋 eTravel Setup Checklist

Print this out and check off each item as you complete it!

## ✅ Before You Start
- [ ] I have an email address
- [ ] I have access to a web browser
- [ ] I have 30 minutes free

## ✅ Step 1: Airtable Account
- [ ] I created an Airtable account at airtable.com
- [ ] I can log into Airtable

## ✅ Step 2: Get Airtable Tokens
- [ ] I went to Account → Developers → Personal access tokens
- [ ] I created Token #1 (etravel-public-token) for reading data
- [ ] I copied and saved Token #1 somewhere safe
- [ ] I created Token #2 (etravel-admin-token) for reading + writing
- [ ] I copied and saved Token #2 somewhere safe

**Token #1:** `___________________________`

**Token #2:** `___________________________`

## ✅ Step 3: Create .env File
- [ ] I opened a text editor (Notepad or similar)
- [ ] I pasted the template code with my tokens
- [ ] I saved it as `.env` file
- [ ] I put it in `/home/user/alexaura-website1/`

## ✅ Step 4: Add Admin User
- [ ] I opened the eTravel Agency base in Airtable
- [ ] I found the "Admin Users" table
- [ ] I added a new record with:
  - [ ] Name: (my name)
  - [ ] Email: (my email)
  - [ ] Role: Admin
  - [ ] Status: Active
  - [ ] Created Date: Today

**My Admin Email:** `___________________________`

## ✅ Step 5: Add Travel Packages
- [ ] I opened the "Travel Packages" table
- [ ] I added at least 1 package with:
  - [ ] Name
  - [ ] Destination
  - [ ] Duration (days)
  - [ ] Price per person
  - [ ] Max Capacity
  - [ ] Status: Active

**Packages Added:** ☐ 1   ☐ 2   ☐ 3+

## ✅ Step 6: Test Customer Portal
- [ ] I visited `/pages/portal.html`
- [ ] I can see the "eTravel Agency" header
- [ ] I can see my packages listed
- [ ] I can click "View Details" on a package

## ✅ Step 7: Test Admin Login
- [ ] I visited `/pages/admin-login.html`
- [ ] I entered my admin email
- [ ] I clicked "Sign In"
- [ ] I can see the Admin Dashboard

## ✅ Step 8: Test Booking
- [ ] I went to the Customer Portal
- [ ] I filled out a booking form
- [ ] I got a booking confirmation
- [ ] I can see the booking in Admin Dashboard → Bookings tab

## ✅ All Done!
- [ ] Packages are showing correctly
- [ ] Bookings are being saved
- [ ] Admin dashboard is working
- [ ] Everything looks good!

---

## 🚨 If Something Doesn't Work

Check the **BEGINNER_GUIDE.md** section: "Troubleshooting: Something Doesn't Work?"

**OR** contact your tech support person with:
- [ ] What you were trying to do
- [ ] What error message you got (screenshot?)
- [ ] What browser you're using

---

## 📞 Support Contacts

**Tech Support:** `_________________________`

**Questions about bookings:** `_________________________`

**Questions about payments:** `_________________________`

Good luck! 🚀
