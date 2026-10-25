# Microsoft Project Professional Web App

A web application that replicates the core functionality and reporting layout of Microsoft Project Professional, built with **React**, **Bootstrap 5**, and customized MPP design themes.

## Features Implemented (Matching All 8 Requirements)

1. **Tasks Interface (Sample 1)**:
   - Columns: `Task ID`, `Task Name`, `Duration`, `Start (Date)`, `Finish (Date)`
   - Add, edit, and delete tasks with dynamic timeline calculation and European date format (`DD/MM/YYYY`).

2. **Resource Identification Interface (Sample 2)**:
   - Columns: `Resource Name`, `Type (List)`, `St.Rate`, `Cost/Use`
   - Handles `Work` (hourly standard rate $/hr), `Material` (unit cost $), and `Cost` (fixed cost per use).

3. **Task Resource Allocation Interface (Sample 3)**:
   - Allocate and manage multiple resources per task.
   - Interactive checklist dropdown per task with visual tags and quick-removal actions.

4. **Report: All Tasks (Just View) (Requirement 4)**:
   - Read-only table sheet displaying `Task ID`, `Task Name`, `Duration`, `Start (Date)`, `Finish (Date)`.

5. **Report: All Resources (Just View) (Requirement 5)**:
   - Read-only table sheet displaying `Resource Name`, `Type (List)`, `St.Rate`, `Cost/Use`.

6. **Report: All Tasks + Resources (Just View) (Requirement 6)**:
   - Read-only table sheet displaying `Task ID`, `Task Name`, `Duration`, `Start (Date)`, `Finish (Date)`, `Resource Name`.

7. **Report: Total Cost for Each Task (Just View) (Requirement 7)**:
   - Dynamic standard Microsoft Project costing:
     - `Work` resources: `Duration (days) * 8 hrs/day * St.Rate ($/hr)`
     - `Cost` resources: `Cost/Use`
     - `Material` resources: `St.Rate`
   - Yields the exact assignment figures:
     - Task 1: **1601$**
     - Task 2: **720$**

8. **Report: Total Cost for Whole Project (Task Wise) (Requirement 8)**:
   - Rollup table of all tasks with a footer row summarizing project total cost:
     - `Total Cost: 2321$`

## Sheet Printing
- Dedicated `@media print` CSS rules tailored for paper output and PDF export.
- Supports printing individual sheets (Reports 4 through 8) or printing all 5 reports consecutively.
- Toolbar and buttons are hidden during print jobs for a clean presentation.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.
