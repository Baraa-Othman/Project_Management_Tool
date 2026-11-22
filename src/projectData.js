import React, { useState, useEffect } from 'react';

// Default initial dataset matching the requirements document
const INITIAL_TASKS = [
  {
    id: 1,
    name: 'Problem Identification',
    duration: 5,
    start: '2026-11-10',
    finish: '2026-11-16',
    resources: ['Project Manager', 'Laptop', 'Paper']
  },
  {
    id: 2,
    name: 'Gather Requirements',
    duration: 6,
    start: '2026-11-17',
    finish: '2026-11-24',
    resources: ['Project Manager', 'Laptop']
  }
];

const INITIAL_RESOURCES = [
  {
    id: 1,
    name: 'Project Manager',
    type: 'Work',
    stRate: 15, // $/hr
    costPerUse: 0
  },
  {
    id: 2,
    name: 'Laptop',
    type: 'Cost',
    stRate: 0,
    costPerUse: 1000
  },
  {
    id: 3,
    name: 'Paper',
    type: 'Material',
    stRate: 1, // $
    costPerUse: 0
  }
];

// Helper to format date string to DD/MM/YYYY matching requirements document
export const formatDateDDMMYYYY = (isoDateStr) => {
  if (!isoDateStr) return '';
  // Check if already in DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(isoDateStr)) {
    return isoDateStr;
  }
  const parts = isoDateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDateStr;
};

export const isWorkday = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(`${dateStr}T12:00:00`);
  if (isNaN(date.getTime())) return false;
  const day = date.getDay();
  return day !== 5 && day !== 6;
};

