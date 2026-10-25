import React, { useState, useEffect } from 'react';

// Default initial dataset matching the requirements document
const INITIAL_TASKS = [
  {
    id: 1,
    name: 'Problem Identification',
    duration: 5,
    start: '2026-11-10',
    finish: '2026-11-14',
    resources: ['Project Manager', 'Laptop', 'Paper']
  },
  {
    id: 2,
    name: 'Gather Requirements',
    duration: 6,
    start: '2026-11-15',
    finish: '2026-11-21',
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

// Auto compute finish date given start date and duration (calendar days)
export const calculateFinishDate = (startDateStr, durationDays) => {
  if (!startDateStr || !durationDays || durationDays <= 0) return startDateStr;
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return startDateStr;
  
  const finish = new Date(start);
  finish.setDate(start.getDate() + (parseInt(durationDays, 10) - 1));
  
  const yyyy = finish.getFullYear();
  const mm = String(finish.getMonth() + 1).padStart(2, '0');
  const dd = String(finish.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
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
export const calculateTaskTotalCost = (task, allResources) => {
  if (!task.resources || task.resources.length === 0) return 0;
  
  return task.resources.reduce((sum, resName) => {
    const res = allResources.find(r => r.name.trim().toLowerCase() === resName.trim().toLowerCase());
    return sum + (res ? calculateResourceCost(res, task.duration) : 0);
  }, 0);
};

export const useProjectStorage = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('mpp_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('mpp_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  useEffect(() => {
    localStorage.setItem('mpp_tasks', JSON.stringify(tasks));
  }, [tasks]);

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
