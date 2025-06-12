import React, { useEffect, useState } from "react";

interface Sprint {
  sprintId: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  workMode: string;
}

interface TaskReport {
  taskId: number;
  taskTitle: string;
  realHours: number;
  status: string;
}

interface Props {
  jwtToken: string;
}

const SprintUserTaskViewer: React.FC<Props> = ({ jwtToken }) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [tasks, setTasks] = useState<TaskReport[]>([]);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const res = await fetch("/api/tasks/sprints/", {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const data = await res.json();
        setSprints(data);
      } catch (err) {
        console.error("Error al obtener sprints:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/auth/users", {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
      }
    };

    fetchSprints();
    fetchUsers();
  }, [jwtToken]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedSprintId || !selectedUserId) return;

      try {
        const res = await fetch(
          `/api/tasks/reports/hours/sprint/${selectedSprintId}/user/${selectedUserId}`,
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        if (!res.ok) {
          console.error("Error al obtener tareas:", res.status);
          setTasks([]);
          return;
        }

        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Error al hacer fetch de tareas:", err);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [selectedSprintId, selectedUserId, jwtToken]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Tareas por Sprint y Usuario
      </h2>

      <div className="flex gap-4 mb-6">
        <select
          className="border rounded p-2 w-full text-black"
          onChange={(e) => setSelectedSprintId(Number(e.target.value))}
          value={selectedSprintId ?? ""}
        >
          <option value="">Select Sprint</option>
          {sprints.map((s) => (
            <option key={s.sprintId} value={s.sprintId}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 w-full text-black"
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
          value={selectedUserId ?? ""}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.userId} value={u.userId}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {tasks.length > 0 ? (
        <table className="w-full border-collapse border border-black">
          <thead className="bg-black">
            <tr>
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Título</th>
              <th className="border p-2 text-left">Horas Reales</th>
              <th className="border p-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.taskId}>
                <td className="border p-2 text-black">{task.taskId}</td>
                <td className="border p-2 text-black">{task.taskTitle}</td>
                <td className="border p-2 text-black">{task.realHours}</td>
                <td className="border p-2 text-black">{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        selectedSprintId &&
        selectedUserId && (
          <p className="text-black mt-4">
            No hay tareas para esta combinación.
          </p>
        )
      )}
    </div>
  );
};

export default SprintUserTaskViewer;