export const getNextWorkday = (dateStr) => {
  if (!dateStr) return dateStr;
  let date = new Date(`${dateStr}T12:00:00`);
  if (isNaN(date.getTime())) return dateStr;
  while (date.getDay() === 5 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const formatIsoDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Count only Sunday-through-Thursday workdays. Start and finish are inclusive.
export const calculateFinishDate = (startDateStr, durationDays) => {
  if (!startDateStr || !durationDays || durationDays <= 0) return startDateStr;
  const start = new Date(`${startDateStr}T12:00:00`);
  if (isNaN(start.getTime())) return startDateStr;

  if (start.getDay() === 5 || start.getDay() === 6) {
    return startDateStr;
  }

  const finish = new Date(start);
  let workdays = 1;
  while (workdays < parseInt(durationDays, 10)) {
    finish.setDate(finish.getDate() + 1);
    if (finish.getDay() !== 5 && finish.getDay() !== 6) {
      workdays += 1;
    }
  }
  return formatIsoDate(finish);
};

// Count backward only Sunday-through-Thursday workdays.
export const calculateStartDate = (finishDateStr, durationDays) => {
  if (!finishDateStr || !durationDays || durationDays <= 0) return finishDateStr;
  const finish = new Date(`${finishDateStr}T12:00:00`);
  if (isNaN(finish.getTime())) return finishDateStr;

  if (finish.getDay() === 5 || finish.getDay() === 6) {
    return finishDateStr;
  }

  const start = new Date(finish);
  let workdays = 1;
  while (workdays < parseInt(durationDays, 10)) {
    start.setDate(start.getDate() - 1);
    if (start.getDay() !== 5 && start.getDay() !== 6) {
      workdays += 1;
    }
  }
  return formatIsoDate(start);
};

export const sortTasksByStartDate = (tasks) => {
  return [...(tasks || [])].sort((a, b) => {
    const startA = /^\d{2}\/\d{2}\/\d{4}$/.test(a.start || '')
      ? a.start.split('/').reverse().join('-')
      : (a.start || '');
    const startB = /^\d{2}\/\d{2}\/\d{4}$/.test(b.start || '')
      ? b.start.split('/').reverse().join('-')
      : (b.start || '');

    const dateComparison = startA.localeCompare(startB);
    if (dateComparison !== 0) return dateComparison;

    const idA = parseInt(a.id, 10) || 0;
    const idB = parseInt(b.id, 10) || 0;
    return idA - idB;
  });
};

// Calculate cost for a single resource on a specific task
export const calculateResourceCost = (resource, taskDuration) => {
  if (!resource) return 0;
  if (resource.type === 'Work') {
    // Standard rate is per hour. 1 day = 8 work hours
    const days = parseInt(taskDuration, 10) || 0;
    const rate = parseFloat(resource.stRate) || 0;
    return days * 8 * rate;
  } else if (resource.type === 'Cost') {
    return parseFloat(resource.costPerUse) || 0;
  } else if (resource.type === 'Material') {
    return parseFloat(resource.stRate) || 0;
  }
  return 0;
};

// Calculate total cost for a task
export const calculateTaskTotalCost = (task, allResources, allTasks = null) => {
  if (!task.resources || task.resources.length === 0) return 0;

  const orderedTasks = allTasks || [task];

  return task.resources.reduce((sum, resName) => {
    const res = allResources.find(r => r.name.trim().toLowerCase() === resName.trim().toLowerCase());
    if (!res) return sum;

    // Work and Cost resources: Cost/Use items are charged once per distinct
    // employee allocation. Material resources remain charged normally.
    if (res.type === 'Cost') {
      const workResources = (task.resources || [])
        .map(name => allResources.find(resource =>
          resource.name.trim().toLowerCase() === name.trim().toLowerCase()
        ))
        .filter(resource => resource?.type === 'Work');

      if (workResources.length === 0) {
        const firstAllocatedTask = orderedTasks.find(candidate =>
          (candidate.resources || []).some(name =>
            name.trim().toLowerCase() === resName.trim().toLowerCase()
          )
        );
        return sum + (firstAllocatedTask?.id === task.id
          ? calculateResourceCost(res, task.duration)
          : 0);
      }

      const costUses = workResources.reduce((count, employee) => {
        const employeeName = employee.name.trim().toLowerCase();
        const firstSharedTask = orderedTasks.find(candidate => {
          const candidateResources = (candidate.resources || []).map(name => name.trim().toLowerCase());
          return candidateResources.includes(resName.trim().toLowerCase()) &&
            candidateResources.includes(employeeName);
        });
        return count + (firstSharedTask?.id === task.id ? 1 : 0);
      }, 0);

      return sum + (costUses * calculateResourceCost(res, task.duration));
    }

    return sum + calculateResourceCost(res, task.duration);
  }, 0);
};

export const useProjectStorage = () => {
  const [tasks, setStoredTasks] = useState(() => {
    const saved = localStorage.getItem('mpp_tasks');
    if (!saved) return sortTasksByStartDate(INITIAL_TASKS);
    try {
      const savedTasks = JSON.parse(saved);
      return sortTasksByStartDate(savedTasks.map(task => {
        const duration = parseInt(String(task.duration).replace(/[^0-9]/g, ''), 10) || 1;
        const start = getNextWorkday(task.start);
        return {
          ...task,
          duration,
          start,
          finish: calculateFinishDate(start, duration)
        };
      }));
    } catch {
      return sortTasksByStartDate(INITIAL_TASKS);
    }
  });

  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('mpp_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  useEffect(() => {
    localStorage.setItem('mpp_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const setTasks = (nextTasks) => {
    setStoredTasks(previousTasks => {
      const resolvedTasks = typeof nextTasks === 'function'
        ? nextTasks(previousTasks)
        : nextTasks;
      return sortTasksByStartDate(resolvedTasks);
    });
  };

  useEffect(() => {
    localStorage.setItem('mpp_resources', JSON.stringify(resources));
  }, [resources]);

  const resetToSampleData = () => {
    setTasks(INITIAL_TASKS);
    setResources(INITIAL_RESOURCES);
  };

  return {
    tasks,
    setTasks,
    resources,
    setResources,
    resetToSampleData
  };
};
