# 🤖 Softr.io AI Builder Prompt — Copy & Paste This

Copy the entire prompt below and paste it into Softr's AI builder or any AI assistant to automatically build your PFMS app.

---

```
BUILD A COMPLETE PROJECT MANAGEMENT SYSTEM IN SOFTR.IO

PROJECT: PFMS v2.0
AIRTABLE BASE: appPkAZ0LWnLp9eZi
WORKSPACE: marlin390JNHBHBHJBJJM

BUILD ALL 7 PAGES WITH THESE SPECIFICATIONS:

---
PAGE 1: DASHBOARD
Type: Custom Dashboard
Data Source: Airtable base appPkAZ0LWnLp9eZi

STAT CARDS (4 cards, 25% width each):
1. Active Projects
   - Metric: COUNT(Projects WHERE Status = "Active")
   - Icon: folder
   - Color: blue

2. Tasks Due This Week
   - Metric: COUNT(Tasks WHERE Due Date <= TODAY+7)
   - Icon: checklist
   - Color: orange

3. Budget Used (%)
   - Metric: (SUM(Projects.spent) / SUM(Projects.Budget)) × 100
   - Icon: dollar
   - Color: green
   - Format: percentage

4. Team Workload
   - Metric: AVG(Team Members.Active Tasks)
   - Icon: people
   - Color: purple

SECTIONS:
- Active Projects Grid (6 columns: Project Name, Owner, Progress %, Due Date, Priority, Status)
  Filter: Status = "Active"
  Limit: 6 cards/rows
  Sort: Progress % DESC

- Budget Overview Charts (2-column layout):
  Left: Pie chart - Budget by Project (value: Budget, label: Project Name)
  Right: Bar chart - Spending Status (Allocated vs Spent by Project)

- Team Workload Bar Chart (Hours by Team Member, with 40h threshold line)

- Recent Files List (10 files, columns: Name, Uploader, Date, Folder)
  Sort: Upload Date DESC

---
PAGE 2: PROJECTS
Type: Table/Grid
Data Source: Projects table

COLUMNS:
- Project Name (25%, sortable, filterable)
- Status (12%, badge colors: Active=green, On Hold=orange, Completed=blue, Planning=gray)
- Owner (15%, link to Team Members)
- Progress % (12%, progress bar)
- Budget (12%, currency format $)
- Spent (12%, currency format $)
- Due Date (12%, date format, sortable)

FILTERS:
- Status (multi-select)
- Owner (multi-select)
- Priority (multi-select)
- Due Date (date range)

SORTING DEFAULT:
- Primary: Priority DESC
- Secondary: Progress % DESC

PAGINATION: 50 items per page

ROW ACTIONS:
- Click row → opens Project Detail page
- Inline edit button
- Delete button

CREATE BUTTON:
- "+ New Project" button opens form with fields:
  Project Name, Status, Type, Owner, Priority, Start Date, Due Date, Budget, Description, Tags

---
PAGE 3: PROJECT DETAIL
Type: Tabbed Interface
Data Source: Projects table (filtered by URL parameter)

TAB 1: OVERVIEW
Info Cards (3-column layout):
- Project Name (text)
- Status (badge)
- Owner (link)
- Start Date (date)
- Due Date (date)
- Priority (badge)
Description section (rich text field)

TAB 2: TASKS (HIERARCHICAL)
Hierarchy Tree view:
- Source: Tasks table filtered by Project = {current}
- Parent Field: Parent Task (for nesting)
- Columns: Task Name (40%), Status (badge 15%), Assignee (avatar 15%), Due Date (date 15%), Priority (badge 15%)
- Actions: expand, collapse, drag-reorder, edit, delete
- Expand by default: YES

TAB 3: TIMELINE/GANTT
Gantt Chart:
- Source: Tasks table filtered by Project = {current}
- Start Field: Start Date
- End Field: Due Date
- Title Field: Task Name
- Progress Field: Completion %
- Assignee Field: Assignee (show as avatar)
- Zoom level: Week view

TAB 4: TEAM
Grid:
- Source: Assignments table filtered by Task.Project = {current}
- Columns: Assignee (30%, link), Role on Task (25%), Allocation % (15%, percent), Status (15%, badge), Date Assigned (15%, date)

TAB 5: BUDGET
Stats cards (top):
- Budget Allocated: SUM(Budget.Allocated WHERE Project = {current}) [currency]
- Amount Spent: SUM(Budget.Spent WHERE Project = {current}) [currency]
- Remaining: SUM(Budget.Allocated) - SUM(Budget.Spent) [currency]
- Utilization %: (SUM(Budget.Spent) / SUM(Budget.Allocated)) × 100 [percent, warning if > 80%]

Charts (2-column):
- Left: Pie Chart - Spending by Category (value: Spent, label: Category)
- Right: Bar Chart - Allocated vs Spent by Category

Grid (bottom):
- Source: Budget table filtered by Project = {current}
- Columns: Category (20%), Allocated (20%, $), Spent (20%, $), Status (20%, badge), Due Date (20%, date)

TAB 6: FILES
Folder Tree:
- Source: Files table filtered by Project = {current}
- Group by: Folder
- Columns: File Name (35%), Type (12%, badge), Uploaded By (20%, avatar), Upload Date (15%, date), Size (8%)
- Actions: preview, download, delete, version history

---
PAGE 4: TASKS
Type: Multi-view (Kanban + Table + Calendar)

VIEW 1: KANBAN BOARD
- Source: Tasks table
- Status Field: Status
- Columns:
  * To Do (gray)
  * In Progress (blue)
  * In Review (orange)
  * Done (green)

Card Layout:
- Task Name (title)
- Assignee (avatar)
- Due Date (small text)
- Priority (badge, color: High=red, Medium=orange, Low=blue)
- Drag-drop enabled to change status

Filters (left sidebar):
- Project (multi-select)
- Assignee (multi-select)
- Priority (multi-select)
- Due Date (date range)

Actions:
- "+ New Task" button (creates task in "To Do" column)
- Edit card
- Delete card

VIEW 2: TABLE
- Columns: Task Name (25%), Project (15%), Status (12%, badge), Assignee (15%, avatar), Priority (10%, badge), Due Date (12%, date), Completion % (11%, progress)
- Sortable: All columns
- Filterable: Same filters as Kanban
- Inline edit: YES
- Delete: YES

VIEW 3: CALENDAR
- Date Field: Due Date
- Title Field: Task Name
- Color by Priority (High=red, Medium=orange, Low=blue)
- Click date to create new task
- Click task to open detail

---
PAGE 5: BUDGET & REPORTS
Type: Dashboard
Data Source: Budget + Projects tables

STAT CARDS (top, 4 cards 25% width):
1. Total Allocated: SUM(Budget.Allocated) [$]
2. Total Spent: SUM(Budget.Spent) [$]
3. Remaining: SUM(Budget.Allocated) - SUM(Budget.Spent) [$]
4. Utilization %: (SUM(Budget.Spent) / SUM(Budget.Allocated)) × 100 [%]

CHARTS SECTION (2-column layout):
Left: Pie Chart
- Title: Budget by Project
- Value: Budget (Projects table)
- Label: Project Name
- Click slice to filter

Right: Bar Chart
- Title: Spent vs Allocated by Project
- Categories: Project Name
- Series 1: Allocated (blue)
- Series 2: Spent (red)

SPENDING ANALYSIS (2-column layout):
Left: Pie Chart
- Title: Spending by Category
- Source: Budget table
- Value: Spent
- Label: Category

Right: Line Chart
- Title: Spending Over Time (monthly)
- Source: Time Tracking table
- X-axis: Month
- Y-axis: SUM(Cost)

GRID (bottom):
- Source: Budget table
- Columns: Project (20%, link), Category (15%), Allocated (15%, $), Spent (15%, $), Status (12%, badge), Due Date (12%, date), Vendor (11%)
- Filters: Project, Category, Status, Due Date
- Sort: Spent DESC
- Actions: edit, delete, export CSV

---
PAGE 6: FILE LIBRARY (COMPANY-WIDE)
Type: Folder Tree Navigator
Data Source: Folders + Files tables

STRUCTURE:
- Left Sidebar: Folder Tree (collapsible)
  Root: "Alex Aura"
  Parent-child relationships via Folders.Parent Folder field
  Unlimited nesting depth
  Icons for folder types
  Actions: expand, collapse, create subfolder, delete

- Breadcrumb: Shows current path (Alex Aura > 01 Projects > SyriaWay > Designs)
- Back Button: Navigate to parent folder

- Main Area: File Grid
  Columns: File Name (35%, sortable), Type (12%, badge/icon), Uploaded By (20%, avatar), Upload Date (15%, date, sortable), Size (8%)
  Filters: File Type, Uploader, Date Range
  Pagination: 50 per page
  
  Row Actions:
  - Preview (opens file)
  - Download (downloads file)
  - Delete (removes file)
  - Version History (shows versions)

- Top Toolbar:
  - "+ Upload File" button
  - "+ New Folder" button
  - Search by file name

ACCESS CONTROL:
- Folders with Access Level = "Managers Only" are hidden from Team Members
- Show access restriction badge on restricted folders
- Allow download only for accessible files

---
PAGE 7: TEAM & RESOURCES
Type: Dashboard
Data Source: Team Members + Time Tracking tables

GRID (top):
- Source: Team Members table
- Columns: Name (20%, avatar + text), Role (15%, badge), Department (15%), Email (20%), Availability Status (15%, badge: Available=green, Busy=orange, Away=gray), Active Tasks Count (15%, number)
- Filters: Role, Department, Availability Status
- Sort: Name ASC

WORKLOAD CHART (middle):
- Type: Bar Chart
- Title: Weekly Hours by Team Member
- X-axis: Team Member (Name)
- Y-axis: SUM(Hours Worked) from Time Tracking table
- Time period: Current week
- Threshold line at 40 hours (full-time) in RED
- Alert if any bar exceeds 40h

PERFORMANCE METRICS (3-column layout, bottom):
1. Bar Chart - Tasks Completed (This Month)
   - Data: COUNT(Tasks WHERE MONTH(Completed) = MONTH(TODAY))
   - Group by: Assignee
   - X: Team Member name
   - Y: Count

2. Bar Chart - On-Time Delivery %
   - Data: (COUNT(Tasks WHERE Completed Date <= Due Date) / COUNT(Tasks)) × 100
   - Group by: Assignee
   - Y-axis: Percentage
   - Target line: 90%

3. Bar Chart - Avg Completion Time (days)
   - Data: AVG(DATEDIF(Start Date, Completed Date))
   - Group by: Assignee
   - Y-axis: Days

ALERTS SECTION (bottom):
- Alert: IF Hours > 40 (weekly) THEN "⚠️ {Name} over-allocated this week"
- Alert: IF Active Tasks > 10 THEN "⚠️ {Name} has excessive task load"
- Alert: IF Availability Status = "Away" THEN "ℹ️ {Name} marked as away"

---
GLOBAL SETTINGS:

AIRTABLE CONNECTION:
- Base ID: appPkAZ0LWnLp9eZi
- All pages connect to this base
- Auto-sync enabled
- Real-time updates

COLOR SCHEME:
- Primary: Blue (#0066CC)
- Success: Green (#00AA44)
- Warning: Orange (#FF9900)
- Danger: Red (#FF3333)
- Neutral: Gray (#999999)

FONTS:
- Headings: Bold, 18-20px
- Body: Regular, 14px
- Labels: Bold, 12px

RESPONSIVE:
- Desktop: Full layout
- Tablet: 2-column where applicable
- Mobile: Single column, stacked

---
USER GROUPS & ACCESS CONTROL:

GROUP 1: MANAGER (ali@alexaura.com)
- Dashboard: View ✓, Edit ✓, Export ✓
- Projects: View ✓, Create ✓, Edit ✓, Delete ✓
- Tasks: View ✓, Create ✓, Edit ✓, Delete ✓
- Budget: View ✓, Edit ✓, Export ✓
- File Library: View ✓, Upload ✓, Delete ✓, Manage Access ✓
- Team: View ✓, Manage ✓

GROUP 2: TEAM MEMBER (alyssar@alexaura.com)
- Dashboard: View ✓, Edit ✗, Export ✗
- Projects: View ✓ (assigned only), Create ✗, Edit ✗, Delete ✗
- Tasks: View ✓ (assigned only), Create ✗, Edit ✓ (own status), Delete ✗
- Budget: View ✗, Edit ✗, Export ✗
- File Library: View ✓ (except Managers Only), Upload ✓ (own folder), Delete ✓ (own files)
- Team: View ✗, Manage ✗

GROUP 3: FREELANCER (for future)
- Dashboard: View ✗
- Projects: View ✗
- Tasks: View ✓ (assigned only), Edit ✓ (status), Create ✗, Delete ✗
- Budget: View ✗
- File Library: View ✓ (project files), Upload ✓, Delete ✗
- Team: View ✗

---
INSTRUCTIONS:
1. Create all 7 pages with exact specifications above
2. Connect all data sources to Airtable base appPkAZ0LWnLp9eZi
3. Configure all filters, sorts, and field mappings as specified
4. Set up user groups and access control rules
5. Configure colors, fonts, and responsive layout
6. Test all functionality before publishing
7. Publish app and share URLs with team

PAGES TO CREATE (IN ORDER):
1. Dashboard
2. Projects
3. Project Detail
4. Tasks
5. Budget & Reports
6. File Library
7. Team & Resources

GO BUILD! 🚀
```

---

## 💡 How to Use This Prompt

### In Softr.io AI Builder:
1. Open your Softr workspace
2. Look for "AI Builder" or "Build with AI" button
3. Paste the entire prompt above (starting from "BUILD A COMPLETE...")
4. Click "Build" or "Generate"
5. The AI will create all 7 pages automatically

### In ChatGPT/Claude:
1. Copy the prompt
2. Paste into ChatGPT or Claude conversation
3. Add: "I'm using Softr.io. Follow the specs exactly."
4. Get back step-by-step instructions or configurations

### In Gemini/Other AI:
1. Copy the prompt
2. Paste into your AI assistant
3. Ask: "Build this Softr app following these specs"

---

## ✨ What This Prompt Covers

✅ All 7 pages with exact specifications  
✅ All data sources and field mappings  
✅ All filters, sorts, and actions  
✅ All charts, cards, and layouts  
✅ Access control and user groups  
✅ Colors, fonts, and responsive design  
✅ Airtable base connection  

**Everything the AI builder needs to create your complete PFMS v2.0 app automatically!**

---

**Ready? Copy the prompt above and paste it into Softr's AI builder NOW! 🚀**
