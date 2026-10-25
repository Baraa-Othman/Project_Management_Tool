import React, { useState } from 'react';
import { useProjectStorage } from './projectData';
import TasksInterface from './components/TasksInterface';
import ResourceInterface from './components/ResourceInterface';
import AllocationInterface from './components/AllocationInterface';
import ReportsView from './components/ReportsView';

export default function App() {
  const { tasks, setTasks, resources, setResources, resetToSampleData } = useProjectStorage();
  const [currentTab, setCurrentTab] = useState('tasks'); // 'tasks', 'resources', 'allocation', 'reports'

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Microsoft Project Professional Style Green Titlebar */}
      <header className="mpp-titlebar">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-white text-success rounded p-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
            <i className="bi bi-calendar2-range-fill fs-6"></i>
          </div>
          <div>
            <span className="fw-bold fs-6">Microsoft Project</span>
            <span className="badge bg-dark-subtle text-white border ms-2 small">Project1 - Professional Web Edition</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 no-print">
          <button
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            title="Reset data to initial assignment sample"
            onClick={() => {
              if (window.confirm('Reset all tasks and resources to the assignment sample dataset?')) {
                resetToSampleData();
              }
            }}
          >
            <i className="bi bi-arrow-counterclockwise"></i>
            <span className="d-none d-sm-inline">Reset Sample Data</span>
          </button>
          <button
            className="btn btn-sm btn-light text-success fw-bold d-flex align-items-center gap-1"
            onClick={() => window.print()}
          >
            <i className="bi bi-printer"></i>
            <span>Print Sheet</span>
          </button>
        </div>
      </header>

      {/* Navigation Ribbon Tabs */}
      <nav className="mpp-ribbon no-print">
        <div className="container-fluid px-4">
          <ul className="nav mpp-nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${currentTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setCurrentTab('tasks')}
              >
                <i className="bi bi-list-task"></i>
                1. Tasks Interface
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${currentTab === 'resources' ? 'active' : ''}`}
                onClick={() => setCurrentTab('resources')}
              >
                <i className="bi bi-people"></i>
                2. Resource Interface
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${currentTab === 'allocation' ? 'active' : ''}`}
                onClick={() => setCurrentTab('allocation')}
              >
                <i className="bi bi-person-lines-fill"></i>
                3. Resource Allocation
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${currentTab === 'reports' ? 'active' : ''}`}
                onClick={() => setCurrentTab('reports')}
              >
                <i className="bi bi-file-earmark-bar-graph"></i>
                4-8. Reports & Print Sheets
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container-fluid px-4 py-4 flex-grow-1">
        {/* Printable project header seen in hardcopy printouts */}
        <div className="d-none print-only mpp-print-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="fw-bold mb-0">Microsoft Project Professional - Project Report</h3>
              <small className="text-muted">Generated from Web Project Management System</small>
            </div>
            <div className="text-end">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Status: Active Schedule</div>
            </div>
          </div>
        </div>

        {/* Tab Views */}
        {currentTab === 'tasks' && (
          <TasksInterface tasks={tasks} setTasks={setTasks} />
        )}

        {currentTab === 'resources' && (
          <ResourceInterface resources={resources} setResources={setResources} />
        )}

        {currentTab === 'allocation' && (
          <AllocationInterface tasks={tasks} setTasks={setTasks} resources={resources} />
        )}

        {currentTab === 'reports' && (
          <ReportsView tasks={tasks} resources={resources} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-2 px-4 text-center text-muted small no-print">
        <span>Microsoft Project Professional Web Edition &bull; Tasks, Resources, Allocation &amp; Reports View</span>
      </footer>
    </div>
  );
}
