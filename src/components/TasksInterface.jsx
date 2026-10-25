import React, { useState } from 'react';
import { formatDateDDMMYYYY, calculateFinishDate } from '../projectData';

export default function TasksInterface({ tasks, setTasks }) {
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: 5,
    start: new Date().toISOString().split('T')[0],
    finish: calculateFinishDate(new Date().toISOString().split('T')[0], 5)
  });

  const handleStartChange = (e) => {
    const newStart = e.target.value;
    const computedFinish = calculateFinishDate(newStart, formData.duration);
    setFormData(prev => ({
      ...prev,
      start: newStart,
      finish: computedFinish
    }));
  };

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10) || 1;
    const computedFinish = calculateFinishDate(formData.start, newDuration);
    setFormData(prev => ({
      ...prev,
      duration: newDuration,
      finish: computedFinish
    }));
  };

  const handleFinishChange = (e) => {
    setFormData(prev => ({
      ...prev,
      finish: e.target.value
    }));
  };

  const handleOpenAdd = () => {
    setEditingTaskId(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      name: '',
      duration: 5,
      start: today,
      finish: calculateFinishDate(today, 5)
    });
    setShowForm(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTaskId(task.id);
    setFormData({
      name: task.name,
      duration: task.duration,
      start: task.start,
      finish: task.finish
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTaskId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Task Name is required');
      return;
    }

    if (editingTaskId !== null) {
      setTasks(prev => prev.map(t => (
        t.id === editingTaskId
          ? { ...t, ...formData }
          : t
      )));
    } else {
      const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      setTasks(prev => [...prev, {
        id: nextId,
        name: formData.name.trim(),
        duration: formData.duration,
        start: formData.start,
        finish: formData.finish,
        resources: []
      }]);
    }

    setShowForm(false);
    setEditingTaskId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete Task #${id}?`)) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      {/* Header */}
      <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <span className="badge bg-success me-2 px-2 py-1">Interface 1</span>
          <h5 className="d-inline-block mb-0 fw-bold text-dark">Tasks Interface</h5>
          <small className="text-muted d-block mt-1">Manage project tasks, estimated durations, and project timelines</small>
        </div>
        <button
          className="btn btn-success d-flex align-items-center gap-2 shadow-sm"
          onClick={handleOpenAdd}
        >
          <i className="bi bi-plus-circle-fill"></i> Add New Task
        </button>
      </div>

      {/* Prominent Add/Edit Form Box */}
      {showForm && (
        <div className="bg-light border-bottom p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0 text-success">
              <i className={`bi ${editingTaskId ? 'bi-pencil-square' : 'bi-plus-circle-dotted'} me-2`}></i>
              {editingTaskId ? `Edit Task #${editingTaskId}` : 'Create New Task'}
            </h6>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseForm}></button>
          </div>
          <form onSubmit={handleSave}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">Task Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. System Testing"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  autoFocus
                  required
                />
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label small fw-semibold">Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.duration}
                  onChange={handleDurationChange}
                  required
                />
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label small fw-semibold">Start (Date)</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.start}
                  onChange={handleStartChange}
                  required
                />
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label small fw-semibold">Finish (Date)</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.finish}
                  onChange={handleFinishChange}
                  required
                />
              </div>
              <div className="col-12 col-md-2 d-flex gap-2">
                <button type="submit" className="btn btn-success flex-grow-1 fw-bold">
                  <i className="bi bi-check-lg me-1"></i> {editingTaskId ? 'Update' : 'Save Task'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tasks Table */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-bordered table-hover mpp-table align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: '80px' }} className="text-center">Task ID</th>
                <th>Task Name</th>
                <th style={{ width: '130px' }}>Duration</th>
                <th style={{ width: '150px' }}>Start (Date)</th>
                <th style={{ width: '150px' }}>Finish (Date)</th>
                <th style={{ width: '120px' }} className="text-center no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    <p className="mb-2">No tasks available.</p>
                    <button className="btn btn-sm btn-outline-success" onClick={handleOpenAdd}>
                      <i className="bi bi-plus-circle me-1"></i> Add your first task
                    </button>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className={editingTaskId === task.id ? 'table-active' : ''}>
                    <td className="text-center fw-semibold text-secondary">{task.id}</td>
                    <td className="fw-medium">{task.name}</td>
                    <td>{task.duration} {task.duration === 1 ? 'day' : 'days'}</td>
                    <td>{formatDateDDMMYYYY(task.start)}</td>
                    <td>{formatDateDDMMYYYY(task.finish)}</td>
                    <td className="text-center no-print">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          title="Edit Task"
                          onClick={() => handleOpenEdit(task)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Delete Task"
                          onClick={() => handleDelete(task.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
