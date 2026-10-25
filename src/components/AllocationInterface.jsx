import React, { useState } from 'react';
import { formatDateDDMMYYYY } from '../projectData';

export default function AllocationInterface({ tasks, setTasks, resources }) {
  const [activeTaskId, setActiveTaskId] = useState(null);

  const toggleResource = (taskId, resourceName) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const current = task.resources || [];
      const exists = current.includes(resourceName);
      const updated = exists
        ? current.filter(r => r !== resourceName)
        : [...current, resourceName];
      return { ...task, resources: updated };
    }));
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <span className="badge bg-info text-dark me-2 px-2 py-1">Interface 3</span>
          <h5 className="d-inline-block mb-0 fw-bold text-dark">Task Resource Allocation Interface</h5>
          <small className="text-muted d-block mt-1">Assign and allocate appropriate human, material, and cost resources to each task</small>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-bordered table-hover mpp-table align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: '80px' }} className="text-center">Task ID</th>
                <th>Task Name</th>
                <th style={{ width: '130px' }}>Duration</th>
                <th style={{ width: '140px' }}>Start (Date)</th>
                <th style={{ width: '140px' }}>Finish (Date)</th>
                <th>Resource Name</th>
                <th style={{ width: '140px' }} className="text-center no-print">Quick Assign</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No tasks found. Please add tasks in the Tasks Interface first.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const taskRes = task.resources || [];
                  const isPanelOpen = activeTaskId === task.id;

                  return (
                    <React.Fragment key={task.id}>
                      <tr className={isPanelOpen ? 'table-active' : ''}>
                        <td className="text-center fw-semibold text-secondary">{task.id}</td>
                        <td className="fw-medium">{task.name}</td>
                        <td>{task.duration} {task.duration === 1 ? 'day' : 'days'}</td>
                        <td>{formatDateDDMMYYYY(task.start)}</td>
                        <td>{formatDateDDMMYYYY(task.finish)}</td>
                        <td>
                          {taskRes.length === 0 ? (
                            <span className="text-muted fst-italic">None assigned</span>
                          ) : (
                            <div className="d-flex flex-wrap gap-1 align-items-center">
                              {taskRes.map((rName, i) => (
                                <span key={i} className="mpp-badge-resource">
                                  {rName}
                                  <button
                                    type="button"
                                    className="btn-close btn-close-sm ms-1 no-print"
                                    style={{ fontSize: '0.65rem' }}
                                    aria-label="Remove"
                                    onClick={() => toggleResource(task.id, rName)}
                                  ></button>
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="text-center no-print">
                          <button
                            className={`btn btn-sm ${isPanelOpen ? 'btn-secondary' : 'btn-outline-primary'} d-inline-flex align-items-center gap-1`}
                            onClick={() => setActiveTaskId(isPanelOpen ? null : task.id)}
                          >
                            <i className={`bi ${isPanelOpen ? 'bi-x-lg' : 'bi-person-gear'}`}></i>
                            {isPanelOpen ? 'Close' : 'Assign'}
                          </button>
                        </td>
                      </tr>

                      {/* Inline Resource Allocation Selector Drawer */}
                      {isPanelOpen && (
                        <tr className="bg-light no-print">
                          <td colSpan="7" className="p-3">
                            <div className="card border p-3 bg-white">
                              <h6 className="fw-bold mb-2 text-primary">
                                <i className="bi bi-people-fill me-2"></i>
                                Select Resources for "{task.name}"
                              </h6>
                              <div className="row g-2 mt-1">
                                {resources.map((res) => {
                                  const isChecked = taskRes.includes(res.name);
                                  return (
                                    <div key={res.id} className="col-12 col-md-4">
                                      <div
                                        className={`p-2 rounded border d-flex align-items-center justify-content-between cursor-pointer ${
                                          isChecked ? 'border-primary bg-primary-subtle' : 'bg-light'
                                        }`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => toggleResource(task.id, res.name)}
                                      >
                                        <div className="form-check mb-0">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {}}
                                            id={`chk-${task.id}-${res.id}`}
                                          />
                                          <label
                                            className="form-check-label fw-medium ms-1"
                                            htmlFor={`chk-${task.id}-${res.id}`}
                                          >
                                            {res.name}
                                          </label>
                                        </div>
                                        <span className="badge bg-secondary-subtle text-secondary small">
                                          {res.type}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
