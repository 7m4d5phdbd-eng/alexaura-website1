# PFMS v2.0 — دليل إعداد نظام إدارة المشاريع
**Project Foundation & Management System** — Airtable + Softr.io

نظام إدارة مشاريع داخلي قوي ومرن لـ Alex Aura. تم بناء قاعدة Airtable بالكامل آلياً.

---

## 1. قاعدة Airtable (جاهزة ✅)

- **اسم القاعدة:** PFMS — Project Management
- **Base ID:** `appPkAZ0LWnLp9eZi`
- **الرابط:** https://airtable.com/appPkAZ0LWnLp9eZi
- **Workspace:** MAIN

### الجداول (11 جدول)
| # | الجدول | الوصف |
|---|--------|-------|
| 1 | Team Members | الفريق (علي = Manager، اليسار = Team Member) |
| 2 | Projects | المشاريع |
| 3 | Tasks | المهام الهرمية (Parent Task self-link) |
| 4 | Assignments | إسناد المهام بأدوار مختلفة |
| 5 | Budget | الميزانية المالية |
| 6 | Time Tracking | تتبّع الوقت والتكلفة |
| 7 | Folders | شجرة المجلدات (Parent Folder self-link، تشعّب لا محدود) |
| 8 | Files | الملفات داخل المجلدات |
| 9 | Milestones | المراحل والتسليمات |
| 10 | Risks & Issues | المخاطر والمشاكل |
| 11 | Tags | التصنيفات المركزية |

### البيانات المُدخلة
- **الفريق:** علي جنيدي (Manager) + اليسار (Team Member)
- **المشاريع:** SyriaWay، Precious Metals، PFMS v2.0
- **المهام:** 4 مهام رئيسية لـ SyriaWay (3 لليسار، 1 لعلي) + مهمتان فرعيتان
- **شجرة المجلدات:** كاملة (4 مستويات) — انظر القسم 3
- **الميزانية:** 3 بنود لـ SyriaWay
- **ملفات + مرحلة + تسجيلات وقت** تجريبية

---

## 2. الحقول المحسوبة (rollup/lookup/formula) — جاهزة ومُتحقَّق منها ✅

كل الحقول المحسوبة أُنشئت وجرى التحقق منها بمشروع اختبار حقيقي (TEST — تم حذفه بعد التحقق):

| الجدول | الحقل | النوع | الإعداد | الحالة |
|--------|-------|-------|---------|:---:|
| Time Tracking | Hourly Rate | Lookup | من Team Member → Hourly Rate | ✅ |
| Time Tracking | Cost | Formula | `{Hours Worked} * VALUE(ARRAYJOIN({Hourly Rate}&""))` | ✅ |
| Projects | spent | Rollup | من Budget (Amount Spent) → SUM | ✅ |
| Projects | progress % | Rollup | من Tasks (Completion %) → AVERAGE | ✅ |
| Projects | Task Count | Rollup | من Tasks → COUNTA | ✅ |
| Projects | Remaining Budget | Formula | `{Budget} - {spent}` | ✅ |
| Tasks | Time Logged | Rollup | من Time Tracking (Hours Worked) → SUM | ✅ |

### نتائج التحقق (مشروع TEST: Budget=$1000, مهمتان 100%+50%, مصروف $400, 4 ساعات×$50)
| الحقل | المتوقع | الفعلي | ✓ |
|-------|---------|--------|---|
| spent | $400 | $400 | ✅ |
| progress % | 75% | 75% | ✅ |
| Task Count | 2 | 2 | ✅ |
| Remaining Budget | $600 | $600 | ✅ |
| Time Logged | 4h | 4h | ✅ |
| Cost (Time Tracking) | $200 | $200 | ✅ |

> **ملاحظة:** صيغة Remaining Budget كانت معطوبة (نص حرفي "Unable to generate formula") وتم إصلاحها لـ `{Budget} - {spent}`. صيغة Cost عُدّلت لتحويل الـ Lookup (مصفوفة) لرقم عبر `VALUE(ARRAYJOIN(...))`.

---

## 3. شجرة المجلدات (Directories) 🏢

```
🏢 Alex Aura (الجذر)
├── 01 — Projects
│    ├── SyriaWay → Contracts | Designs | Deliverables | Reports
│    ├── Precious Metals
│    └── PFMS
├── 02 — Clients
├── 03 — Finance (Managers Only) → Invoices | Payroll | Budgets | Taxes
├── 04 — Legal & Contracts (Managers Only) → Company Registration | NDAs & Agreements
├── 05 — HR / Team (Managers Only) → Employee Files (علي | اليسار) | Employment Contracts | Performance
├── 06 — Marketing & Branding → Logos & Brand Assets | Content
├── 07 — Operations & SOPs → Templates | Processes
├── 08 — Admin (Managers Only)
└── 09 — Archive
```

كل مجلد له **Access Level** (Everyone / Managers Only / Specific People). المجلدات المالية والموارد البشرية = Managers Only (اليسار ما تشوفها).

---

## 3.5 الـ MVP داخل Airtable (Interface جاهز ومنشور ✅)

تم بناء واجهة كاملة داخل Airtable نفسه كـ MVP سريع قبل الانتقال لـ Softr.io.

- **اسم الـ Interface:** PFMS — لوحة الإدارة
- **Interface ID:** `pbdeIbcj1aeDwAvMb`
- **الرابط:** https://airtable.com/appPkAZ0LWnLp9eZi/pbdeIbcj1aeDwAvMb

