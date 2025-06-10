import React, { useState, useEffect } from "react";
interface AssignTaskToUserProps {
  onTaskAssigned: () => void;
}
const AssignTaskToUser: React.FC<AssignTaskToUserProps> = ({
  onTaskAssigned,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const jwtToken = sessionStorage.getItem("token");

  useEffect(() => {
    if (showModal) {
      fetchTasks();
      fetchUsers();
    }
  }, [showModal]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks/tasks/all", {
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/auth/users", {
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleAssign = async () => {
    if (!selectedTaskId || !selectedUserId) {
      alert("Select a user and a task");
      return;
    }

    try {
      const response = await fetch("/api/tasks/taskassignments/add", {
        method: "POST",
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUserId,
          taskId: selectedTaskId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Tarea asignada exitosamente");
      onTaskAssigned(); // <-- Aquí actualizas la lista de tareas
      setShowModal(false);
    } catch (error) {
      console.error("Error al asignar la tarea:", error);
      alert("Error al asignar la tarea");
    }
  };

  const checkIfTaskIsAssigned = async (userId: number, taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/taskassignments/`, {
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("No se pudo obtener asignaciones");

      const assignments = await response.json(); // Suponemos que es un array
      return assignments.some(
        (assignment: any) =>
          assignment.taskId === taskId && assignment.userId === userId
      );
    } catch (error) {
      console.error("Error verificando asignación:", error);
      return false;
    }
  };

  const handleDeleteAssignedTask = async () => {
    if (!selectedTaskId || !selectedUserId) {
      alert("Select a user and a task");
      return;
    }

    const isAssigned = await checkIfTaskIsAssigned(
      selectedUserId,
      selectedTaskId
    );

    if (!isAssigned) {
      alert("Esta tarea no está asignada a ese usuario.");
      return;
    }

    try {
      const response = await fetch("/api/tasks/taskassignments/remove", {
        method: "DELETE",
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUserId,
          taskId: selectedTaskId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Task unassigned correctly!");
      onTaskAssigned(); // Recargar vista o tareas actualizadas
      setShowModal(false);
    } catch (error) {
      console.error("Error al desasignar la tarea:", error);
      alert("Error al desasignar la tarea");
    }
  };

  return (
    <>
      <div className="">
        <button
          onClick={() => setShowModal(true)}
          className="text-white px-4 py-2 rounded-lg transition h-12"
        >
          Assign/Unassign Task
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Assign/Unassign a Task to a User
            </h2>

            <div className="mb-4 text-gray-800">
              <label className="block mb-1 font-semibold">Select Task</label>
              <select
                onChange={(e) => setSelectedTaskId(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">-- Choose a Task --</option>
                {tasks.map((task) => (
                  <option key={task.taskId} value={task.taskId}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 text-gray-800">
              <label className="block mb-1 font-semibold">Select User</label>
              <select
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">-- Choose a User --</option>
                {users.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssign}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Assign Task
            </button>
            <button
              onClick={handleDeleteAssignedTask}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 mt-2 transition"
            >
              Unassign Task
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignTaskToUser;
