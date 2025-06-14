// import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BarChartMulti from "../components/BarChartMulti";
import BarChartSprint from "../components/BarChartSprint";
import SprintUserTaskViewer from "../components/SprintUserTable";

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
    ({
      sprintName,
      totalHours,
    }: {
      sprintName: string;
      totalHours: number;
    }) => {
      const validTotal = Number(totalHours);
      if (isNaN(validTotal)) {
        console.warn(
          `Invalid total value for sprint "${sprintName}":`,
          totalHours
        );
        return; // salta esta entrada
      }

      if (!hoursPerSprintMap[sprintName]) {
        hoursPerSprintMap[sprintName] = 0;
      }

      hoursPerSprintMap[sprintName] += validTotal;
    }
  );

  return Object.entries(hoursPerSprintMap)
    .map(([sprint, hours]) => ({
      sprint,
      hours,
    }))
    .sort((a, b) => {
      const aNum = parseInt(a.sprint.match(/\d+/)?.[0] || "0");
      const bNum = parseInt(b.sprint.match(/\d+/)?.[0] || "0");
      return aNum - bNum;
    });
};

function KPI() {
  const [hoursData, setHoursData] = useState<
    { sprint: string; hours: number }[]
  >([]);
  const [balance, setBalance] = useState<number | null>(null);
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

    return data.map(
      (entry: {
        userName: string;
        sprintName: string;
        totalTasksCompleted: number;
      }) => ({
        userName: entry.userName,
        sprintName: entry.sprintName,
        total: entry.totalTasksCompleted,
      })
    );
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

    return data
      .map(
        (entry: {
          userName: string;
          sprintName: string;
          totalHours: number;
        }) => ({
          userName: entry.userName,
          sprintName: entry.sprintName,
          total: entry.totalHours,
        })
      )
      .sort((a, b) => {
        const aNum = parseInt(a.sprintName.match(/\d+/)?.[0] || "0");
        const bNum = parseInt(b.sprintName.match(/\d+/)?.[0] || "0");
        return aNum - bNum;
      });
  };

  const fetchBalance = async () => {
    const res = await fetch("/api/tasks/tasks/balance", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch balance");

    const data = await res.json();
    return data.balance;
  };

  useEffect(() => {
    const loadHours = async () => {
      if (!jwtToken) {
        return;
      }
      try {
        const [formattedHours, fetchedBalance] = await Promise.all([
          fetchAndFormatHoursBySprint(jwtToken),
          fetchBalance(),
        ]);
        setHoursData(formattedHours);
        setBalance(fetchedBalance);
      } catch (err) {
        console.error("Error loading hours data", err);
      }
    };
    loadHours();
  }, [jwtToken]);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      {/* Navbar fijo arriba */}
      <Navbar pageTitle="KPIs" />

      <div className="flex flex-1">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar />

        <main className="flex-1">
          <h2 className="text-2xl font-semibold text-black p-5">KPIs</h2>
          <div className="flex flex-col items-center justify-center p-4 gap-4">
            <div>
              <h1 className="text-black">
                This is the amount of money we have saved:{" "}
                {balance !== null ? `$${balance.toFixed(2)}` : "Loading..."}
              </h1>
            </div>
            <div className="">
              <BarChartSprint data={hoursData} />
            </div>
            <div className="w-full max-w-4xl pt-4">
              <BarChartMulti
                title="Hours worked by developer"
                fetchData={fetchHoursByUserPerSprint}
              />
            </div>
            <div className="w-full max-w-4xl pt-4">
              <BarChartMulti
                title="Tasks completed by developer"
                fetchData={fetchTasksCompletedByUserPerSprint}
              />
            </div>
            <div className="w-full">
              <SprintUserTaskViewer jwtToken={jwtToken!} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default KPI;