### الصفحات الـ5 (منشورة)
| # | الصفحة | النوع | المحتوى |
|---|--------|-------|---------|
| 1 | 📊 Dashboard | Dashboard | 4 أرقام (عدد المشاريع، الميزانية، المصروف، متوسط الإنجاز) + Donut (المشاريع حسب الحالة) + Bar (الميزانية حسب المشروع) |
| 2 | 📁 المشاريع | Grid | كل المشاريع + فلاتر (Status / Priority) + الحقول المحسوبة |
| 3 | ✅ المهام | Kanban | أعمدة حسب Status (To Do→Done) + سحب وإفلات + فلاتر (Assignee / Priority) |
| 4 | 💰 الميزانية | Dashboard | المخصص + المصروف + Donut (حسب الفئة) + Bar (حسب الحالة) |
| 5 | 🗂️ مكتبة الملفات | Grid | كل الملفات + فلاتر (File Type / Folder) |

> **كيف تستخدمه:** افتح الرابط أعلاه → التنقّل بين الصفحات من القائمة الجانبية. لمشاركته: زر **Share** أعلى يمين الـ Interface → أضف اليسار كـ collaborator (يشوف نفس الصفحات).

---

## 4. ربط Softr.io بـ Airtable (التوسّع لاحقاً)

1. سجّل دخول على [softr.io](https://www.softr.io) → أنشئ app جديد باسم "Alex Aura — PFMS"
2. **Data Sources → Add → Airtable → Connect** → فوّض Softr
3. اختر قاعدة **PFMS — Project Management** (`appPkAZ0LWnLp9eZi`)
4. Softr رح يكتشف كل الجداول والحقول تلقائياً
5. ابنِ الصفحات الـ7 (انظر الـ Prompt بالأسفل)
6. **User Groups:** Manager (علي) = كامل، Team Member (اليسار) = محدود
7. **Publish** → شارك الرابط مع اليسار

---

## 5. الصفحات (7 صفحات في Softr)

1. **Dashboard** — بطاقات إحصائية + شبكة مشاريع + workload + ميزانية + آخر ملفات
2. **Projects** — جدول/cards + فلاتر + تفاصيل
3. **Project Detail** — Tabs: Overview | Tasks | Timeline | Team | Budget | Milestones | Risks | Files
4. **Tasks** — Kanban (To Do→In Progress→In Review→Done) + سحب وإفلات
5. **Team & Resources** — قائمة الفريق + workload + الأداء
6. **File Library** — تصفّح شجرة المجلدات مثل Google Drive
7. **Budget & Reports** — إحصائيات + مخططات + تقارير

---

## 6. الصلاحيات

| الصلاحية | علي (Manager) | اليسار (Team Member) |
|---------|:---:|:---:|
| رؤية المشاريع | الكل | المشارِكة فيها |
| إنشاء/تعديل مشاريع | ✅ | ❌ |
| المهام | إنشاء/إسناد | تعديل حالة مهامها |
| الميزانية | ✅ | مخفي |
| الملفات | كامل | رفع/تصفّح (عدا Finance/HR) |

---

## 7. Softr.io Prompt (انسخه للـ AI Builder في Softr)

```
Build a powerful, scalable INTERNAL Project Management web app using Airtable
(base: PFMS — Project Management) as the data source. Design it to grow
(unlimited projects, team members, freelancers) without rebuilding.

TEAM: Ali Junaidi = Manager/Admin (full access); Alyssar = Team Member
(assigned tasks, own task status, file upload; budget hidden).

PAGES:
1. DASHBOARD — stat cards (Active Projects, Tasks Due This Week, My Tasks,
   Budget Status, Overdue) + project cards + team workload + budget pie +
   recent files + calendar.
2. PROJECTS — table+cards, filters (status/owner/priority/tags/date),
   "New Project", click→detail.
3. PROJECT DETAIL — tabs: Overview | Tasks(hierarchical) | Timeline/Gantt |
   Team | Budget | Milestones | Risks | Files(grouped by folder).
4. TASKS — Kanban (To Do→In Progress→In Review→Done) + Table + Calendar,
   drag to update status, cards show assignee/project/due/priority, filters,
   "New Task".
5. TEAM & RESOURCES — member list, workload bar chart, over-allocation alerts,
   performance metrics.
6. FILE LIBRARY (company-wide file tree like Google Drive) — navigate folder
   tree from root (Alex Aura) → sections → subfolders → files, breadcrumb +
   back, click folder to open, filters + search, "New Folder" + "Upload File",
   preview/download/versioning, restricted folders (Finance/HR) managers-only.
7. BUDGET & REPORTS — stats (Total/Spent/Remaining/Utilization%), pie+bar+line
   charts, expenses table, exportable reports.

PERMISSIONS (User Groups): Manager = full CRUD; Team Member = read assigned
projects, update own tasks, upload/view files, budget hidden;
Freelancer (future) = only assigned tasks/files.

STYLING: professional clean, status colors (Blue=In Progress, Yellow=Planning/
Review, Green=Active/Done, Red=Blocked/Overdue), responsive desktop+mobile,
RTL-friendly for Arabic.

FUNCTIONALITY: sortable/filterable everything, inline edit, date pickers,
multi-select assignees/tags, file upload to Airtable attachments, real-time
sync, role-based visibility.
```
