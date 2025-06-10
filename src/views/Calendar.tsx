import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import SprintTasksTable from "../components/SprintTasksTable";

const Calendar = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
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
            Authorization: `Bearer ${jwtToken}`, // IMPORTANTE: incluye 'Bearer '
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

        const mappedTasks: Task[] = data
          .filter((task: any) => {
            if (!task) {
              console.warn("Tarea inválida (null/undefined) filtrada", task);
              return false;
            }
            if (!task.estimated_deadline || !task.real_deadline) {
              console.warn("Tarea sin fechas filtrada", task);
              return false;
            }
            const start = new Date(task.estimated_deadline);
            const end = new Date(task.real_deadline);
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
          .map((task: any) => ({
            id: task.id.toString(),
            name: task.title,
            start: new Date(task.estimated_deadline),
            end: new Date(task.real_deadline),
            type: "task",
            progress: 0,
          }));

        console.log("Tareas mapeadas válidas:", mappedTasks);
        setTasks(mappedTasks);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [jwtToken]);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      <Navbar pageTitle="Calendar" />

      <div className="flex flex-1">
        {/* Sidebar fijo */}
        <Sidebar />

        {/* Contenido principal */}
        <main className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            My Tickets
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
