import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BarChartMulti from "../components/BarChartMulti";
import BarChartSprint from "../components/BarChartSprint";
import TaskTable from "../components/TaskTable";

function KPI() {
  const horasData = [
    { sprint: "Sprint 1", Juan: 35, Mary: 30, Luis: 40, Josie: 28 },
    { sprint: "Sprint 2", Juan: 40, Mary: 32, Luis: 38, Josie: 30 },
    { sprint: "Sprint 3", Juan: 38, Mary: 35, Luis: 36, Josie: 33 },
    { sprint: "Sprint 4", Juan: 42, Mary: 34, Luis: 39, Josie: 31 },
  ];
  const tareasData = [
    { sprint: "Sprint 1", Juan: 10, Mary: 8, Luis: 12, Josie: 9 },
    { sprint: "Sprint 2", Juan: 12, Mary: 9, Luis: 11, Josie: 10 },
    { sprint: "Sprint 3", Juan: 11, Mary: 10, Luis: 10, Josie: 12 },
    { sprint: "Sprint 4", Juan: 13, Mary: 11, Luis: 12, Josie: 11 },
  ];
  const mockTasks = [
    {
      name: "Realizar video de demo para Release Version 1",
      developer: "Cristobal Camarena",
      estimated: 1,
      actual: 1,
    },
    {
      name: "Implementar dashboard de KPIs por desarrollador",
      developer: "Josue Galindo",
      estimated: 3,
      actual: 3,
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
              <BarChartSprint />
            </div>
            <div>
              <BarChartMulti
                data={horasData}
                dataKeys={["Juan", "Mary", "Luis", "Josie"]}
                xAxisKey="sprint"
                yAxisLabel="Horas trabajadas"
              />
            </div>
            <div>
              <BarChartMulti
                data={tareasData}
                dataKeys={["Juan", "Mary", "Luis", "Josie"]}
                xAxisKey="sprint"
                yAxisLabel="Tareas completadas"
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
