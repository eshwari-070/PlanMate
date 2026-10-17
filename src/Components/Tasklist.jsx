import React, { useState } from 'react';

export default function TaskList({
  tasks,
  updateTask,
  deleteTask,
  searchTerm,
  setSearchTerm
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editCategory, setEditCategory] = useState('General');
  const [filter, setFilter] = useState('all');

  const toggleComplete = (index) => {
    const updatedTask = {
      ...tasks[index],
      completed: !tasks[index].completed
    };

    updateTask(updatedTask, index);
  };

  const startEditing = (task, index) => {
    setEditingIndex(index);
    setEditText(task.text);
    setEditPriority(task.priority);
    setEditCategory(task.category);
  };

  const saveEdit = (index) => {
    if (!editText.trim()) {
      alert('Please enter a task name.');
      return;
    }

    updateTask(
      {
        ...tasks[index],
        text: editText.trim(),
        priority: editPriority,
        category: editCategory
      },
      index
    );

    setEditingIndex(null);
  };

  const filteredTasks = tasks
    .map((task, index) => ({ ...task, originalIndex: index }))
    .filter((task) =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });

  return (
    <div>
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search your tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search tasks"
        />

        {searchTerm && (
          <button
            type="button"
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear
          </button>
        )}
      </div>

      <div className="task-filters">
        <button
          className={filter === 'all' ? 'active-filter' : ''}
          onClick={() => setFilter('all')}
        >
          All Tasks ({tasks.length})
        </button>

        <button
          className={filter === 'active' ? 'active-filter' : ''}
          onClick={() => setFilter('active')}
        >
          Active ({tasks.filter((task) => !task.completed).length})
        </button>

        <button
          className={filter === 'completed' ? 'active-filter' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter((task) => task.completed).length})
        </button>
      </div>

      {filteredTasks.length > 0 ? (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li
              key={task.originalIndex}
              className={task.completed ? 'completed' : ''}
            >
              {editingIndex === task.originalIndex ? (
                <div className="edit-form">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="Task name"
                    aria-label="Edit task name"
                  />

                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    aria-label="Edit priority"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>

                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    aria-label="Edit category"
                  >
                    <option value="General">General</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                  </select>

                  <button onClick={() => saveEdit(task.originalIndex)}>
                    Save
                  </button>

                  <button onClick={() => setEditingIndex(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="task-details">
                    <span>{task.text}</span>{' '}
                    <small>
                      ({task.priority}, {task.category})
                    </small>
                  </div>

                  <div className="task-actions">
                    <button
                      onClick={() => toggleComplete(task.originalIndex)}
                    >
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>

                    <button
                      onClick={() =>
                        startEditing(task, task.originalIndex)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task.originalIndex)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-results">
          {searchTerm
            ? 'No matching tasks found.'
            : filter === 'active'
              ? 'No active tasks!'
              : filter === 'completed'
                ? 'No completed tasks yet.'
                : 'No tasks yet. Add your first task above!'}
        </p>
      )}
    </div>
  );
}
