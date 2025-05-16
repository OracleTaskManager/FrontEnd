// import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BarChartMulti from "../components/BarChartMulti";
import BarChartSprint from "../components/BarChartSprint";
import TaskTable from "../components/TaskTable";

const fetchAndFormatHoursBySprint = async (token: string) => {
  const res = await fetch("/api/tasks/reports/hours/sprints/users", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch hours data");

  const data = await res.json();

  const hoursPerSprintMap: Record<string, number> = {};

  data.forEach(
    ({ sprintName, total }: { sprintName: string; total: number }) => {
      if (!hoursPerSprintMap[sprintName]) {
        hoursPerSprintMap[sprintName] = 0;
      }
      hoursPerSprintMap[sprintName] += total;
    }
  );

  return Object.entries(hoursPerSprintMap).map(([sprint, hours]) => ({
    sprint,
    hours,
  }));
};

function KPI() {
  const [hoursData, setHoursData] = useState<
    { sprint: string; hours: number }[]
  >([]);
  const jwtToken = sessionStorage.getItem("token");
  const fetchTasksCompletedByUserPerSprint = async () => {
    const res = await fetch(
      "/api/tasks/reports/tasks/completed/sprints/users",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const data = await res.json();

    return data.map((entry) => ({
      userName: entry.userName,
      sprintName: entry.sprintName,
      total: entry.totalTasksCompleted,
    }));
  };

  const fetchHoursByUserPerSprint = async () => {
    const res = await fetch("/api/tasks/reports/hours/sprints/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const data = await res.json();

    return data.map((entry) => ({
      userName: entry.userName,
      sprintName: entry.sprintName,
      total: entry.totalHours,
    }));
  };

  useEffect(() => {
    const loadHours = async () => {
      try {
        const formatted = await fetchAndFormatHoursBySprint(jwtToken);
        setHoursData(formatted);
      } catch (err) {
        console.error("Error loading hours data", err);
      }
    };
    loadHours();
  }, [jwtToken]);

  const mockTasks = [
    {
      id: 1,
      name: "Diseñar login",
      assignedTo: "Carlos",
      sprint: "Sprint 1",
      status: "Completado",
    },
    {
      id: 2,
      name: "Implementar dashboard",
      assignedTo: "María",
      sprint: "Sprint 2",
      status: "En progreso",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      {/* Navbar fijo arriba */}
      <Navbar pageTitle="KPIs" />

      <div className="flex flex-1">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar />

        <main className="flex-1">
          <h2 className="text-2xl font-semibold text-black p-5">KPIs</h2>
          <div className="flex flex-wrap items-center justify-center p-4 gap-4">
            <div>
              <BarChartSprint data={hoursData} />
            </div>
            <div>
              <BarChartMulti
                title="Horas trabajadas por miembro"
                fetchData={fetchHoursByUserPerSprint}
              />
            </div>
            <div>
              <BarChartMulti
                title="Tareas completadas por miembro"
                fetchData={fetchTasksCompletedByUserPerSprint}
              />
            </div>
            <div className="w-full">
              <TaskTable tasks={mockTasks} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default KPI;
