import { useState, useEffect } from 'react';
import Taskform from './Components/Taskform';
import Tasklist from './Components/Tasklist';
import Progresstracker from './Components/Progresstracker';
import './Style.css';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('planmate-theme') === 'dark';
  });

  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      'planmate-theme',
      darkMode ? 'dark' : 'light'
    );

    document.body.classList.toggle('dark-mode', darkMode);

    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, [darkMode]);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification('');
    }, 2500);

    return () => clearTimeout(timer);
  }, [notification]);

  const addTask = (task) => {
    setTasks((previousTasks) => [...previousTasks, task]);
    showNotification('✓ Task added successfully!');
  };

  const updateTask = (updatedTask, index) => {
    const previousTask = tasks[index];

    setTasks((previousTasks) =>
      previousTasks.map((task, i) =>
        i === index ? updatedTask : task
      )
    );

    if (previousTask && !previousTask.completed && updatedTask.completed) {
      showNotification('✓ Task completed!');
    } else if (
      previousTask &&
      previousTask.completed &&
      !updatedTask.completed
    ) {
      showNotification('Task marked as active.');
    } else {
      showNotification('✓ Task updated successfully!');
    }
  };

  const deleteTask = (index) => {
    setTasks((previousTasks) =>
      previousTasks.filter((_, i) => i !== index)
    );

    showNotification('✓ Task deleted successfully!');
  };

  const clearTasks = () => {
    setTasks([]);
    showNotification('✓ All tasks cleared!');
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {notification && (
        <div className="notification-toast" role="status" aria-live="polite">
          {notification}
        </div>
      )}

      <header className="app-header">
        <div>
          <h1>PlanMate</h1>
          <p>
            <i>Your smart planning companion</i>
          </p>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode((previousMode) => !previousMode)}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <Taskform addTask={addTask} />

      <Tasklist
        tasks={tasks}
        updateTask={updateTask}
        deleteTask={deleteTask}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Progresstracker tasks={tasks} />

      {tasks.length > 0 && (
        <button className="clear-btn" onClick={clearTasks}>
          Clear All Tasks
        </button>
      )}
    </div>
  );
}