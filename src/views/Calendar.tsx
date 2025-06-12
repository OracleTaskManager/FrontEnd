import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import SprintTasksTable from "../components/SprintTasksTable";

const Calendar = () => {
  interface Ticketx {
    taskId: number;
    id: string;
    title: string;
    description: string;
    epic_id: string;
    priority: string;
    status: string;
    estimatedDeadline: string;
    realDeadline: string;
    estimatedHours: number | null;
    realHours: number;
    user_points: number;
  }
  interface TaskForGantt {
    id: string;
    name: string;
    start: Date;
    end: Date;
    type: "task";
    progress: number;
  }
  const [tasks, setTasks] = useState<TaskForGantt[]>([]);
  const [blockedTasks, setBlockedTasks] = useState<any[]>([]);
  const [loadingBlockedTasks, setLoadingBlockedTasks] = useState(false);
  const jwtToken = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!jwtToken) {
        console.error("No JWT token found");
        setTasks([]);
        return;
      }

      try {
        const response = await fetch("/api/tasks/tasks/my-tasks", {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Error en la respuesta de la API:", response.status);
          setTasks([]);
          return;
        }

        const data = await response.json();
        console.log("Datos raw de API:", data);

        if (!Array.isArray(data)) {
          console.error("La respuesta de la API no es un arreglo");
          setTasks([]);
          return;
        }

        // Paso 1: Parseo seguro a Ticketx[]
        const parsedTasks: Ticketx[] = data.map(
          (task: any): Ticketx => ({
            taskId: task.taskId,
            id: task.id,
            title: task.title,
            description: task.description,
            epic_id: task.epic_id,
            priority: task.priority,
            status: task.status,
            estimatedDeadline: task.estimated_deadline,
            realDeadline: task.real_deadline,
            estimatedHours: task.estimatedHours,
            realHours: task.realHours,
            user_points: task.user_points,
          })
        );

        // Paso 2: Filtrado y transformación a tareas válidas para Gantt
        const validTasks: TaskForGantt[] = parsedTasks
          .filter((task) => {
            if (!task.estimatedDeadline || !task.realDeadline) {
              console.warn("Tarea sin fechas filtrada", task);
              return false;
            }
            const start = new Date(task.estimatedDeadline);
            const end = new Date(task.realDeadline);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
              console.warn("Tarea con fecha inválida filtrada", task);
              return false;
            }
            if (start > end) {
              console.warn("Tarea con start > end filtrada", task);
              return false;
            }
            return true;
          })
          .map((task) => ({
            id: task.taskId.toString(),
            name: task.title,
            start: new Date(task.estimatedDeadline),
            end: new Date(task.realDeadline),
            type: "task",
            progress: 0,
          }));

        console.log(
          "Fechas de tarea 0:",
          parsedTasks[0].estimatedDeadline,
          parsedTasks[0].realDeadline
        );

        setTasks(validTasks);
        console.log("Tareas mapeadas válidas:", validTasks);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [jwtToken]);

  useEffect(() => {
    if (!jwtToken) return;
    setLoadingBlockedTasks(true);
    import("../fetchEndpoints/fetchTasksBlockedBy").then(
      ({ fetchTasksBlockedBy }) => {
        Promise.all(
          tasks.map(async (task: any) => {
            try {
              const blocked = await fetchTasksBlockedBy(task.id, jwtToken);
              return { taskId: task.id, blocked };
            } catch {
              return { taskId: task.id, blocked: [] };
            }
          })
        ).then((results) => {
          setBlockedTasks(results.filter((r) => r.blocked.length > 0));
          setLoadingBlockedTasks(false);
        });
      }
    );
  }, [tasks, jwtToken]);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      <Navbar pageTitle="Calendar" />

      <div className="flex flex-1">
        {/* Sidebar fijo */}
        <Sidebar />

        {/* Contenido principal */}
        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            My Tasks
          </h2>

          <div className="overflow-auto border rounded bg-white shadow">
            <div className="gantt-wrapper !text-black">
              {tasks.length === 0 ? (
                <p>No tickets to show</p>
              ) : (
                <>
                  {console.log("Tasks pasadas al Gantt:", tasks)}
                  <Gantt
                    tasks={tasks}
                    viewMode={ViewMode.Month}
                    columnWidth={65}
                    listCellWidth="170px"
                    barCornerRadius={10}
                    fontSize="14px"
                    barProgressColor="#0a66c2"
                    barBackgroundColor="#a0cde8"
                    barBackgroundSelectedColor="#609cc2"
                    barProgressSelectedColor="#004a99"
                  />
                  {/* Mostrar tareas que este usuario está bloqueando */}
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Tareas que estás bloqueando
                    </h3>
                    {loadingBlockedTasks ? (
                      <p className="text-yellow-600">Cargando...</p>
                    ) : blockedTasks.length === 0 ? (
                      <p className="text-gray-500">
                        No estás bloqueando ninguna tarea actualmente.
                      </p>
                    ) : (
                      <ul className="list-disc ml-6">
                        {blockedTasks.map(({ taskId, blocked }) => (
                          <li key={taskId}>
                            <span className="font-bold">
                              {tasks.find((t) => t.id === taskId)?.name ||
                                `Tarea ${taskId}`}
                            </span>{" "}
                            está bloqueando:
                            <ul className="ml-4">
                              {blocked.map((t: any) => (
                                <li key={t.taskId}>
                                  {t.title} (Estado: {t.status})
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabla de tareas por sprint debajo del calendario */}
          <SprintTasksTable />
        </main>
      </div>
    </div>
  );
};

export default Calendar;
