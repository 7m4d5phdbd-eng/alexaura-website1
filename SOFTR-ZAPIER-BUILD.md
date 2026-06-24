# بناء تطبيق PFMS عبر Zapier + Softr.io
# Building PFMS Application via Zapier + Softr.io

## Overview
This document provides the complete Zapier automation setup to integrate Airtable (appPkAZ0LWnLp9eZi) with Softr.io and build the 5-page PFMS application.

---

## الخطوات الأساسية | Basic Steps

### Step 1: Verify Airtable Base
- **Base ID:** `appPkAZ0LWnLp9eZi`
- **Tables:** 11 tables (Team Members, Projects, Tasks, Assignments, Budget, Time Tracking, Folders, Files, Milestones, Risks, Tags)
- **Status:** ✓ All tables created and populated with initial data

### Step 2: Connect Zapier Apps
1. Enable Airtable in Zapier
2. Enable Softr in Zapier
3. Create authentication connections for both

### Step 3: Create Zaps (Automated Workflows)

#### Zap 1: Airtable → Softr (Dashboard Data Sync)
```
Trigger: New Record in Airtable (Projects table)
Action: Create/Update in Softr (Dashboard)
Map Fields:
  - Project Name → Title
  - Status → Status Badge
  - Budget → Budget Display
  - Progress % → Progress Bar
```

#### Zap 2: Projects Grid Sync
```
Trigger: Record Updated in Airtable (Projects)
Action: Update Softr Projects Page
Map Fields:
  - All project fields to grid columns
```

#### Zap 3: Tasks Kanban Sync
```
Trigger: Record Updated in Airtable (Tasks)
Action: Update Softr Tasks Kanban
Map Fields:
  - Task Name → Card Title
  - Status → Kanban Column
  - Assignee → Assignee Badge
  - Priority → Color Coding
```

#### Zap 4: Budget Statistics Sync
```
Trigger: Record Updated in Airtable (Budget)
Action: Update Softr Budget Page
Map Fields:
  - Total Allocated → Display Value
  - Spent (Rollup) → Display Value
  - Remaining → Calculated Display
  - Percentage Used → Progress Bar
```

#### Zap 5: File Library Sync
```
Trigger: New Record in Airtable (Files)
Action: Create File Reference in Softr
Map Fields:
  - File Name → Display Name
  - Folder (Link) → Folder Path
  - File Type → Icon/Badge
  - Uploaded By → Metadata
  - Upload Date → Timestamp
```

#### Zap 6: Task Assignments Notification
```
Trigger: New Record in Airtable (Assignments)
Action: Send Slack/Email Notification
Recipients: Assigned Team Member
Message: "New task assigned: {Task Name} - Due {Due Date}"
```

#### Zap 7: Budget Alert
```
Trigger: Record Updated in Airtable (Projects)
Condition: Spent > (Budget × 0.8)
Action: Send Alert to Project Owner
Message: "Project {Project Name} budget is {Percentage}% spent"
```

---

## Zapier Automation Configuration

### Authentication Setup
```
1. Go to Zapier.com
2. Create/Login to account (mr.cleaner312@gmail.com)
3. Connect Airtable:
   - Click "Connect" → Airtable
   - Authenticate with your Airtable account
   - Verify base: appPkAZ0LWnLp9eZi
4. Connect Softr:
   - Click "Connect" → Softr
   - Authenticate with your Softr account
   - Verify workspace
```

### Creating Each Zap (Template)

#### Template: Airtable to Softr Sync
```javascript
{
  "name": "Airtable Projects → Softr Dashboard",
  "trigger": {
    "app": "airtable",
    "event": "new_record",
    "data": {
      "base": "appPkAZ0LWnLp9eZi",
      "table": "Projects"
    }
  },
  "action": {
    "app": "softr",
    "event": "create_page_record",
    "data": {
      "page": "Dashboard",
      "fields": {
        "project_name": "{{trigger.fields.Project Name}}",
        "status": "{{trigger.fields.Status}}",
        "owner": "{{trigger.fields.Owner}}",
        "budget": "{{trigger.fields.Budget}}",
        "spent": "{{trigger.fields.spent}}",
        "progress": "{{trigger.fields.Progress %}}",
        "priority": "{{trigger.fields.Priority}}"
      }
    }
  }
}
```

---

## Softr Pages Configuration

### Page 1: Dashboard
**Type:** Statistics + Cards + Charts

