"use client";
import { useState, useEffect } from "react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

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
      date: new Date().toLocaleString(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskName("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (task) => {
    setEditMode(true);
    setCurrentTask(task);
    setTaskName(task.name);
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const saveTask = () => {
    if (!taskName.trim()) return;
    setTasks(
      tasks.map((task) =>
        task.id === currentTask.id
          ? { ...task, name: taskName, completed: currentTask.completed }
          : task,
      ),
    );
    setEditMode(false);
    setTaskName("");
  };

  const cancelEdit = () => {
    setEditMode(false);
    setTaskName("");
  };

  const handleCompletionChange = (e) => {
    const updatedTask = { ...currentTask, completed: e.target.checked };
    setCurrentTask(updatedTask);
  };
  const toggleAllTasksCompletion = () => {
    const allCompleted = tasks.every((task) => task.completed); // Hepsi tamamlanmış mı?
    setTasks(tasks.map((task) => ({ ...task, completed: !allCompleted })));
  };

  return (
    <main className="styles.main">
      <header>
        <h1 className="ttl">Yapılacaklar Listesi</h1>
      </header>

      <section className="adder">
        <input
          type="text"
          id="task-input"
          className="txt-lbl"
          placeholder="Lütfen bir görev giriniz.."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>
          Ekle
        </button>
      </section>

      {editMode && (
        <dialog className="modal" open>
          <article className="modal-content">
            <header>
              <h2>Düzenleme</h2>
            </header>
            <input
              type="text"
              id="edit-input"
              className="edit-lbl"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={currentTask.completed}
                  onChange={handleCompletionChange}
                />
                Tamamlandı
              </label>
            </div>
            <footer className="modal-actions">
              <button onClick={saveTask}>Kaydet</button>
              <button onClick={cancelEdit}>İptal</button>
            </footer>
          </article>
        </dialog>
      )}

      <section className="task-table">
        <table className="tbl">
          <caption>Görev Listesi</caption>
          <thead>
            <tr>
              <th scope="col">Görev</th>
              <th scope="col">Tarih</th>
              <th scope="col">Durum</th>
              <th scope="col">İşlemler</th>
            </tr>
          </thead>
          <tbody className="tblbody">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.date}</td>
                <td>
                  <span
                    className={task.completed ? "status completed" : "status"}
                  >
                    {task.completed ? "Tamamlandı" : "Tamamlanmadı"}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Sil
                  </button>
                  <button className="edit-btn" onClick={() => editTask(task)}>
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-actions">
          <button className="clear-btn" onClick={clearAllTasks}>
            Tümünü Sil
          </button>
          <button
            className="complete-all-btn"
            onClick={toggleAllTasksCompletion}
          >
            Tümünü Tamamla
          </button>
        </div>
      </section>
    </main>
  );
}
