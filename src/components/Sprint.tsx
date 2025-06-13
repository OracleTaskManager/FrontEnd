import { useEffect, useState } from "react";

interface SprintProps {
  sprintId?: number;
  name: string;
  startDate: string;
  endDate: string;
  onDelete?: (sprintId: number) => void;
}

function formatForDatetimeLocal(isoString: string): string {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000; // Ajuste a la zona local
  const localISOTime = new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16); // Recorta a "YYYY-MM-DDTHH:MM"
  return localISOTime;
}

export default function Sprint({
  sprintId,
  name,
  startDate,
  endDate,
  onDelete,
}: SprintProps) {
  const jwtToken = sessionStorage.getItem("token");

  // To assign/unassign tasks to sprint
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksAssigned, setTasksAssigned] = useState<any[]>([]);
  const [tasksUnassigned, setTasksUnassigned] = useState<any[]>([]);
  const [selectedTaskToAssign, setSelectedTaskToAssign] = useState<
    number | null
  >(null);
  const [selectedTaskToRemove, setSelectedTaskToRemove] = useState<
    number | null
  >(null);
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]);

  // Tareas filtradas para mostrar a la hora de agregar al sprint
  const unassignedTasks = tasks.filter(
    (task) => !assignedTasks.some((t) => t.taskId === task.taskId)
  );

  // Estado para alternar entre “ver” y “editar”
  const [isEditing, setIsEditing] = useState(false);

  // Inicializamos formData SIEMPRE con strings (no undefined)
  const [formData, setFormData] = useState({
    name: name ?? "",
    startDate: startDate ?? "",
    endDate: endDate ?? "",
  });

  // Obtener Tareas
  useEffect(() => {
    if (!sprintId) return;

    const fetchAllTasks = async () => {
      try {
        const res = await fetch("/api/tasks/tasks/all", {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const all = await res.json();
        setTasks(all);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchSprintTasks = async () => {
      try {
        const res = await fetch(`/api/tasks/tasksprint/${sprintId}/tasks`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const sprintTasks = await res.json();
        setAssignedTasks(sprintTasks);
      } catch (error) {
        console.error("Error fetching tasks for sprint:", error);
      }
    };

    fetchAllTasks();
    fetchSprintTasks();
  }, [sprintId]);

  const assignTaskToSprint = async (taskId: number) => {
    try {
      const response = await fetch("/api/tasks/tasksprint/add", {
        method: "POST",
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, sprintId }),
      });

      if (!response.ok) throw new Error("Error assigning task");

      const assignedTask = tasksUnassigned.find((t) => t.id === taskId);
      if (assignedTask) {
        setTasksAssigned((prev) => [...prev, { ...assignedTask, sprintId }]);
        setTasksUnassigned((prev) => prev.filter((t) => t.id !== taskId));
      }

      setSelectedTaskToAssign(null);
    } catch (error) {
      console.error("Error assigning task to sprint:", error);
    }
  };

  const removeTaskFromSprint = async (taskId: number) => {
    try {
      const response = await fetch("/api/tasks/tasksprint/remove", {
        method: "DELETE",
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId, sprintId }),
      });

      if (!response.ok) throw new Error("Error deleting task");

      const removedTask = tasksAssigned.find((t) => t.id === taskId);
      if (removedTask) {
        setTasksAssigned((prev) => prev.filter((t) => t.id !== taskId));
        setTasksUnassigned((prev) => [
          ...prev,
          { ...removedTask, sprintId: null },
        ]);
      }

      setSelectedTaskToRemove(null);
    } catch (error) {
      console.error("Error deleting task from sprint:", error);
    }
  };

  // Cuando el componente carga o cambia el sprintId
  useEffect(() => {
    if (sprintId) {
      // fetchAssignedTasks();
    }
  }, [sprintId]);

  // Evita que en algún render inicial los inputs reciban un value undefined.
  useEffect(() => {
    setFormData({
      name: name ?? "",
      startDate: startDate ? formatForDatetimeLocal(startDate) : "",
      endDate: endDate ? formatForDatetimeLocal(endDate) : "",
    });
  }, [name, startDate, endDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restauramos los valores originales en caso de “Cancelar”
    setFormData({
      name: name ?? "",
      startDate: startDate ?? "",
      endDate: endDate ?? "",
    });
  };

  const handleSave = async () => {
    if (!sprintId) {
      console.error("There is no sprintId");
      return;
    }

    // --- AQUÍ ES DONDE HACEMOS LA TRANSFORMACIÓN ---
    let formattedStartDate = null;
    let formattedEndDate = null;

    if (formData.startDate) {
      const date = new Date(formData.startDate);
      // Convertimos a UTC y formateamos a ISO 8601 con milisegundos y offset +00:00
      // .toISOString() ya devuelve el formato "YYYY-MM-DDTHH:MM:SS.sssZ" (la 'Z' indica UTC)
      // Reemplazamos 'Z' con '+00:00' para que coincida exactamente con tu ejemplo.
      formattedStartDate = date.toISOString().replace("Z", "+00:00");
    }

    if (formData.endDate) {
      const date = new Date(formData.endDate);
      formattedEndDate = date.toISOString().replace("Z", "+00:00");
    }
    // ----------------------------------------------

    // Payload para el PUT
    const payload = {
      sprintId,
      name: formData.name,
      startDate: formattedStartDate, // Usamos la fecha ya formateada
      endDate: formattedEndDate, // Usamos la fecha ya formateada
    };

    try {
      const response = await fetch(`/api/tasks/sprints/${sprintId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(
          "Error updating sprint (status:",
          response.status,
          "):",
          text
        );
        return;
      }

      // Si el servidor responde con 204 No Content, evitamos hacer response.json()
      if (response.status !== 204) {
        const updatedSprint = await response.json();
        console.log("Sprint updated:", updatedSprint);
      } else {
        console.log("Sprint updated (204 No Content).");
      }

      // Cerramos el modo edición
      setIsEditing(false);
    } catch (error) {
      console.error("Error on fetch PUT:", error);
    }
  };

  const handleDelete = async () => {
    if (!sprintId) {
      console.error("There is no sprintId");
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/tasks/sprints/?sprintId=${sprintId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(
          "Error deleting sprint (status:",
          response.status,
          "):",
          text
        );
        return;
      }

      alert("Sprint deleted succesfully!");
      if (onDelete && sprintId) {
        onDelete(sprintId); // Notifica al padre
      }
    } catch (error) {
      console.error("Error deleting sprint:", error);
    }
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50 mb-1.5 mt-1.5">
      <p className="text-sm text-gray-500">Sprint ID: {sprintId}</p>

      {isEditing ? (
        <div className="flex flex-col gap-2 text-black">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
            placeholder="Nombre del Sprint"
          />
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="">
          <h2 className="text-black text-lg font-semibold">{name}</h2>
          <p className="text-black">
            StartDate: {new Date(startDate).toLocaleString()}
          </p>
          <p className="text-black">
            EndDate: {new Date(endDate).toLocaleString()}
          </p>

          <button
            onClick={handleEditClick}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="mt-2 ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}

      {/* Asignar / Eliminar tareas del sprint */}
      <div className="mt-4">
        <label className="block mb-1 text-black">Assign task to sprint:</label>
        <select
          value={selectedTaskToAssign!}
          onChange={(e) => setSelectedTaskToAssign(Number(e.target.value))}
          className=" w-72 border rounded px-2 py-1 text-black"
        >
          <option value="">Select a task</option>
          {unassignedTasks.map((task) => (
            <option key={task.taskId} value={task.taskId}>
              {task.title}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (selectedTaskToAssign != null) {
              assignTaskToSprint(selectedTaskToAssign).then(() => {
                // Refrescamos tareas del sprint después de asignar
                setSelectedTaskToAssign(null);
                if (sprintId) {
                  fetch(`/api/tasks/tasksprint/${sprintId}/tasks`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                  })
                    .then((res) => res.json())
                    .then(setAssignedTasks);
                }
              });
            }
          }}
          className="ml-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Assign to Sprint
        </button>
      </div>

      <div className="mt-4">
        <label className="block mb-1 text-black">
          Remove task from sprint:
        </label>
        <select
          value={selectedTaskToRemove!}
          onChange={(e) => setSelectedTaskToRemove(Number(e.target.value))}
          className="w-72 border rounded px-2 py-1 text-black"
        >
          <option value="">Select a task</option>
          {assignedTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (selectedTaskToRemove != null) {
              removeTaskFromSprint(selectedTaskToRemove).then(() => {
                // Refrescamos tareas del sprint después de eliminar
                setSelectedTaskToRemove(null);
                if (sprintId) {
                  fetch(`/api/tasks/tasksprint/${sprintId}/tasks`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                  })
                    .then((res) => res.json())
                    .then(setAssignedTasks);
                }
              });
            }
          }}
          className="ml-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