Data Sources (from Airtable):
- Active Projects Count: `COUNTA(Projects where Status = "Active")`
- Tasks Due This Week: `COUNTA(Tasks where Due Date <= TODAY+7)`
- Budget Summary: `SUM(Projects.Budget)`
- Team Workload: `AVG(Team Members.Active Tasks)`

Widgets:
- 4 Stat Cards (Projects, Tasks, Budget, Team)
- Projects Grid (top 5 active)
- Budget Pie Chart
- Team Workload Bar Chart
- Recent Files List
- Calendar View (Tasks due dates)

### Page 2: Projects
**Type:** Grid/Table with Filters

Data Source: Projects table
Columns:
- Project Name (linked to detail)
- Status (color-coded badge)
- Owner (team member link)
- Progress % (progress bar)
- Budget (formatted number)
- Spent (formatted number)
- Due Date (date picker)
- Priority (badge)

Features:
- Filters: Status, Owner, Priority, Date Range
- Sort: By Progress, Due Date, Budget
- New Project: Modal form with all fields
- Click row: Open Project Detail page

### Page 3: Project Detail
**Type:** Tabbed Interface (6 tabs)

Tabs:
1. **Overview**
   - Project info cards
   - Key metrics
   - Team members
   
2. **Tasks (Hierarchical)**
   - Parent/Child tasks tree
   - Status badges
   - Assignee avatars
   - Due dates
   - Collapse/expand hierarchy
   
3. **Timeline/Gantt**
   - Start/Due dates as bars
   - Progress visualization
   - Dependency lines
   
4. **Team**
   - Team members on project
   - Roles and allocations
   - Workload percentages
   
5. **Budget**
   - Budget allocated
   - Spent breakdown by category
   - Remaining amount
   - Budget chart
   
6. **Files (by Folder)**
   - Folder tree navigation
   - File list with upload date
   - Download links
   - File type badges

### Page 4: Tasks (Main View)
**Type:** Kanban Board + Table + Calendar

Kanban Columns:
- To Do
- In Progress
- In Review
- Done

Features:
- Drag-drop to update status
- Filter: Project, Assignee, Priority, Date
- Sort: Priority, Due Date, Created
- Card shows: Task name, assignee avatar, due date, priority
- "+ New Task" button

Table View:
- All tasks grid
- Same filters and sorts
- Inline editing capability

Calendar View:
- Tasks plotted by due date
- Color by priority
- Click to open detail

### Page 5: Budget & Reports
**Type:** Statistics + Charts + Table

Statistics:
- Total Allocated (all projects)
- Total Spent (sum of Time Tracking costs)
- Total Remaining
- Budget Utilization % (Spent/Allocated)

Charts:
1. Pie Chart: Budget by Project
2. Bar Chart: Spent vs Allocated by Project
3. Line Chart: Spending over time (monthly)
4. Pie Chart: Spending by Category (Payroll, Contractors, Tools, etc.)

Table:
- All budget records
- Columns: Project, Category, Allocated, Spent, Status, Due Date
- Filters: Project, Category, Status, Date Range
- Sort: Any column
- Export: CSV/PDF

### Page 6: File Library (Company-Wide)
**Type:** Folder Tree Navigator + File Grid

Structure (from Folders table with Parent Folder self-link):
```
🏢 Alex Aura (root)
 ├─ 01 Projects
 │  ├─ [Project 1]
 │  │  ├─ Contracts
 │  │  ├─ Designs
 │  │  ├─ Deliverables
 │  │  └─ Reports
 │  └─ [Project 2]...
 ├─ 02 Clients
 ├─ 03 Finance (Managers Only)
 ├─ 04 Legal & Contracts
 ├─ 05 HR / Team (Managers Only)
 ├─ 06 Marketing & Branding
 ├─ 07 Operations & SOPs
 ├─ 08 Admin
 └─ 09 Archive
```

Features:
- Left sidebar: Folder tree (click to navigate)
- Breadcrumb: Shows current path
- Main area: Files in current folder
- Back button: Navigate up
- Filter: File Type, Uploader, Date
- Search: By file name
- "+ New Folder" button
- "+ Upload File" button
- Preview/Download/Version history for each file
- Access control: Restricted folders hidden for non-managers

### Page 7: Team & Resources
**Type:** Grid + Charts + Alerts

Team Grid:
- Name
- Role
- Email
- Department
- Hourly Rate
- Skills (multi-select badges)
- Availability Status
- Active Tasks Count

