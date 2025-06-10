import React, { useEffect, useState } from "react";

type TaskUpdateContent = {
  title?: string;
  description?: string;
  epicId?: number;
  priority?: string;
  status?: string;
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

  // Ya no se llama a fetchTasks, ya que no se usa el <select>
  useEffect(() => {
    // Aquí puedes dejar vacío el useEffect o eliminarlo
  }, []);

  const handleSearch = async () => {
    if (!taskId) {
      alert("Selecciona una tarea válida");
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
      setFormData({
        title: data.title,
        description: data.description,
        epicId: typeof data.epic_id === "number" ? data.epic_id : null,
        priority: typeof data.priority === "string" ? data.priority : "Low",
        status: data.status ?? "",
        type: data.type,
        estimated_deadline:
          (data.estimated_deadline ?? data.estimatedDeadline)?.split("T")[0] ??
          "",
        real_deadline:
          (data.real_deadline ?? data.realDeadline)?.split("T")[0] ?? "",
        user_points: data.user_points ?? data.userPoints,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loaded) {
      alert("Primero busca la tarea");
      return;
    }
    try {
      const payload = {
        ...formData,
        estimated_deadline: formData.estimated_deadline ?? null,
        real_deadline: formData.real_deadline ?? null,
        epic_id: formData.epicId ?? null,
        user_points: formData.user_points ?? null,
        priority: formData.priority ?? "Low",
        status: formData.status,
      };
      delete payload.epicId;
      console.log(payload);

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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Editar Tarea</h2>

        {/* Solo campo para ingresar ID manualmente */}
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            min={0}
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

        {/* Formulario solo si la tarea fue cargada */}
        {loaded && (
          <form onSubmit={handleSubmit} className="space-y-3 text-black ">
            <div>
              <label>Title</label>
              <input
                name="title"
                value={formData.title ?? ""}
                onChange={handleChange}
                placeholder="Title"
                className="input input-bordered rounded border-1 w-full"
                required
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description ?? ""}
                onChange={handleChange}
                placeholder="Description"
                className="textarea textarea-bordered rounded border-1 w-full"
                rows={3}
                required
              />
            </div>
            <div>
              <label>EpicId</label>
              <input
                name="epicId"
                min="1"
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
            </div>
            <div>
              <label>Priority</label>
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
            </div>
            <div>
              <label>Status</label>
              <select
                name="status"
                value={formData.status ?? ""}
                onChange={handleChange}
                className="select select-bordered rounded border-1 w-full"
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="ToDo">To-do</option>
                <option value="InProgress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label>Type</label>
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
            </div>
            <div>
              <label>Estimated Deadline</label>
              <input
                name="estimated_deadline"
                type="date"
                value={formData.estimated_deadline ?? ""}
                onChange={handleChange}
                className="input input-bordered rounded border-1 w-full"
              />
            </div>
            <div>
              <label>Real Deadline</label>
              <input
                name="real_deadline"
                type="date"
                value={formData.real_deadline ?? ""}
                onChange={handleChange}
                className="input input-bordered rounded border-1 w-full"
              />
            </div>
            <div>
              <label>UserPoints</label>
              <input
                name="user_points"
                type="number"
                min="1"
                value={formData.user_points ?? ""}
                onChange={handleChange}
                placeholder="User Points"
                className="input input-bordered rounded border-1 w-full"
              />
            </div>
            <div>
              <label>Estimated Hours</label>
              <input
                name="estimatedHours"
                type="number"
                min="1"
                value={formData.estimatedHours ?? ""}
                onChange={handleChange}
                placeholder="Estimated Hours"
                className="input input-bordered rounded border-1 w-full"
              />
            </div>
            <div>
              <label>Real Hours</label>
              <input
                name="realHours"
                type="number"
                min="1"
                value={formData.realHours ?? ""}
                onChange={handleChange}
                placeholder="Real Hours"
                className="input input-bordered rounded border-1 w-full"
              />
            </div>
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
