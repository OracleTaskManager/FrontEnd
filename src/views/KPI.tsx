import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BarChartMulti from "../components/BarChartMulti";
import BarChartSprint from "../components/BarChartSprint";
import TaskTable from "../components/TaskTable";

function KPI() {
  const horasData = [
    {
      sprint: "Sprint 1",
      Rafael: 35,
      Sayid: 30,
      Cesar: 40,
      Iñaki: 28,
      Ernesto: 25,
    },
    {
      sprint: "Sprint 2",
      Rafael: 40,
      Sayid: 32,
      Cesar: 38,
      Iñaki: 30,
      Ernesto: 25,
    },
    {
      sprint: "Sprint 3",
      Rafael: 38,
      Sayid: 35,
      Cesar: 36,
      Iñaki: 33,
      Ernesto: 25,
    },
    {
      sprint: "Sprint 4",
      Rafael: 42,
      Sayid: 34,
      Cesar: 39,
      Iñaki: 31,
      Ernesto: 25,
    },
    {
      sprint: "Sprint 5",
      Rafael: 35,
      Sayid: 30,
      Cesar: 40,
      Iñaki: 28,
      Ernesto: 25,
    },
    {
      sprint: "Sprint 6",
      Rafael: 40,
      Sayid: 32,
      Cesar: 38,
      Iñaki: 30,
      Ernesto: 25,
    },
    {
      sprint: "Sprint 7",
      Rafael: 38,
      Sayid: 35,
      Cesar: 36,
      Iñaki: 33,
      Ernesto: 25,
    },
    {
      sprint: "Sprint 8",
      Rafael: 42,
      Sayid: 34,
      Cesar: 39,
      Iñaki: 31,
      Ernesto: 25,
    },
    {
      sprint: "Sprint 9",
      Rafael: 38,
      Sayid: 35,
      Cesar: 36,
      Iñaki: 33,
      Ernesto: 25,
    },
    {
      sprint: "Sprint 10",
      Rafael: 42,
      Sayid: 34,
      Cesar: 39,
      Iñaki: 31,
      Ernesto: 25,
    },
  ];
  const tareasData = [
    {
      sprint: "Sprint 1",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
    {
      sprint: "Sprint 2",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
    {
      sprint: "Sprint 3",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
    {
      sprint: "Sprint 4",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
    {
      sprint: "Sprint 5",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
    {
      sprint: "Sprint 6",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
    {
      sprint: "Sprint 7",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
    {
      sprint: "Sprint 8",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
    {
      sprint: "Sprint 9",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
    {
      sprint: "Sprint 10",
      Rafael: 6,
      Sayid: 7,
      Cesar: 10,
      Iñaki: 9,
      Ernesto: 5,
    },
  ];
  const mockTasks = [
    {
      name: "Realizar video de demo para Sprint",
      developer: "Ernesto Puga",
      estimated: 1,
      actual: 1,
    },
    {
      name: "Login de Telegram",
      developer: "Sayid Valdivia",
      estimated: 1,
      actual: 1,
    },
    {
      name: "Implementar dashboard de KPIs por desarrollador",
      developer: "Rafael Romo",
      estimated: 3,
      actual: 2,
    },
    {
      name: "Desarrollo de API",
      developer: "Iñaki González",
      estimated: 3,
      actual: 2,
    },
    {
      name: "Deployment del Back y Front",
      developer: "Cesar Mecinas",
      estimated: 3,
      actual: 2,
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
                dataKeys={["Rafael", "Sayid", "Cesar", "Iñaki", "Ernesto"]}
                xAxisKey="sprint"
                yAxisLabel="Horas trabajadas"
              />
            </div>
            <div>
              <BarChartMulti
                data={tareasData}
                dataKeys={["Rafael", "Sayid", "Cesar", "Iñaki", "Ernesto"]}
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