Workload Chart:
- Bar chart: Hours logged per person this week
- Red alert if > 40 hours
- Yellow alert if > 35 hours

Performance Metrics:
- Tasks completed (this month)
- On-time delivery % (tasks completed by due date)
- Average task completion time

---

## Role-Based Access Control (in Softr)

### Manager (Ali)
- See all pages
- Edit all projects, tasks, budgets
- View finance/HR folders
- Create users, modify access
- View reports
- Export data

### Team Member (Alyssar)
- Dashboard (read-only stats)
- Projects (read-only)
- Tasks (see assigned, update status)
- Files (upload/view except Finance/HR)
- NO Budget view
- NO Reports
- NO User management

### Freelancer (Future)
- Tasks (only assigned)
- Files (upload to assigned tasks)
- NO Projects
- NO Budget
- NO Team view
- NO Reports

---

## Implementation Checklist

### Phase 1: Setup (30 mins)
- [ ] Verify Airtable base exists
- [ ] Create Zapier account
- [ ] Connect Airtable to Zapier
- [ ] Connect Softr to Zapier
- [ ] Test connections

### Phase 2: Build Softr App (2-3 hours)
- [ ] Create Dashboard page
- [ ] Create Projects page
- [ ] Create Project Detail page
- [ ] Create Tasks page (Kanban + Table + Calendar)
- [ ] Create Budget & Reports page
- [ ] Create File Library page
- [ ] Create Team & Resources page

### Phase 3: Configure Zaps (2-3 hours)
- [ ] Zap 1: Projects → Dashboard
- [ ] Zap 2: Projects → Grid
- [ ] Zap 3: Tasks → Kanban
- [ ] Zap 4: Budget → Stats
- [ ] Zap 5: Files → Library
- [ ] Zap 6: Assignments → Notifications
- [ ] Zap 7: Budget Alerts

### Phase 4: Setup Access Control (1 hour)
- [ ] Create Manager user group
- [ ] Create Team Member user group
- [ ] Configure Softr visibility rules
- [ ] Test with Ali account
- [ ] Test with Alyssar account

### Phase 5: Testing & Launch (2-3 hours)
- [ ] Create sample project
- [ ] Create sample tasks
- [ ] Test Kanban drag-drop
- [ ] Test filters and sorts
- [ ] Test file upload/download
- [ ] Test notifications
- [ ] Test access control
- [ ] Share with team
- [ ] Monitor logs

---

## Direct URLs After Setup

Once complete, share these links with your team:
- **Dashboard:** `https://[your-workspace].softr.app/dashboard`
- **Projects:** `https://[your-workspace].softr.app/projects`
- **Tasks:** `https://[your-workspace].softr.app/tasks`
- **Budget:** `https://[your-workspace].softr.app/budget`
- **Files:** `https://[your-workspace].softr.app/files`
- **Team:** `https://[your-workspace].softr.app/team`

---

## Troubleshooting

### Issue: Zapier not syncing data
**Solution:** 
1. Check Airtable connection in Zapier → "Test Connection"
2. Verify Softr page name matches Zap action config
3. Check Zapier activity logs for errors
4. Re-authorize both apps if > 30 days old

### Issue: File uploads not appearing
**Solution:**
1. Verify Folders table has Parent Folder links setup correctly
2. Check Files table Folder link field
3. Test with a single file first
4. Check Softr File Library page data source

### Issue: Access control not working
**Solution:**
1. In Softr, go to Settings → User Groups
2. Verify Manager/Team Member groups created
3. Check each page has visibility rules:
   - Finance pages: Manager only
   - Reports: Manager only
   - Budget: Manager only
   - Tasks: Logged-in users (but read-only for non-assignees)
4. Test with incognito/different user

---

## Next Steps

1. **Read:** FINAL-SOFTR-INTEGRATION-SUMMARY.txt (executive summary)
2. **Follow:** SOFTR-WORKFLOWS-SETUP-GUIDE.md (step-by-step)
3. **Execute:** Create Zaps in order (Zap 1 → Zap 7)
4. **Test:** Follow verification checklist
5. **Deploy:** Share with team and monitor

**Estimated Total Time:** 6-8 hours for complete implementation

---

## Contact & Support

If issues arise:
1. Check Zapier activity logs: `zapier.com/app/dashboard`
2. Check Softr error logs: Settings → Logs
3. Review Airtable base structure
4. Consult SOFTR-INTEGRATION-GUIDE.md for technical details

**Status:** Ready to build! 🚀
