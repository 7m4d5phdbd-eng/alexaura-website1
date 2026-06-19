#!/usr/bin/env node

/**
 * PFMS v2.0 — Complete Automated Builder
 * Builds Softr pages and Zapier workflows from Airtable base
 *
 * Usage: node build-pfms-complete.js [--dry-run] [--phase 1-5]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  airtable: {
    baseId: 'appPkAZ0LWnLp9eZi',
    apiUrl: 'https://api.airtable.com/v0',
    tables: {
      TeamMembers: 'Team Members',
      Projects: 'Projects',
      Tasks: 'Tasks',
      Assignments: 'Assignments',
      Budget: 'Budget',
      TimeTracking: 'Time Tracking',
      Folders: 'Folders',
      Files: 'Files',
      Milestones: 'Milestones',
      RisksIssues: 'Risks & Issues',
      Tags: 'Tags'
    }
  },
  softr: {
    workspace: 'marlin390JNHBHBHJBJJM',
    apiUrl: 'https://api.softr.io/v1',
    pages: [
      { id: 'dashboard', name: 'Dashboard', type: 'custom' },
      { id: 'projects', name: 'Projects', type: 'table' },
      { id: 'project-detail', name: 'Project Detail', type: 'tabbed' },
      { id: 'tasks', name: 'Tasks', type: 'kanban' },
      { id: 'budget', name: 'Budget & Reports', type: 'dashboard' },
      { id: 'files', name: 'File Library', type: 'folder-tree' },
      { id: 'team', name: 'Team & Resources', type: 'dashboard' }
    ]
  },
  zapier: {
    apiUrl: 'https://zapier.com/api/v1',
    workflows: [
      { id: 1, name: 'Airtable Projects → Softr Dashboard' },
      { id: 2, name: 'Airtable Projects → Softr Projects Grid' },
      { id: 3, name: 'Airtable Tasks → Softr Kanban' },
      { id: 4, name: 'Airtable Budget → Softr Stats' },
      { id: 5, name: 'Airtable Files → Softr Library' },
      { id: 6, name: 'Task Assignment → Notification' },
      { id: 7, name: 'Budget Alert (80% threshold)' }
    ]
  }
};

// ============================================================================
// SOFTR PAGE GENERATORS
// ============================================================================

class SoftrPageBuilder {
  constructor(workspace) {
    this.workspace = workspace;
    this.pages = [];
  }

  // Dashboard Page
  buildDashboard() {
    return {
      id: 'dashboard',
      name: 'Dashboard',
      type: 'custom',
      description: 'Project overview with key metrics, active projects, budget status',
      sections: [
        {
          type: 'stats',
          title: 'Key Metrics',
          columns: 4,
          widgets: [
            {
              type: 'stat_card',
              title: 'Active Projects',
              metric: 'COUNT(Projects WHERE Status = "Active")',
              icon: 'folder',
              color: 'blue'
            },
            {
              type: 'stat_card',
              title: 'Tasks Due This Week',
              metric: 'COUNT(Tasks WHERE Due Date <= TODAY+7)',
              icon: 'checklist',
              color: 'orange'
            },
            {
              type: 'stat_card',
              title: 'Budget Used',
              metric: 'SUM(Projects.spent) / SUM(Projects.Budget)',
              format: 'percent',
              icon: 'dollar',
              color: 'green'
            },
            {
              type: 'stat_card',
              title: 'Team Workload',
              metric: 'AVG(Team Members.Active Tasks)',
              icon: 'people',
              color: 'purple'
            }
          ]
        },
        {
          type: 'section',
          title: 'Active Projects',
          layout: 'grid',
          widget: {
            type: 'grid',
            source: 'Projects',
            filter: 'Status = "Active"',
            limit: 6,
            columns: ['Project Name', 'Owner', 'Progress %', 'Due Date', 'Priority'],
            sort: 'Progress % DESC',
            actions: ['view-detail', 'edit', 'delete']
          }
        },
        {
          type: 'section',
          title: 'Budget Overview',
          layout: '2-column',
          widgets: [
            {
              type: 'chart_pie',
              title: 'Budget by Project',
              data: 'Projects',
              value: 'Budget',
              label: 'Project Name'
            },
            {
              type: 'chart_bar',
              title: 'Spending Status',
              data: 'Projects',
              categories: 'Project Name',
              series: [
                { name: 'Allocated', value: 'Budget' },
                { name: 'Spent', value: 'spent' }
              ]
            }
          ]
        },
        {
          type: 'section',
          title: 'Team Workload',
          widget: {
            type: 'chart_bar',
            data: 'Team Members',
            categories: 'Name',
            value: 'Active Tasks Count',
            threshold: 40,
            thresholdLabel: 'Overallocation Alert'
          }
        },
        {
          type: 'section',
          title: 'Recent Files',
          widget: {
            type: 'list',
            source: 'Files',
            limit: 10,
            columns: ['File Name', 'Uploaded By', 'Upload Date', 'Folder'],
            sort: 'Upload Date DESC',
            actions: ['download', 'preview', 'delete']
          }
        },
        {
          type: 'section',
          title: 'Upcoming Milestones',
          widget: {
            type: 'calendar',
            source: 'Milestones',
            dateField: 'Target Date',
            titleField: 'Milestone Name',
            colorField: 'Status'
          }
        }
      ]
    };
  }

  // Projects Page
  buildProjects() {
    return {
      id: 'projects',
      name: 'Projects',
      type: 'table',
      description: 'All projects with status, owner, budget, progress tracking',
      sections: [
        {
          type: 'grid',
          title: 'All Projects',
          source: 'Projects',
          columns: [
            { field: 'Project Name', width: '25%', sortable: true, filterable: true },
            { field: 'Status', width: '12%', type: 'badge', colors: { 'Active': 'green', 'On Hold': 'orange', 'Completed': 'blue', 'Planning': 'gray' } },
            { field: 'Owner', width: '15%', type: 'link-field', target: 'Team Members' },
            { field: 'Progress %', width: '12%', type: 'progress-bar' },
            { field: 'Budget', width: '12%', type: 'currency', format: '$' },
            { field: 'spent', width: '12%', type: 'currency', format: '$' },
            { field: 'Due Date', width: '12%', type: 'date', sortable: true }
          ],
          filters: [
            { field: 'Status', type: 'select', multiple: true },
            { field: 'Owner', type: 'select', multiple: true },
            { field: 'Priority', type: 'select', multiple: true },
            { field: 'Due Date', type: 'date-range' }
          ],
          sort: [
            { field: 'Priority', direction: 'desc' },
            { field: 'Progress %', direction: 'desc' }
          ],
          pagination: { pageSize: 50, type: 'numbered' },
          actions: {
            inline: ['edit', 'delete'],
            row: ['view-detail'],
            toolbar: ['create', 'export']
          },
          createForm: {
            fields: [
              'Project Name', 'Status', 'Type', 'Owner', 'Priority',
              'Start Date', 'Due Date', 'Budget', 'Description', 'Tags'
            ]
          }
        }
      ]
    };
  }

  // Project Detail Page
  buildProjectDetail() {
    return {
      id: 'project-detail',
      name: 'Project Detail',
      type: 'tabbed',
      description: 'Detailed project view with Overview, Tasks, Timeline, Team, Budget, Files',
      tabs: [
        {
          id: 'overview',
          name: 'Overview',
          type: 'info',
          sections: [
            {
              type: 'cards',
              layout: '3-column',
              fields: [
                { label: 'Project Name', field: 'Project Name', type: 'text' },
                { label: 'Status', field: 'Status', type: 'badge' },
                { label: 'Owner', field: 'Owner', type: 'link' },
                { label: 'Start Date', field: 'Start Date', type: 'date' },
                { label: 'Due Date', field: 'Due Date', type: 'date' },
                { label: 'Priority', field: 'Priority', type: 'badge' }
              ]
            },
            {
              type: 'rich-text',
              field: 'Description',
              label: 'Project Description'
            },
            {
              type: 'team-members',
              label: 'Team Members',
              source: 'Assignments',
              filter: 'Task.Project = {current}',
              columns: ['Assignee', 'Role on Task', 'Allocation %']
            }
          ]
        },
        {
          id: 'tasks',
          name: 'Tasks (Hierarchical)',
          type: 'tree',
          sections: [
            {
              type: 'hierarchy-tree',
              source: 'Tasks',
              filter: 'Project = {current}',
              parentField: 'Parent Task',
              columns: [
                { field: 'Task Name', width: '40%' },
                { field: 'Status', width: '15%', type: 'badge' },
                { field: 'Assignee', width: '15%', type: 'avatar' },
                { field: 'Due Date', width: '15%', type: 'date' },
                { field: 'Priority', width: '15%', type: 'badge' }
              ],
              actions: ['expand', 'edit', 'delete', 'drag-reorder'],
              expandByDefault: true
            }
          ]
        },
        {
          id: 'timeline',
          name: 'Timeline/Gantt',
          type: 'gantt',
          sections: [
            {
              type: 'gantt-chart',
              source: 'Tasks',
              filter: 'Project = {current}',
              startDateField: 'Start Date',
              endDateField: 'Due Date',
              titleField: 'Task Name',
              assigneeField: 'Assignee',
              progressField: 'Completion %',
              dependencyField: 'Dependencies',
              zoom: 'week'
            }
          ]
        },
        {
          id: 'team',
          name: 'Team',
          type: 'grid',
          sections: [
            {
              type: 'grid',
              source: 'Assignments',
              filter: 'Task.Project = {current}',
              columns: [
                { field: 'Assignee', width: '30%', type: 'link' },
                { field: 'Role on Task', width: '25%' },
                { field: 'Allocation %', width: '15%', type: 'percent' },
                { field: 'Status', width: '15%', type: 'badge' },
                { field: 'Date Assigned', width: '15%', type: 'date' }
              ]
            }
          ]
        },
        {
          id: 'budget',
          name: 'Budget',
          type: 'dashboard',
          sections: [
            {
              type: 'stats',
              columns: 4,
              widgets: [
                {
                  type: 'stat_card',
                  title: 'Budget Allocated',
                  metric: 'SUM(Budget.Allocated WHERE Project = {current})',
                  format: 'currency'
                },
                {
                  type: 'stat_card',
                  title: 'Amount Spent',
                  metric: 'SUM(Budget.Spent WHERE Project = {current})',
                  format: 'currency'
                },
                {
                  type: 'stat_card',
                  title: 'Remaining',
                  metric: 'SUM(Budget.Allocated) - SUM(Budget.Spent)',
                  format: 'currency'
                },
                {
                  type: 'stat_card',
                  title: 'Utilization %',
                  metric: '(SUM(Budget.Spent) / SUM(Budget.Allocated)) * 100',
                  format: 'percent',
                  warning: { threshold: 80, message: 'Budget 80% spent' }
                }
              ]
            },
            {
              type: 'section',
              title: 'Budget Breakdown',
              layout: '2-column',
              widgets: [
                {
                  type: 'chart_pie',
                  title: 'Spending by Category',
                  source: 'Budget',
                  filter: 'Project = {current}',
                  value: 'Spent',
                  label: 'Category'
                },
                {
                  type: 'chart_bar',
                  title: 'Allocated vs Spent',
                  source: 'Budget',
                  filter: 'Project = {current}',
                  categories: 'Category',
                  series: [
                    { name: 'Allocated', value: 'Allocated' },
                    { name: 'Spent', value: 'Spent' }
                  ]
                }
              ]
            },
            {
              type: 'grid',
              title: 'Budget Details',
              source: 'Budget',
              filter: 'Project = {current}',
              columns: [
                { field: 'Category', width: '20%' },
                { field: 'Allocated', width: '20%', type: 'currency' },
                { field: 'Spent', width: '20%', type: 'currency' },
                { field: 'Status', width: '20%', type: 'badge' },
                { field: 'Due Date', width: '20%', type: 'date' }
              ]
            }
          ]
        },
        {
          id: 'files',
          name: 'Files',
          type: 'files',
          sections: [
            {
              type: 'folder-tree',
              source: 'Files',
              filter: 'Project = {current}',
              groupByFolder: true,
              columns: ['File Name', 'Type', 'Uploaded By', 'Upload Date', 'Size'],
              actions: ['preview', 'download', 'delete', 'version-history']
            }
          ]
        }
      ]
    };
  }

  // Tasks Page (Kanban)
  buildTasks() {
    return {
      id: 'tasks',
      name: 'Tasks',
      type: 'kanban',
      description: 'Task management with Kanban board, table, and calendar views',
      views: [
        {
          id: 'kanban',
          name: 'Kanban Board',
          type: 'kanban',
          sections: [
            {
              type: 'kanban-board',
              source: 'Tasks',
              statusField: 'Status',
              columns: [
                { id: 'to-do', label: 'To Do', statusValue: 'To Do', color: 'gray' },
                { id: 'in-progress', label: 'In Progress', statusValue: 'In Progress', color: 'blue' },
                { id: 'in-review', label: 'In Review', statusValue: 'In Review', color: 'orange' },
                { id: 'done', label: 'Done', statusValue: 'Done', color: 'green' }
              ],
              cardFields: ['Task Name', 'Assignee', 'Due Date', 'Priority'],
              filters: [
                { field: 'Project', type: 'select', multiple: true },
                { field: 'Assignee', type: 'select', multiple: true },
                { field: 'Priority', type: 'select', multiple: true },
                { field: 'Due Date', type: 'date-range' }
              ],
              dragDrop: true,
              actions: ['edit', 'delete', 'add-subtask'],
              createAction: true
            }
          ]
        },
        {
          id: 'table',
          name: 'Table View',
          type: 'grid',
          sections: [
            {
              type: 'grid',
              source: 'Tasks',
              columns: [
                { field: 'Task Name', width: '25%', sortable: true },
                { field: 'Project', width: '15%', sortable: true },
                { field: 'Status', width: '12%', type: 'badge' },
                { field: 'Assignee', width: '15%', type: 'avatar' },
                { field: 'Priority', width: '10%', type: 'badge' },
                { field: 'Due Date', width: '12%', type: 'date', sortable: true },
                { field: 'Completion %', width: '11%', type: 'progress' }
              ],
              filters: [
                { field: 'Project', type: 'select', multiple: true },
                { field: 'Assignee', type: 'select', multiple: true },
                { field: 'Status', type: 'select', multiple: true },
                { field: 'Priority', type: 'select', multiple: true },
                { field: 'Due Date', type: 'date-range' }
              ],
              sort: [
                { field: 'Priority', direction: 'desc' },
                { field: 'Due Date', direction: 'asc' }
              ],
              actions: ['edit', 'delete', 'duplicate']
            }
          ]
        },
        {
          id: 'calendar',
          name: 'Calendar View',
          type: 'calendar',
          sections: [
            {
              type: 'calendar',
              source: 'Tasks',
              dateField: 'Due Date',
              titleField: 'Task Name',
              colorField: 'Priority',
              colorMapping: { 'High': 'red', 'Medium': 'orange', 'Low': 'blue' }
            }
          ]
        }
      ]
    };
  }

  // Budget & Reports Page
  buildBudget() {
    return {
      id: 'budget',
      name: 'Budget & Reports',
      type: 'dashboard',
      description: 'Budget overview, spending by project/category, utilization reports',
      sections: [
        {
          type: 'stats',
          columns: 4,
          widgets: [
            {
              type: 'stat_card',
              title: 'Total Allocated',
              metric: 'SUM(Budget.Allocated)',
              format: 'currency',
              icon: 'dollar',
              color: 'blue'
            },
            {
              type: 'stat_card',
              title: 'Total Spent',
              metric: 'SUM(Budget.Spent)',
              format: 'currency',
              icon: 'trending-down',
              color: 'orange'
            },
            {
              type: 'stat_card',
              title: 'Remaining',
              metric: 'SUM(Budget.Allocated) - SUM(Budget.Spent)',
              format: 'currency',
              icon: 'wallet',
              color: 'green'
            },
            {
              type: 'stat_card',
              title: 'Utilization %',
              metric: '(SUM(Budget.Spent) / SUM(Budget.Allocated)) * 100',
              format: 'percent',
              icon: 'percent',
              color: 'purple',
              warning: { threshold: 80 }
            }
          ]
        },
        {
          type: 'section',
          title: 'Spending Analysis',
          layout: '2-column',
          widgets: [
            {
              type: 'chart_pie',
              title: 'Budget by Project',
              source: 'Projects',
              value: 'Budget',
              label: 'Project Name'
            },
            {
              type: 'chart_bar',
              title: 'Spent vs Allocated by Project',
              source: 'Projects',
              categories: 'Project Name',
              series: [
                { name: 'Allocated', value: 'Budget' },
                { name: 'Spent', value: 'spent' }
              ]
            }
          ]
        },
        {
          type: 'section',
          title: 'Spending by Category',
          layout: '2-column',
          widgets: [
            {
              type: 'chart_pie',
              title: 'Category Breakdown',
              source: 'Budget',
              value: 'Spent',
              label: 'Category'
            },
            {
              type: 'chart_line',
              title: 'Spending Over Time',
              source: 'Time Tracking',
              dateField: 'Date',
              groupBy: 'month',
              value: 'Cost'
            }
          ]
        },
        {
          type: 'section',
          title: 'Budget Details',
          widget: {
            type: 'grid',
            source: 'Budget',
            columns: [
              { field: 'Project', width: '20%', type: 'link' },
              { field: 'Category', width: '15%' },
              { field: 'Allocated', width: '15%', type: 'currency' },
              { field: 'Spent', width: '15%', type: 'currency' },
              { field: 'Status', width: '12%', type: 'badge' },
              { field: 'Due Date', width: '12%', type: 'date' },
              { field: 'Vendor', width: '11%' }
            ],
            filters: [
              { field: 'Project', type: 'select', multiple: true },
              { field: 'Category', type: 'select', multiple: true },
              { field: 'Status', type: 'select', multiple: true },
              { field: 'Due Date', type: 'date-range' }
            ],
            sort: [{ field: 'Spent', direction: 'desc' }],
            actions: ['edit', 'delete', 'export']
          }
        }
      ]
    };
  }

  // File Library Page
  buildFileLibrary() {
    return {
      id: 'files',
      name: 'File Library',
      type: 'folder-tree',
      description: 'Company-wide file management with unlimited folder nesting',
      sections: [
        {
          type: 'folder-tree-navigator',
          source: 'Folders',
          filesSource: 'Files',
          parentField: 'Parent Folder',
          rootFolder: 'Alex Aura',
          breadcrumb: true,
          backButton: true,
          layout: 'sidebar-main',
          leftPanel: {
            type: 'folder-tree',
            columns: ['Folder Name', 'Icon/Color'],
            expandByDefault: 1,
            actions: ['expand', 'collapse', 'create-subfolder', 'delete-folder']
          },
          mainPanel: {
            type: 'grid',
            title: 'Folder Contents',
            columns: [
              { field: 'File Name', width: '35%', sortable: true },
              { field: 'Type', width: '12%', type: 'badge', icon: true },
              { field: 'Uploaded By', width: '20%', type: 'avatar' },
              { field: 'Upload Date', width: '15%', type: 'date', sortable: true },
              { field: 'Size', width: '10%', type: 'size' }
            ],
            filters: [
              { field: 'Type', type: 'select', multiple: true },
              { field: 'Uploaded By', type: 'select', multiple: true },
              { field: 'Upload Date', type: 'date-range' }
            ],
            pagination: { pageSize: 50 },
            actions: {
              inline: ['preview', 'download', 'delete'],
              row: ['version-history', 'permissions'],
              toolbar: ['upload', 'new-folder']
            }
          },
          accessControl: {
            field: 'Access Level',
            hideRestrictedFolders: true,
            showRestrictedTo: ['Manager', 'Owner']
          }
        }
      ]
    };
  }

  // Team & Resources Page
  buildTeam() {
    return {
      id: 'team',
      name: 'Team & Resources',
      type: 'dashboard',
      description: 'Team member profiles, workload tracking, performance metrics',
      sections: [
        {
          type: 'grid',
          title: 'Team Members',
          source: 'Team Members',
          columns: [
            { field: 'Name', width: '20%', type: 'avatar-name' },
            { field: 'Role', width: '15%', type: 'badge' },
            { field: 'Department', width: '15%' },
            { field: 'Email', width: '20%', type: 'email' },
            { field: 'Availability Status', width: '15%', type: 'badge', colors: { 'Available': 'green', 'Busy': 'orange', 'Away': 'gray' } },
            { field: 'Active Tasks Count', width: '15%', type: 'number' }
          ],
          filters: [
            { field: 'Role', type: 'select', multiple: true },
            { field: 'Department', type: 'select', multiple: true },
            { field: 'Availability Status', type: 'select', multiple: true }
          ],
          sort: [{ field: 'Name', direction: 'asc' }]
        },
        {
          type: 'section',
          title: 'Workload Analysis',
          layout: 'full-width',
          widget: {
            type: 'chart_bar',
            title: 'Weekly Hours by Team Member',
            source: 'Time Tracking',
            groupBy: ['Team Member', 'week'],
            aggregate: 'SUM(Hours Worked)',
            threshold: { value: 40, label: 'Full-time (40h)', color: 'red', condition: '>' }
          }
        },
        {
          type: 'section',
          title: 'Performance Metrics',
          layout: '3-column',
          widgets: [
            {
              type: 'chart_bar',
              title: 'Tasks Completed (This Month)',
              source: 'Tasks',
              filter: 'MONTH(Completed Date) = MONTH(TODAY)',
              groupBy: 'Assignee',
              aggregate: 'COUNT(*)'
            },
            {
              type: 'chart_bar',
              title: 'On-Time Delivery %',
              source: 'Tasks',
              filter: 'Status = "Done"',
              calculate: '(COUNT(Due Date >= Completed Date) / COUNT(*)) * 100',
              groupBy: 'Assignee',
              format: 'percent'
            },
            {
              type: 'chart_bar',
              title: 'Avg Completion Time (days)',
              source: 'Tasks',
              filter: 'Status = "Done"',
              calculate: 'AVG(DATEDIF(Start Date, Completed Date))',
              groupBy: 'Assignee',
              format: 'number'
            }
          ]
        },
        {
          type: 'alerts',
          title: 'Workload Alerts',
          alertRules: [
            {
              condition: 'Hours Worked > 40 (weekly)',
              message: 'Team member over-allocated this week',
              severity: 'warning'
            },
            {
              condition: 'Active Tasks > 10',
              message: 'Team member has excessive task load',
              severity: 'warning'
            },
            {
              condition: 'Availability Status = "Away"',
              message: 'Team member marked as away',
              severity: 'info'
            }
          ]
        }
      ]
    };
  }

  generateAllPages() {
    return [
      this.buildDashboard(),
      this.buildProjects(),
      this.buildProjectDetail(),
      this.buildTasks(),
      this.buildBudget(),
      this.buildFileLibrary(),
      this.buildTeam()
    ];
  }
}

// ============================================================================
// ZAPIER WORKFLOW GENERATORS
// ============================================================================

class ZapierWorkflowBuilder {
  constructor() {
    this.workflows = [];
  }

  buildZap1() {
    return {
      id: 1,
      name: 'Airtable Projects → Softr Dashboard',
      description: 'Sync new/updated projects to Softr Dashboard',
      trigger: {
        app: 'airtable',
        event: 'new_or_updated_record',
        data: {
          baseId: CONFIG.airtable.baseId,
          table: CONFIG.airtable.tables.Projects
        }
      },
      actions: [
        {
          app: 'softr',
          event: 'update_dashboard_cards',
          data: {
            workspace: CONFIG.softr.workspace,
            page: 'Dashboard',
            mapping: {
              projectName: '{{trigger.fields["Project Name"]}}',
              status: '{{trigger.fields["Status"]}}',
              owner: '{{trigger.fields["Owner"]}}',
              budget: '{{trigger.fields["Budget"]}}',
              spent: '{{trigger.fields["spent"]}}',
              progress: '{{trigger.fields["Progress %"]}}',
              priority: '{{trigger.fields["Priority"]}}'
            }
          }
        }
      ]
    };
  }

  buildZap2() {
    return {
      id: 2,
      name: 'Airtable Projects → Softr Projects Grid',
      description: 'Sync project updates to Projects page grid',
      trigger: {
        app: 'airtable',
        event: 'new_or_updated_record',
        data: {
          baseId: CONFIG.airtable.baseId,
          table: CONFIG.airtable.tables.Projects
        }
      },
      actions: [
        {
          app: 'softr',
          event: 'update_grid_record',
          data: {
            workspace: CONFIG.softr.workspace,
            page: 'Projects',
            mapping: {
              'Project Name': '{{trigger.fields["Project Name"]}}',
              'Status': '{{trigger.fields["Status"]}}',
              'Owner': '{{trigger.fields["Owner"]}}',
              'Progress %': '{{trigger.fields["Progress %"]}}',
              'Budget': '{{trigger.fields["Budget"]}}',
              'Spent': '{{trigger.fields["spent"]}}',
              'Due Date': '{{trigger.fields["Due Date"]}}',
              'Priority': '{{trigger.fields["Priority"]}}'
            }
          }
        }
      ]
    };
  }

  buildZap3() {
    return {
      id: 3,
      name: 'Airtable Tasks → Softr Kanban',
      description: 'Sync task updates to Softr Kanban board',
      trigger: {
        app: 'airtable',
        event: 'new_or_updated_record',
        data: {
          baseId: CONFIG.airtable.baseId,
          table: CONFIG.airtable.tables.Tasks
        }
      },
      actions: [
        {
          app: 'softr',
          event: 'update_kanban_card',
          data: {
            workspace: CONFIG.softr.workspace,
            page: 'Tasks',
            mapping: {
              title: '{{trigger.fields["Task Name"]}}',
              status: '{{trigger.fields["Status"]}}',
              column: '{{trigger.fields["Status"]}}',
              assignee: '{{trigger.fields["Assignee"]}}',
              dueDate: '{{trigger.fields["Due Date"]}}',
              priority: '{{trigger.fields["Priority"]}}',
              color: '{% if trigger.fields["Priority"] == "High" %}red{% elsif trigger.fields["Priority"] == "Medium" %}orange{% else %}blue{% endif %}'
            }
          }
        }
      ]
    };
  }

  buildZap4() {
    return {
      id: 4,
      name: 'Airtable Budget → Softr Stats',
      description: 'Sync budget updates to Softr Budget page statistics',
      trigger: {
        app: 'airtable',
        event: 'new_or_updated_record',
        data: {
          baseId: CONFIG.airtable.baseId,
          table: CONFIG.airtable.tables.Budget
        }
      },
      actions: [
        {
          app: 'softr',
          event: 'update_statistics',
          data: {
            workspace: CONFIG.softr.workspace,
            page: 'Budget',
            metrics: {
              totalAllocated: 'SUM(Budget.Allocated)',
              totalSpent: 'SUM(Budget.Spent)',
              remaining: 'SUM(Budget.Allocated) - SUM(Budget.Spent)',
              utilization: '(SUM(Budget.Spent) / SUM(Budget.Allocated)) * 100'
            }
          }
        }
      ]
    };
  }

  buildZap5() {
    return {
      id: 5,
      name: 'Airtable Files → Softr File Library',
      description: 'Sync new files to Softr File Library',
      trigger: {
        app: 'airtable',
        event: 'new_record',
        data: {
          baseId: CONFIG.airtable.baseId,
          table: CONFIG.airtable.tables.Files
        }
      },
      actions: [
        {
          app: 'softr',
          event: 'add_file_to_library',
          data: {
            workspace: CONFIG.softr.workspace,
            page: 'File Library',
            mapping: {
              fileName: '{{trigger.fields["File Name"]}}',
              folderPath: '{{trigger.fields["Folder"]}}',
              fileType: '{{trigger.fields["Type"]}}',
              uploadedBy: '{{trigger.fields["Uploaded By"]}}',
              uploadDate: '{{trigger.fields["Upload Date"]}}',
              fileUrl: '{{trigger.fields["File"]}}'
            }
          }
        }
      ]
    };
  }

  buildZap6() {
    return {
      id: 6,
      name: 'Task Assigned → Send Notification',
      description: 'Send email/Slack when task is assigned to team member',
      trigger: {
        app: 'airtable',
        event: 'new_record',
        data: {
          baseId: CONFIG.airtable.baseId,
          table: CONFIG.airtable.tables.Assignments
        }
      },
      actions: [
        {
          app: 'email',
          event: 'send_email',
          data: {
            to: '{{trigger.fields["Assignee.Email"]}}',
            subject: 'New Task Assigned: {{trigger.fields["Task.Task Name"]}}',
            body: '              <p>Hi {{trigger.fields["Assignee.Name"]}},</p>              <p>You have been assigned a new task:</p>              <ul>                <li><strong>Task:</strong> {{trigger.fields["Task.Task Name"]}}</li>                <li><strong>Project:</strong> {{trigger.fields["Task.Project.Project Name"]}}</li>                <li><strong>Due Date:</strong> {{trigger.fields["Task.Due Date"]}}</li>                <li><strong>Priority:</strong> {{trigger.fields["Task.Priority"]}}</li>              </ul>              <p>Role: {{trigger.fields["Role on Task"]}}</p>              <p>Allocation: {{trigger.fields["Allocation %"]}}%</p>'
          }
        },
        {
          app: 'slack',
          event: 'send_message',
          condition: 'if Slack webhook available',
          data: {
            channel: '#assignments',
            message: ':clipboard: Task Assigned: {{trigger.fields["Task.Task Name"]}} assigned to {{trigger.fields["Assignee.Name"]}} ({{trigger.fields["Allocation %"]}}% allocation) - Due: {{trigger.fields["Task.Due Date"]}}'
          }
        }
      ]
    };
  }

  buildZap7() {
    return {
      id: 7,
      name: 'Budget Alert: Over 80%',
      description: 'Alert project owner when project budget exceeded 80%',
      trigger: {
        app: 'airtable',
        event: 'new_or_updated_record',
        data: {
          baseId: CONFIG.airtable.baseId,
          table: CONFIG.airtable.tables.Projects
        }
      },
      condition: {
        type: 'threshold',
        calculation: '{{trigger.fields["spent"]}} > ({{trigger.fields["Budget"]}} * 0.8)',
        description: 'Only when spent > 80% of budget'
      },
      actions: [
        {
          app: 'email',
          event: 'send_email',
          data: {
            to: '{{trigger.fields["Owner.Email"]}}',
            subject: '⚠️ Budget Alert: {{trigger.fields["Project Name"]}} is {{calculatePercent trigger.fields["spent"] trigger.fields["Budget"]}}% spent',
            body: '              <h2>Budget Alert</h2>              <p><strong>Project:</strong> {{trigger.fields["Project Name"]}}</p>              <p><strong>Budget Allocated:</strong> ${{trigger.fields["Budget"]}}</p>              <p><strong>Amount Spent:</strong> ${{trigger.fields["spent"]}}</p>              <p><strong>Percentage Used:</strong> {{calculatePercent trigger.fields["spent"] trigger.fields["Budget"]}}%</p>              <p><strong>Remaining:</strong> ${{subtractValues trigger.fields["Budget"] trigger.fields["spent"]}}</p>              <p style="color: red;"><strong>Please review spending and adjust if needed.</strong></p>'
          }
        }
      ]
    };
  }

  generateAllWorkflows() {
    return [
      this.buildZap1(),
      this.buildZap2(),
      this.buildZap3(),
      this.buildZap4(),
      this.buildZap5(),
      this.buildZap6(),
      this.buildZap7()
    ];
  }
}

// ============================================================================
// ACCESS CONTROL BUILDER
// ============================================================================

class AccessControlBuilder {
  generateUserGroups() {
    return {
      Manager: {
        name: 'Manager',
        description: 'Full administrative access',
        members: ['ali@alexaura.com'],
        permissions: {
          dashboard: { view: true, edit: true, export: true },
          projects: { view: true, create: true, edit: true, delete: true },
          tasks: { view: true, create: true, edit: true, delete: true },
          budget: { view: true, edit: true, export: true },
          files: { view: true, upload: true, delete: true, manageAccess: true },
          team: { view: true, manage: true }
        },
        dataFilters: null
      },
      TeamMember: {
        name: 'Team Member',
        description: 'Limited access to assigned work',
        members: ['alyssar@alexaura.com'],
        permissions: {
          dashboard: { view: true, edit: false, export: false },
          projects: { view: true, create: false, edit: false, delete: false },
          tasks: { view: true, create: false, edit: 'own_only', delete: false },
          budget: { view: false, edit: false, export: false },
          files: { view: true, upload: 'own_folder', delete: 'own_files', manageAccess: false },
          team: { view: false, manage: false }
        },
        dataFilters: {
          projects: 'Owner = current_user OR assigned_member = current_user',
          tasks: 'Assignee = current_user',
          files: 'Access Level != "Managers Only"'
        }
      },
      Freelancer: {
        name: 'Freelancer',
        description: 'Limited to assigned tasks and files',
        members: [],
        permissions: {
          dashboard: { view: false },
          projects: { view: false },
          tasks: { view: 'assigned_only', create: false, edit: 'own_status', delete: false },
          budget: { view: false },
          files: { view: 'project_files', upload: true, delete: false },
          team: { view: false }
        },
        dataFilters: {
          tasks: 'Assignee = current_user'
        }
      }
    };
  }
}

// ============================================================================
// MAIN BUILDER ORCHESTRATOR
// ============================================================================

class PFMSBuilder {
  constructor() {
    this.softrPages = [];
    this.zapierWorkflows = [];
    this.accessControl = {};
  }

  async build(options = {}) {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║   PFMS v2.0 — Complete Automated Builder                      ║');
    console.log('║   Building Softr Pages + Zapier Workflows                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const dryRun = options.dryRun || false;

    // Step 1: Build Softr Pages
    console.log('📄 Building Softr Pages...');
    const softrBuilder = new SoftrPageBuilder(CONFIG.softr.workspace);
    this.softrPages = softrBuilder.generateAllPages();
    console.log(`   ✓ Created ${this.softrPages.length} Softr pages`);

    // Step 2: Build Zapier Workflows
    console.log('\n⚙️  Building Zapier Workflows...');
    const zapierBuilder = new ZapierWorkflowBuilder();
    this.zapierWorkflows = zapierBuilder.generateAllWorkflows();
    console.log(`   ✓ Created ${this.zapierWorkflows.length} Zapier workflows`);

    // Step 3: Generate Access Control
    console.log('\n🔐 Generating Access Control...');
    const acBuilder = new AccessControlBuilder();
    this.accessControl = acBuilder.generateUserGroups();
    console.log(`   ✓ Created ${Object.keys(this.accessControl).length} user groups`);

    // Step 4: Output Configurations
    if (!dryRun) {
      console.log('\n📝 Exporting Configurations...');
      this.exportConfigurations();
    }

    // Step 5: Summary
    this.printSummary();
  }

  exportConfigurations() {
    // Export Softr Pages
    const softrConfig = {
      workspace: CONFIG.softr.workspace,
      pages: this.softrPages,
      buildDate: new Date().toISOString()
    };
    fs.writeFileSync(
      path.join(__dirname, 'BUILD-SOFTR-PAGES.json'),
      JSON.stringify(softrConfig, null, 2)
    );
    console.log('   ✓ Exported: BUILD-SOFTR-PAGES.json');

    // Export Zapier Workflows
    const zapierConfig = {
      workflows: this.zapierWorkflows,
      totalWorkflows: this.zapierWorkflows.length,
      buildDate: new Date().toISOString()
    };
    fs.writeFileSync(
      path.join(__dirname, 'BUILD-ZAPIER-WORKFLOWS.json'),
      JSON.stringify(zapierConfig, null, 2)
    );
    console.log('   ✓ Exported: BUILD-ZAPIER-WORKFLOWS.json');

    // Export Access Control
    const acConfig = {
      userGroups: this.accessControl,
      buildDate: new Date().toISOString()
    };
    fs.writeFileSync(
      path.join(__dirname, 'BUILD-ACCESS-CONTROL.json'),
      JSON.stringify(acConfig, null, 2)
    );
    console.log('   ✓ Exported: BUILD-ACCESS-CONTROL.json');

    // Export Complete Configuration
    const fullConfig = {
      project: 'PFMS v2.0',
      status: 'BUILD_CONFIGURATION_GENERATED',
      airtable: CONFIG.airtable,
      softr: {
        workspace: CONFIG.softr.workspace,
        pageCount: this.softrPages.length,
        pages: this.softrPages.map(p => ({ id: p.id, name: p.name, type: p.type }))
      },
      zapier: {
        workflowCount: this.zapierWorkflows.length,
        workflows: this.zapierWorkflows.map(w => ({ id: w.id, name: w.name }))
      },
      accessControl: Object.keys(this.accessControl).map(role => ({
        role,
        members: this.accessControl[role].members
      })),
      buildDate: new Date().toISOString(),
      nextSteps: [
        '1. Review BUILD-SOFTR-PAGES.json for page configurations',
        '2. Review BUILD-ZAPIER-WORKFLOWS.json for automation specs',
        '3. Review BUILD-ACCESS-CONTROL.json for permissions',
        '4. Manually create pages in Softr.io using configurations',
        '5. Create Zapier Zaps using workflow specifications',
        '6. Configure access control in Softr settings'
      ]
    };
    fs.writeFileSync(
      path.join(__dirname, 'BUILD-COMPLETE-CONFIG.json'),
      JSON.stringify(fullConfig, null, 2)
    );
    console.log('   ✓ Exported: BUILD-COMPLETE-CONFIG.json');
  }

  printSummary() {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                      BUILD COMPLETE ✅                         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('📊 Configuration Summary');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log(`✓ Softr Pages:           ${this.softrPages.length}`);
    this.softrPages.forEach(p => console.log(`  - ${p.name} (${p.type})`));
    console.log(`\n✓ Zapier Workflows:      ${this.zapierWorkflows.length}`);
    this.zapierWorkflows.forEach(w => console.log(`  - [${w.id}] ${w.name}`));
    console.log(`\n✓ User Groups:           ${Object.keys(this.accessControl).length}`);
    Object.keys(this.accessControl).forEach(role => {
      console.log(`  - ${role} (${this.accessControl[role].members.length} members)`);
    });

    console.log('\n📁 Generated Configuration Files');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('✓ BUILD-SOFTR-PAGES.json');
    console.log('✓ BUILD-ZAPIER-WORKFLOWS.json');
    console.log('✓ BUILD-ACCESS-CONTROL.json');
    console.log('✓ BUILD-COMPLETE-CONFIG.json');

    console.log('\n🚀 Next Steps');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('1. Go to Softr.io: https://marlin390JNHBHBHJBJJM.softr.app');
    console.log('2. Create pages manually using BUILD-SOFTR-PAGES.json as reference');
    console.log('3. Go to Zapier.com and create Zaps using BUILD-ZAPIER-WORKFLOWS.json');
    console.log('4. Configure access control in Softr using BUILD-ACCESS-CONTROL.json');
    console.log('5. Test the complete system');

    console.log('\n⏱️  Estimated Manual Implementation Time');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('Phase 1: Softr Pages ........... 2-3 hours');
    console.log('Phase 2: Zapier Workflows ..... 2-3 hours');
    console.log('Phase 3: Access Control ....... 1 hour');
    console.log('Phase 4: Testing & Launch ..... 2-3 hours');
    console.log('─────────────────────────────────────────────────────────────────');
    console.log('Total: ......................... 7-10 hours\n');
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    phase: args.find(a => a.startsWith('--phase'))?.split(' ')[1]
  };

  const builder = new PFMSBuilder();
  await builder.build(options);
}

main().catch(err => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
