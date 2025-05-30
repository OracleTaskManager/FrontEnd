import React, { useEffect, useState } from "react";

interface Epic {
  epicId: number;
  title: string;
  description: string;
  status: string;
}

const EpicPopup: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [editEpicId, setEditEpicId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", status: "ToDo" });
  const jwtToken = sessionStorage.getItem("token");

  const fetchEpics = React.useCallback(async () => {
    try {
      const response = await fetch("/api/tasks/epics/all", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (!response.ok) throw new Error("Error al obtener epics");
      const data = await response.json();
      // Normaliza para usar epicId en el frontend
      const normalized = Array.isArray(data)
        ? data.map(e => ({
            epicId: e.epic_id,
            title: e.title,
            description: e.description,
            status: e.status,
          }))
        : [];
      setEpics(normalized);
    } catch {
      setEpics([]);
    }
  }, [jwtToken]);

  useEffect(() => {
    if (showModal) fetchEpics();
  }, [showModal, fetchEpics]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // USAR ENDPOINT RELATIVO PARA VITE PROXY
      const response = await fetch("/api/tasks/epics", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error();
      setFormData({ title: "", description: "" });
      fetchEpics();
      alert("Epic creado exitosamente");
    } catch {
      alert("Error al crear el epic");
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Epics
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50 h-screen ">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Epics</h2>
            <form onSubmit={handleSubmit} className="mb-6 space-y-2">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título"
                className="w-full p-2 border rounded-lg bg-gray-100 text-black placeholder-gray-600 focus:bg-white focus:border-purple-600"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción"
                className="w-full p-2 border rounded-lg bg-gray-100 text-black placeholder-gray-600 focus:bg-white focus:border-purple-600"
                rows={2}
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-800 text-white py-2 px-4 rounded-lg hover:bg-purple-900 transition font-semibold"
              >
                Create Epic
              </button>
            </form>
            <div>
              <h3 className="font-semibold mb-2">Lista de Epics</h3>
              {epics.length === 0 && (
                <p className="text-gray-500">No hay epics.</p>
              )}
              <ul className="space-y-3">
                {epics.map((epic) => (
                  <li key={epic.epicId} className="border rounded-lg p-3 flex flex-col gap-2 bg-gray-50">
                    <div className="font-bold text-lg text-gray-800">{epic.title}</div>
                    <div className="text-gray-700 text-sm">{epic.description}</div>
                    <div className="text-xs text-gray-500">Status: {epic.status}</div>
                    <div className="font-mono text-purple-800 font-bold">ID: {epic.epicId}</div>
                    <div className="flex gap-2 self-end mt-2">
                      <button
                        onClick={async () => {
                          if (!window.confirm(`¿Eliminar el epic con id ${epic.epicId}?`)) return;
                          try {
                            const token = sessionStorage.getItem("token");
                            const res = await fetch(`/api/tasks/epics/?epicId=${epic.epicId}`,
                              {
                                method: "DELETE",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            if (!res.ok) throw new Error("No se pudo eliminar el epic");
                            fetchEpics();
                            alert("Epic eliminado");
                          } catch {
                            alert("Error al eliminar el epic");
                          }
                        }}
                        className="bg-red-700 text-white px-3 py-1 rounded-lg hover:bg-red-900 font-semibold"
                      >
                        Eliminar
                      </button>
                      {editEpicId === epic.epicId ? (
                        <form
                          className="flex flex-col gap-2 w-full max-w-md"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                              const token = sessionStorage.getItem("token");
                              const res = await fetch(`/api/tasks/epics/`, {
                                method: "PUT",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  epicId: epic.epicId,
                                  title: editForm.title,
                                  description: editForm.description,
                                  status: editForm.status,
                                }),
                              });
                              if (!res.ok) throw new Error("No se pudo editar el epic");
                              setEditEpicId(null);
                              fetchEpics();
                              alert("Epic editado");
                            } catch {
                              alert("Error al editar el epic");
                            }
                          }}
                        >
                          <input
                            className="border rounded p-1 text-black"
                            value={editForm.title}
                            onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                            required
                          />
                          <textarea
                            className="border rounded p-1 text-black"
                            value={editForm.description}
                            onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                            required
                          />
                          <select
                            className="border rounded p-1 text-black"
                            value={editForm.status}
                            onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                            required
                          >
                            <option value="ToDo">ToDo</option>
                            <option value="InProgress">InProgress</option>
                            <option value="Done">Done</option>
                          </select>
                          <div className="flex gap-2">
                            <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-800">Guardar</button>
                            <button type="button" className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-600" onClick={() => setEditEpicId(null)}>Cancelar</button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setEditEpicId(epic.epicId);
                            setEditForm({ title: epic.title, description: epic.description, status: epic.status });
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 font-semibold"
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpicPopup;