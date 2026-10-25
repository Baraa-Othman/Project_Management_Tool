import React, { useState } from 'react';

export default function ResourceInterface({ resources, setResources }) {
  const [editingRes, setEditingRes] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Work',
    stRate: 15,
    costPerUse: 0
  });

  const handleOpenAdd = () => {
    setEditingRes(null);
    setFormData({
      name: '',
      type: 'Work',
      stRate: 15,
      costPerUse: 0
    });
  };

  const handleOpenEdit = (res) => {
    setEditingRes(res.id);
    setFormData({
      name: res.name,
      type: res.type,
      stRate: res.stRate || 0,
      costPerUse: res.costPerUse || 0
    });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData(prev => ({
      ...prev,
      type: newType,
      stRate: newType === 'Work' ? (prev.stRate || 15) : (newType === 'Material' ? (prev.stRate || 1) : 0),
      costPerUse: newType === 'Cost' ? (prev.costPerUse || 1000) : 0
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Resource Name is required');
      return;
    }

    if (editingRes !== null) {
      setResources(prev => prev.map(r => (
        r.id === editingRes
          ? {
              ...r,
              name: formData.name.trim(),
              type: formData.type,
              stRate: formData.type === 'Cost' ? 0 : parseFloat(formData.stRate) || 0,
              costPerUse: formData.type === 'Cost' ? parseFloat(formData.costPerUse) || 0 : 0
            }
          : r
      )));
    } else {
      const nextId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
      setResources(prev => [...prev, {
        id: nextId,
        name: formData.name.trim(),
        type: formData.type,
        stRate: formData.type === 'Cost' ? 0 : parseFloat(formData.stRate) || 0,
        costPerUse: formData.type === 'Cost' ? parseFloat(formData.costPerUse) || 0 : 0
      }]);
    }

    setEditingRes(null);
    setFormData({ name: '', type: 'Work', stRate: 15, costPerUse: 0 });
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete this Resource?`)) {
      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  // Helper formatting for table display
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

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-white border-bottom py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <span className="badge bg-primary me-2 px-2 py-1">Interface 2</span>
          <h5 className="d-inline-block mb-0 fw-bold text-dark">Resource Identification Interface</h5>
          <small className="text-muted d-block mt-1">Specify Work, Material, or Cost resource categories and associated cost structures</small>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAdd}>
          <i className="bi bi-person-plus-fill"></i> Add Resource
        </button>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-bordered table-hover mpp-table align-middle">
            <thead className="table-light">
              <tr>
                <th>Resource Name</th>
                <th style={{ width: '160px' }}>Type (List)</th>
                <th style={{ width: '160px' }}>St.Rate</th>
                <th style={{ width: '160px' }}>Cost/Use</th>
                <th style={{ width: '120px' }} className="text-center no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No resources defined yet. Click "Add Resource" to create one.
                  </td>
                </tr>
              ) : (
                resources.map((res) => (
                  <tr key={res.id}>
                    <td className="fw-medium">
                      <i className={`bi ${res.type === 'Work' ? 'bi-person-badge text-primary' : res.type === 'Cost' ? 'bi-cash-coin text-success' : 'bi-box-seam text-warning'} me-2`}></i>
                      {res.name}
                    </td>
                    <td>
                      <span className={`badge ${res.type === 'Work' ? 'bg-primary-subtle text-primary border border-primary-subtle' : res.type === 'Cost' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-warning-subtle text-warning border border-warning-subtle'} px-2 py-1 rounded-pill`}>
                        {res.type}
                      </span>
                    </td>
                    <td className="fw-semibold">{formatStRate(res)}</td>
                    <td className="fw-semibold">{formatCostPerUse(res)}</td>
                    <td className="text-center no-print">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          title="Edit Resource"
                          onClick={() => handleOpenEdit(res)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Delete Resource"
                          onClick={() => handleDelete(res.id)}
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

      {/* Resource Modal / Drawer */}
      {(editingRes !== null || formData.name !== '') && (
        <div className="card-footer bg-light border-top p-3">
          <form onSubmit={handleSave}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-3">
                <label className="form-label small fw-semibold">Resource Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. Project Manager"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Type (List)</label>
                <select
                  className="form-select form-select-sm"
                  value={formData.type}
                  onChange={handleTypeChange}
                >
                  <option value="Work">Work</option>
                  <option value="Cost">Cost</option>
                  <option value="Material">Material</option>
                </select>
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label small fw-semibold">
                  St.Rate {formData.type === 'Work' ? '($/hr)' : formData.type === 'Material' ? '($)' : '(N/A)'}
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  disabled={formData.type === 'Cost'}
                  className="form-control form-control-sm"
                  placeholder={formData.type === 'Cost' ? 'None' : '0'}
                  value={formData.type === 'Cost' ? '' : formData.stRate}
                  onChange={(e) => setFormData({ ...formData, stRate: e.target.value })}
                />
              </div>
              <div className="col-6 col-md-2">
                <label className="form-label small fw-semibold">Cost/Use ($)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  disabled={formData.type !== 'Cost'}
                  className="form-control form-control-sm"
                  placeholder={formData.type !== 'Cost' ? 'None' : '0'}
                  value={formData.type !== 'Cost' ? '' : formData.costPerUse}
                  onChange={(e) => setFormData({ ...formData, costPerUse: e.target.value })}
                />
              </div>
              <div className="col-6 col-md-2 d-flex gap-2">
                <button type="submit" className="btn btn-sm btn-primary flex-grow-1">
                  <i className="bi bi-check-lg me-1"></i> {editingRes ? 'Update' : 'Save'}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setEditingRes(null);
                    setFormData({ name: '', type: 'Work', stRate: 15, costPerUse: 0 });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
