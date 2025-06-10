import React, { useState, useEffect } from "react";

interface AddTaskDependencyButtonProps {
  onDependencyAdded?: () => void;
}

interface TaskDependency {
  taskDependecyId: number;
  taskId: { taskId: number; title: string | null };
  blockedByTaskId: { taskId: number; title: string | null };
}

const AddTaskDependencyButton: React.FC<AddTaskDependencyButtonProps> = ({ onDependencyAdded }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'add' | 'delete' | null>(null);
  const [taskId, setTaskId] = useState("");
  const [blockedByTaskId, setBlockedByTaskId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [deleteId, setDeleteId] = useState("");
  const jwtToken = sessionStorage.getItem("token");

  // Cargar dependencias existentes para eliminar
  useEffect(() => {
    if (showModal && mode === "delete") {
      fetchDependencies();
    }
    // eslint-disable-next-line
  }, [showModal, mode]);

  const fetchDependencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks/task_dependencies/all", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Error al obtener dependencias");
      const data = await res.json();
      setDependencies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch("/api/tasks/task_dependencies/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId: { taskId: Number(taskId) },
          blockedByTaskId: { taskId: Number(blockedByTaskId) },
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al crear la dependencia");
      }
      setSuccess(true);
      setShowModal(false);
      setTaskId("");
      setBlockedByTaskId("");
      setShowMenu(false);
      if (onDependencyAdded) onDependencyAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch("/api/tasks/task_dependencies/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Number(deleteId)),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al eliminar la dependencia");
      }
      setSuccess(true);
      setShowModal(false);
      setDeleteId("");
      setShowMenu(false);
      if (onDependencyAdded) onDependencyAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Cierra todo al cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setMode(null);
    setShowMenu(false);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="bg-black text-white px-4 py-2 rounded hover:bg-purple-900 transition"
      >
        Dependencies
      </button>
      {showMenu && (
        <div className="absolute z-10 mt-2 w-48 bg-black border rounded shadow-lg">
          <button
            className="block w-full text-left px-4 py-2 hover:bg-purple-100 text-white"
            onClick={() => { setMode("add"); setShowModal(true); }}
          >
            Add dependency
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-purple-100 text-white"
            onClick={() => { setMode("delete"); setShowModal(true); }}
          >
            Delete dependency
          </button>
        </div>
      )}
      {showModal && mode && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ✕
            </button>
            {mode === "add" ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-black">Agregar dependencia de tarea</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-black">ID de la tarea principal</label>
                    <input
                      type="number"
                      min="1"
                      value={taskId}
                      onChange={e => setTaskId(e.target.value)}
                      className="w-full p-2 border rounded bg-gray-100 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-black">ID de la tarea bloqueadora</label>
                    <input
                      type="number"
                      min="1"
                      value={blockedByTaskId}
                      onChange={e => setBlockedByTaskId(e.target.value)}
                      className="w-full p-2 border rounded bg-gray-100 text-black"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-700 text-white py-2 px-4 rounded hover:bg-purple-900 transition font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Creando..." : "Crear dependencia"}
                  </button>
                  {error && <p className="text-red-600 mt-2">{error}</p>}
                  {success && <p className="text-green-600 mt-2">¡Dependencia creada!</p>}
                </form>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4 text-black">Eliminar dependencia de tarea</h2>
                <form onSubmit={handleDelete} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-black">Selecciona la dependencia a eliminar</label>
                    <select
                      value={deleteId}
                      onChange={e => setDeleteId(e.target.value)}
                      className="w-full p-2 border rounded bg-gray-100 text-black"
                      required
                    >
                      <option value="">-- Selecciona una dependencia --</option>
                      {dependencies.map(dep => (
                        <option key={dep.taskDependecyId} value={dep.taskDependecyId}>
                          #{dep.taskDependecyId} | Tarea: {dep.taskId?.title ?? dep.taskId?.taskId} blocked by: {dep.blockedByTaskId?.title ?? dep.blockedByTaskId?.taskId}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-800 transition font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Eliminando..." : "Eliminar dependencia"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTaskDependencyButton;
