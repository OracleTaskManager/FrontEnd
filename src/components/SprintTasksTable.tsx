import React, { useEffect, useState } from "react";

interface SprintTask {
  id: number;
  title: string;
  description: string;
  epic_id: number;
  priority: string;
  status: string;
  type: string;
  estimated_deadline: string;
  real_deadline: string;
  realHours: number | null;
  estimatedHours: number | null;
  user_points: number;
}

interface SprintTasksBySprint {
  [sprintId: string]: SprintTask[];
}

const SprintTasksTable: React.FC = () => {
  const [tasksBySprint, setTasksBySprint] = useState<SprintTasksBySprint>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jwtToken = sessionStorage.getItem("token");
  const [sprints, setSprints] = useState<{ sprintId: number; name: string }[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);

  useEffect(() => {
    // Usar ShowAllSprints como referencia para obtener los sprints
    const fetchSprints = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/tasks/sprints/", {
          headers: {
            Authorization: `${jwtToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Error al obtener sprints");
        const data = await response.json();
        const normalized = data.map((sprint: any) => ({
          sprintId: sprint.sprintId,
          name: sprint.name,
        }));
        setSprints(normalized);
        // Ahora obtener las tareas por sprint
        const tasksBySprintTemp: SprintTasksBySprint = {};
        for (const sprint of normalized) {
          const res = await fetch(`/api/tasks/tasksprint/${sprint.sprintId}/tasks`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          if (!res.ok) continue;
          const data = await res.json();
          tasksBySprintTemp[sprint.sprintId] = Array.isArray(data) ? data : [];
        }
        setTasksBySprint(tasksBySprintTemp);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchSprints();
  }, [jwtToken]);

  return (
    <div className="mt-8 flex">
      {/* Sidebar Sprint */}
      <aside className="w-64 bg-gray-100 border-r border-gray-300 rounded-l-lg shadow h-fit mr-6 p-4">
        <h2 className="text-lg font-bold mb-4 text-black">Sprints</h2>
        <ul>
          {sprints.map((sprint) => (
            <li
              key={sprint.sprintId}
              className={`mb-2 cursor-pointer ${selectedSprintId === sprint.sprintId ? 'bg-purple-200 rounded px-2 py-1 font-bold' : ''}`}
              onClick={() => setSelectedSprintId(sprint.sprintId)}
            >
              <span className="text-black font-medium">{sprint.name ? sprint.name : `Sprint ${sprint.sprintId}`}</span>
            </li>
          ))}
        </ul>
      </aside>
      {/* Task table */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4 text-black">Tasks by Sprint</h2>
        {loading && <p className="text-black">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && sprints.length === 0 && (
          <p className="text-black">No tasks to show.</p>
        )}
        {!loading && !error && selectedSprintId && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-purple-800">
              {sprints.find(s => s.sprintId === selectedSprintId)?.name || `Sprint ${selectedSprintId}`}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border text-black">ID</th>
                    <th className="px-4 py-2 border text-black">Title</th>
                    <th className="px-4 py-2 border text-black">Description</th>
                    <th className="px-4 py-2 border text-black">Priority</th>
                    <th className="px-4 py-2 border text-black">Status</th>
                    <th className="px-4 py-2 border text-black">Type</th>
                    <th className="px-4 py-2 border text-black">Estimated Deadline</th>
                    <th className="px-4 py-2 border text-black">Real Deadline</th>
                    <th className="px-4 py-2 border text-black">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {tasksBySprint[selectedSprintId]?.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center text-gray-500 py-2">No tasks in this sprint.</td>
                    </tr>
                  ) : (
                    tasksBySprint[selectedSprintId]?.map(task => (
                      <tr key={task.id}>
                        <td className="px-4 py-2 border text-black">{task.id}</td>
                        <td className="px-4 py-2 border text-black">{task.title}</td>
                        <td className="px-4 py-2 border text-black">{task.description}</td>
                        <td className="px-4 py-2 border text-black">{task.priority}</td>
                        <td className="px-4 py-2 border text-black">{task.status}</td>
                        <td className="px-4 py-2 border text-black">{task.type}</td>
                        <td className="px-4 py-2 border text-black">{task.estimated_deadline?.split("T")[0]}</td>
                        <td className="px-4 py-2 border text-black">{task.real_deadline?.split("T")[0]}</td>
                        <td className="px-4 py-2 border text-black">{task.user_points}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintTasksTable;
