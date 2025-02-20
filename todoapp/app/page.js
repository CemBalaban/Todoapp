"use client";
import { useState, useEffect } from "react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskName.trim()) return;
    const newTask = {
      id: Date.now(),
      name: taskName,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskName("");
    setIsModalOpen(false);
  };

  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditTaskName(task.name);
  };

  const saveEdit = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, name: editTaskName } : task,
      ),
    );
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="todo-container">
      <header className="todo-header">
        <h1>Todo APP</h1>
      </header>

      <section className="search-section">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          placeholder="Aradiginiz görevi giriniz.."
        />
      </section>

      <section className="todo-list">
        {filteredTasks.length === 0 ? (
          <section className="empty-message">
            <span className="empty-icon">🔍</span>
            <p>Henüz bir görev eklenmedi!</p>
          </section>
        ) : (
          <ul>
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task.id)}
                  className="checkbox"
                />
                {editingTask === task.id ? (
                  <input
                    type="text"
                    value={editTaskName}
                    onChange={(e) => setEditTaskName(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  <span>{task.name}</span>
                )}
                <section className="task-actions">
                  {editingTask === task.id ? (
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="save-button"
                    >
                      💾
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(task)}
                      className="edit-button"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="delete-button"
                  >
                    🗑️
                  </button>
                </section>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="task-input-container">
        <button onClick={deleteAllTasks} className="delete-all-button">
          🧹
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="add-button"
        ></button>
      </section>

      {isModalOpen && (
        <section className="modal-overlay">
          <section className="modal-content">
            <h2 className="modal-text">Görev Ekleme</h2>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="task-input"
              placeholder="Görev adiniz.."
            />
            <section className="modal-actions">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cancel-button"
              >
                İptal Et
              </button>
              <button onClick={addTask} className="confirm-button">
                Ekle
              </button>
            </section>
          </section>
        </section>
      )}
    </main>
  );
}
