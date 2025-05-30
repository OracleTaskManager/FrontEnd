import React, { useState } from "react";

type TaskUpdateContent = {
  title?: string;
  description?: string;
  epicId?: number;
  priority?: string;
  type?: string;
  estimated_deadline?: string;
  real_deadline?: string;
  user_points?: number;
  estimatedHours?: number;
  realHours?: number;
};

interface EditTaskModalProps {
  onClose: () => void;
  onUpdated: () => void;
  token: string;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  onClose,
  onUpdated,
  token,
}) => {
  const [taskId, setTaskId] = useState<number | "">("");
  const [formData, setFormData] = useState<TaskUpdateContent>({});
  const [loaded, setLoaded] = useState(false);

  // 1) Buscar la tarea por ID
  const handleSearch = async () => {
    if (!taskId) {
      alert("Ingresa un Task ID válido");
      return;
    }
    try {
      const res = await fetch(`/api/tasks/tasks/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Tarea no encontrada");
      const data = await res.json();
      // adaptamos la respuesta a nuestro formData (usando los nombres que devuelve el backend)
      setFormData({
        title: data.title,
        description: data.description,
        epicId: typeof data.epic_id === "number" ? data.epic_id : null,
        priority: typeof data.priority === "string" ? data.priority : "Low",
        type: data.type,
        estimated_deadline:
          (data.estimated_deadline ?? data.estimatedDeadline)?.split("T")[0] ??
          "",
        real_deadline:
          (data.real_deadline ?? data.realDeadline)?.split("T")[0] ?? "",
        userPoints: data.user_points ?? data.userPoints,
        estimatedHours: data.estimatedHours,
        realHours: data.realHours,
      });
      setLoaded(true);
    } catch (err) {
      console.error(err);
      alert("Error al buscar la tarea");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["estimatedHours", "realHours", "user_points", "epicId"].includes(
        name
      )
        ? value === ""
          ? null
          : Number(value)
        : value,
    }));
  };

  // 2) Enviar el PUT para actualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loaded) {
      alert("Primero busca la tarea");
      return;
    }
    try {
      // Preparamos el payload en snake_case para el backend
      const payload = {
        ...formData,
        estimated_deadline: formData.estimated_deadline ?? null,
        real_deadline: formData.real_deadline ?? null,
        epic_id: formData.epicId ?? null,
        user_points: formData.user_points ?? null,
        priority: formData.priority ?? "Low",
      };
      delete payload.epicId;
      delete payload.user_points;
      const res = await fetch(`/api/tasks/tasks/update-task/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      alert("Tarea actualizada!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la tarea");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50  ">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Editar Tarea</h2>

        {/* Paso 1: Buscar por ID */}
        <div className="flex gap-2 mb-4 ">
          <input
            type="number"
            value={taskId}
            onChange={(e) =>
              setTaskId(e.target.value === "" ? "" : +e.target.value)
            }
            placeholder="Task ID"
            className="input input-bordered border-2 rounded flex-1 text-black"
          />
          <button onClick={handleSearch} className="btn btn-secondary">
            Search
          </button>
        </div>

        {/* Paso 2: Formulario de edición */}
        {loaded && (
          <form onSubmit={handleSubmit} className="space-y-3 text-black ">
            <input
              name="title"
              value={formData.title ?? ""}
              onChange={handleChange}
              placeholder="Título"
              className="input input-bordered rounded border-1 w-full"
              required
            />
            <textarea
              name="description"
              value={formData.description ?? ""}
              onChange={handleChange}
              placeholder="Descripción"
              className="textarea textarea-bordered rounded border-1 w-full"
              rows={3}
              required
            />
            <input
              name="epicId"
              type="number"
              value={
                formData.epicId !== undefined && formData.epicId !== null
                  ? formData.epicId
                  : ""
              }
              onChange={handleChange}
              placeholder="Epic ID"
              className="input input-bordered rounded border-1 w-full"
            />
            <select
              name="priority"
              value={formData.priority ?? ""}
              onChange={handleChange}
              className="select select-bordered rounded border-1 w-full"
              required
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              name="type"
              value={formData.type ?? ""}
              onChange={handleChange}
              className="select select-bordered rounded border-1 w-full"
              required
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="Ticket">Ticket</option>
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
            </select>
            <input
              name="estimated_deadline"
              type="date"
              value={formData.estimated_deadline ?? ""}
              onChange={handleChange}
              className="input input-bordered rounded border-1 w-full"
            />
            <input
              name="real_deadline"
              type="date"
              value={formData.real_deadline ?? ""}
              onChange={handleChange}
              className="input input-bordered rounded border-1 w-full"
            />
            <input
              name="user_points"
              type="number"
              value={formData.user_points ?? ""}
              onChange={handleChange}
              placeholder="User Points"
              className="input input-bordered rounded border-1 w-full"
            />
            <input
              name="estimatedHours"
              type="number"
              value={formData.estimatedHours ?? ""}
              onChange={handleChange}
              placeholder="Estimated Hours"
              className="input input-bordered rounded border-1 w-full"
            />
            <input
              name="realHours"
              type="number"
              value={formData.realHours ?? ""}
              onChange={handleChange}
              placeholder="Real Hours"
              className="input input-bordered rounded border-1 w-full"
            />
            <button type="submit" className="btn btn-primary w-full text-white">
              Save changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTaskModal;
