"use client";
import { useState, useEffect } from "react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "ncompleted") return !task.completed;
      return true;
    })
    .filter((task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <main className="todo">
      <header className="todo__header">
        <h1 className="todo__title">Todo APP</h1>
        <button onClick={toggleDarkMode} className="todo__dark-mode-button">
          {darkMode ? "🌙" : "☀️"}
        </button>
      </header>

      <section className="todo__search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="todo__search-input"
          placeholder="Aradiginiz gorevi giriniz.."
        />
        <select
          className="todo__filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tum Gorevler</option>
          <option value="completed">Tamamlanan</option>
          <option value="ncompleted">Tamamlanmayan</option>
        </select>
      </section>

      <section className="todo__list">
        {filteredTasks.length === 0 ? (
          <section className="todo__empty-message">
            <span className="todo__empty-icon">🔍</span>
            <p className="todo__empty-text">Henuz bir gorev eklenmedi!</p>
          </section>
        ) : (
          <ul className="todo__task-list">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`todo__task-item ${task.completed ? "todo__task-item--completed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task.id)}
                  className="todo__checkbox"
                />
                {editingTask === task.id ? (
                  <input
                    type="text"
                    value={editTaskName}
                    onChange={(e) => setEditTaskName(e.target.value)}
                    className="todo__edit-input"
                  />
                ) : (
                  <span className="todo__task-name">{task.name}</span>
                )}
                <section className="todo__task-actions">
                  {editingTask === task.id ? (
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="todo__save-button"
                    >
                      💾
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(task)}
                      className="todo__edit-button"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="todo__delete-button"
                  >
                    🗑️
                  </button>
                </section>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="todo__input-container">
        <button onClick={deleteAllTasks} className="todo__delete-all-button">
          🧹
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="todo__add-button"
        ></button>
      </section>

      {isModalOpen && (
        <section className="todo__modal-overlay">
          <section className="todo__modal-content">
            <h2 className="todo__modal-text">Gorev Ekleme</h2>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="todo__task-input"
              placeholder="Gorev adiniz.."
            />
            <section className="todo__modal-actions">
              <button
                onClick={() => setIsModalOpen(false)}
                className="todo__cancel-button"
              >
                Iptal Et
              </button>
              <button onClick={addTask} className="todo__confirm-button">
                Ekle
              </button>
            </section>
          </section>
        </section>
      )}
    </main>
  );
}
