import React, { useMemo } from 'react';
import { formatDateDDMMYYYY } from '../projectData';

const toDate = (dateString) => new Date(`${dateString}T12:00:00`);

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const isWeekend = (date) => date.getDay() === 5 || date.getDay() === 6;

const formatIsoDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function GanttView({ tasks }) {
  const chart = useMemo(() => {
    if (tasks.length === 0) return null;

    const taskDates = tasks.flatMap(task => [
      toDate(task.start),
      toDate(task.finish)
    ]).filter(date => !isNaN(date.getTime()));

    if (taskDates.length === 0) return null;

    let projectStart = new Date(Math.min(...taskDates.map(date => date.getTime())));
    let projectFinish = new Date(Math.max(...taskDates.map(date => date.getTime())));

    while (isWeekend(projectStart)) projectStart = addDays(projectStart, 1);
    while (isWeekend(projectFinish)) projectFinish = addDays(projectFinish, -1);

    const workdays = [];
    for (let date = new Date(projectStart); date <= projectFinish; date = addDays(date, 1)) {
      if (!isWeekend(date)) {
        workdays.push(new Date(date));
      }
    }

    return {
      projectStart,
      projectFinish,
      workdays
    };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="card shadow-sm border-0 p-5 text-center text-muted">
        No tasks available for the Gantt chart.
      </div>
    );
  }

  if (!chart) return null;

  return (
    <div className="card shadow-sm border-0 mb-4 gantt-card">
      <div className="card-header bg-white border-bottom py-3">
        <span className="badge bg-success me-2 px-2 py-1">Gantt</span>
        <h5 className="d-inline-block mb-0 fw-bold text-dark">Gantt Chart</h5>
        <small className="text-muted d-block mt-1">
          Sunday to Thursday schedule; Friday and Saturday are excluded
        </small>
      </div>

      <div className="gantt-scroll">
        <div className="gantt-grid" style={{ '--gantt-columns': chart.workdays.length }}>
          <div className="gantt-corner">Task</div>
          <div className="gantt-dates">
            {chart.workdays.map(date => (
              <div className="gantt-date" key={formatIsoDate(date)}>
                <span>{date.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                <strong>{String(date.getDate()).padStart(2, '0')}</strong>
              </div>
            ))}
          </div>

          {tasks.map(task => {
            const taskStart = toDate(task.start);
            const taskFinish = toDate(task.finish);
            return (
              <React.Fragment key={task.id}>
                <div className="gantt-task-label">
                  <strong>{task.id}. {task.name}</strong>
                  <small>{formatDateDDMMYYYY(task.start)} - {formatDateDDMMYYYY(task.finish)}</small>
                </div>
                <div className="gantt-row">
                  {chart.workdays.map(date => {
                    const iso = formatIsoDate(date);
                    const active = date >= taskStart && date <= taskFinish;
                    return (
                      <div
                        className={active ? 'gantt-day gantt-day-active' : 'gantt-day'}
                        key={`${task.id}-${iso}`}
                        title={`${task.name}: ${formatDateDDMMYYYY(iso)}`}
                      ></div>
                    );
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
