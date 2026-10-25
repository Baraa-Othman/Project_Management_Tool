import React, { useState } from 'react';
import {
  formatDateDDMMYYYY,
  calculateResourceCost,
  calculateTaskTotalCost
} from '../projectData';

export default function ReportsView({ tasks, resources }) {
  const [activeReport, setActiveReport] = useState(4); // 4, 5, 6, 7, 8

  // Helper formatting for resource rate in Report 5
  const formatStRate = (res) => {
    if (res.type === 'Work') {
      return `${res.stRate}$/hr`;
    } else if (res.type === 'Material') {
      return `${res.stRate}$`;
    }
    return '';
  };

  const formatCostPerUse = (res) => {
    if (res.type === 'Cost') {
      return `${res.costPerUse}`;
    }
    return '';
  };

  // Compute Grand Total for Report 8
  const grandTotalCost = tasks.reduce((sum, task) => {
    return sum + calculateTaskTotalCost(task, resources);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Sub-navigation pill tabs for the 5 reports (No-print) */}
      <div className="card shadow-sm border-0 mb-4 no-print">
        <div className="card-body p-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="btn-group flex-wrap" role="group" aria-label="Select Report View">
              <button
                type="button"
                className={`btn btn-sm ${activeReport === 4 ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                onClick={() => setActiveReport(4)}
              >
                4. All Tasks
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeReport === 5 ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                onClick={() => setActiveReport(5)}
              >
                5. All Resources
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeReport === 6 ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                onClick={() => setActiveReport(6)}
              >
                6. Tasks + Resources
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeReport === 7 ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                onClick={() => setActiveReport(7)}
              >
                7. Task Total Cost
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeReport === 8 ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}
                onClick={() => setActiveReport(8)}
              >
                8. Project Total Cost
              </button>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-dark btn-sm d-flex align-items-center gap-1 shadow-sm"
                onClick={handlePrint}
                title="Print the active report view"
              >
                <i className="bi bi-printer-fill"></i>
                <span>Print Active Sheet</span>
              </button>
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1 shadow-sm"
                onClick={() => setActiveReport('all')}
              >
                <i className="bi bi-collection-fill"></i>
                <span>View / Print All 5 Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Sheet View Container */}
      <div className="mpp-sheet-container mb-5">
        
        {/* ======================================================== */}
        {/* REPORT 4: Design a Report that Should Display All the tasks (Just View) */}
        {/* ======================================================== */}
        {(activeReport === 4 || activeReport === 'all') && (
          <div className="p-4 mb-4 border-bottom print-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">
                  4. Design a Report that Should Display All the tasks (Just View)
                </h5>
                <p className="text-muted small mb-0">Read-only presentation sheet of all defined project tasks</p>
              </div>
              <span className="badge bg-light text-dark border no-print">Report #4</span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered mpp-table align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '100px' }} className="text-center">Task ID</th>
                    <th>Task Name</th>
                    <th style={{ width: '140px' }}>Duration</th>
                    <th style={{ width: '160px' }}>Start (Date)</th>
                    <th style={{ width: '160px' }}>Finish (Date)</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">No tasks found.</td>
                    </tr>
                  ) : (
                    tasks.map(task => (
                      <tr key={task.id}>
                        <td className="text-center fw-semibold text-secondary">{task.id}</td>
                        <td className="fw-medium">{task.name}</td>
                        <td>{task.duration} {task.duration === 1 ? 'day' : 'days'}</td>
                        <td>{formatDateDDMMYYYY(task.start)}</td>
                        <td>{formatDateDDMMYYYY(task.finish)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* REPORT 5: Design a Report that Should Display All the Resources (Just View) */}
        {/* ======================================================== */}
        {(activeReport === 5 || activeReport === 'all') && (
          <div className="p-4 mb-4 border-bottom print-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">
                  5. Design a Report that Should Display All the Resources (Just View)
                </h5>
                <p className="text-muted small mb-0">Read-only roster of all human and capital resources</p>
              </div>
              <span className="badge bg-light text-dark border no-print">Report #5</span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered mpp-table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Resource Name</th>
                    <th style={{ width: '180px' }}>Type (List)</th>
                    <th style={{ width: '180px' }}>St.Rate</th>
                    <th style={{ width: '180px' }}>Cost/Use</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">No resources found.</td>
                    </tr>
                  ) : (
                    resources.map(res => (
                      <tr key={res.id}>
                        <td className="fw-medium">{res.name}</td>
                        <td>{res.type}</td>
                        <td className="fw-semibold">{formatStRate(res)}</td>
                        <td className="fw-semibold">{formatCostPerUse(res)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* REPORT 6: Design a Report that Should Display All the Tasks + Resources (Just View) */}
        {/* ======================================================== */}
        {(activeReport === 6 || activeReport === 'all') && (
          <div className="p-4 mb-4 border-bottom print-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">
                  6. Design a Report that Should Display All the Tasks + Resources (Just View)
                </h5>
                <p className="text-muted small mb-0">Comprehensive mapping of all tasks along with assigned resources</p>
              </div>
              <span className="badge bg-light text-dark border no-print">Report #6</span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered mpp-table align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '90px' }} className="text-center">Task ID</th>
                    <th>Task Name</th>
                    <th style={{ width: '130px' }}>Duration</th>
                    <th style={{ width: '150px' }}>Start (Date)</th>
                    <th style={{ width: '150px' }}>Finish (Date)</th>
                    <th>Resource Name</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">No tasks found.</td>
                    </tr>
                  ) : (
                    tasks.map(task => {
                      const resNames = (task.resources || []).join(', ');
                      return (
                        <tr key={task.id}>
                          <td className="text-center fw-semibold text-secondary">{task.id}</td>
                          <td className="fw-medium">{task.name}</td>
                          <td>{task.duration} {task.duration === 1 ? 'day' : 'days'}</td>
                          <td>{formatDateDDMMYYYY(task.start)}</td>
                          <td>{formatDateDDMMYYYY(task.finish)}</td>
                          <td>{resNames || '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* REPORT 7: Design a Report that Should Display Total Cost for each task (Just View) */}
        {/* ======================================================== */}
        {(activeReport === 7 || activeReport === 'all') && (
          <div className="p-4 mb-4 border-bottom print-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">
                  7. Design a Report that Should Display Total Cost for each task (Just View)
                </h5>
                <p className="text-muted small mb-0">Financial breakdown showing cost calculations for each task</p>
              </div>
              <span className="badge bg-light text-dark border no-print">Report #7</span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered mpp-table align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '90px' }} className="text-center">Task ID</th>
                    <th>Task Name</th>
                    <th style={{ width: '120px' }}>Duration</th>
                    <th style={{ width: '140px' }}>Start (Date)</th>
                    <th style={{ width: '140px' }}>Finish (Date)</th>
                    <th>Resource Name</th>
                    <th style={{ width: '130px' }} className="text-end">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-3">No tasks found.</td>
                    </tr>
                  ) : (
                    tasks.map(task => {
                      const resNames = (task.resources || []).join(', ');
                      const taskCost = calculateTaskTotalCost(task, resources);
                      return (
                        <tr key={task.id}>
                          <td className="text-center fw-semibold text-secondary">{task.id}</td>
                          <td className="fw-medium">{task.name}</td>
                          <td>{task.duration} {task.duration === 1 ? 'day' : 'days'}</td>
                          <td>{formatDateDDMMYYYY(task.start)}</td>
                          <td>{formatDateDDMMYYYY(task.finish)}</td>
                          <td>{resNames || '-'}</td>
                          <td className="text-end fw-bold text-success">{taskCost}$</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* REPORT 8: Design a Report that Should Display Total Cost for Whole Project (Task Wise) (Just View) */}
        {/* ======================================================== */}
        {(activeReport === 8 || activeReport === 'all') && (
          <div className="p-4 print-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-1">
                  8. Design a Report that Should Display Total Cost for Whole Project (Task Wise) (Just View)
                </h5>
                <p className="text-muted small mb-0">Project-wide financial rollup summarizing the cumulative budget and individual task totals</p>
              </div>
              <span className="badge bg-light text-dark border no-print">Report #8</span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered mpp-table align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '90px' }} className="text-center">Task ID</th>
                    <th>Task Name</th>
                    <th style={{ width: '120px' }}>Duration</th>
                    <th style={{ width: '140px' }}>Start (Date)</th>
                    <th style={{ width: '140px' }}>Finish (Date)</th>
                    <th>Resource Name</th>
                    <th style={{ width: '130px' }} className="text-end">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-3">No tasks found.</td>
                    </tr>
                  ) : (
                    tasks.map(task => {
                      const resNames = (task.resources || []).join(', ');
                      const taskCost = calculateTaskTotalCost(task, resources);
                      return (
                        <tr key={task.id}>
                          <td className="text-center fw-semibold text-secondary">{task.id}</td>
                          <td className="fw-medium">{task.name}</td>
                          <td>{task.duration} {task.duration === 1 ? 'day' : 'days'}</td>
                          <td>{formatDateDDMMYYYY(task.start)}</td>
                          <td>{formatDateDDMMYYYY(task.finish)}</td>
                          <td>{resNames || '-'}</td>
                          <td className="text-end fw-bold">{taskCost}$</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr className="table-active">
                    <td colSpan="6" className="fw-bold text-dark py-3 fs-6">
                      Total Cost
                    </td>
                    <td className="text-end fw-bold text-success py-3 fs-6">
                      {grandTotalCost}$
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Visual Project Budget Overview Badge Card */}
            <div className="mt-4 p-3 rounded bg-light border d-flex flex-wrap align-items-center justify-content-between gap-3 no-print">
              <div>
                <span className="text-muted small text-uppercase fw-bold">Project Summary</span>
                <h6 className="fw-bold mb-0 text-dark">
                  Total Active Tasks: <span className="text-primary">{tasks.length}</span> | Active Resources: <span className="text-primary">{resources.length}</span>
                </h6>
              </div>
              <div className="text-end">
                <span className="text-muted small text-uppercase fw-bold">Cumulative Budget</span>
                <h4 className="fw-bold text-success mb-0">{grandTotalCost}$</h4>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
