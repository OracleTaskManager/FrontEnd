import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Ticket from "../components/Ticket";
import CircularProgress from "../components/CircularProgress";
import BarChartSprint from "../components/BarChartSprint";
import BarChartMulti from "../components/BarChartMulti";

interface Ticketx {
  taskId: number;
  title: string;
  description: string;
  priority: "Low" | "Mid" | "High";
  status: "ToDo" | "InProgress" | "Finished";
  estimatedDeadline: string;
  realDeadline: string;
  estimatedHours: string | null;
  realHours: string | null;
  user_points: number;
}

function DashboardDev() {
  const [tickets, setTickets] = useState<Ticketx[]>([]);
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
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPcmFjbGUgUHJvamVjdCIsImlkIjo2MSwicm9sZSI6Ik1hbmFnZXIiLCJ0ZWxlZ3JhbUNoYXRJZCI6MTg2MDkxMzEyMCwiZXhwIjoxNzQ3MzEwMDQ5fQ.h2ypz6neBUUlx9IhuxWpdjyvXhQO8kPlrTDReBGy30w";

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tasks/tasks/all", {
          headers: {
            Authorization: `${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const maxTicketsToShow = 4;
  const mainTicket = tickets[0];
  const otherTickets = tickets.slice(1, maxTicketsToShow);

  const mapStatus = (status: string): "To-do" | "In Progress" | "Finished" => {
    switch (status) {
      case "ToDo":
        return "To-do";
      case "InProgress":
        return "In Progress";
      case "Finished":
        return "Finished";
      default:
        return "To-do";
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      <Navbar pageTitle="Home" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto bg-white">
          {mainTicket && (
            <Ticket
              title={mainTicket.title}
              publishedDate={mainTicket.estimatedDeadline.slice(0, 10)}
              status={mapStatus(mainTicket.status)}
              priority={mainTicket.priority}
              description={mainTicket.description}
              isMain={true}
            />
          )}

          <div className="mt-6 flex gap-8">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-semibold text-black">
                Section Tickets
              </h2>
              {otherTickets.map((ticket, index) => (
                <Ticket
                  key={index}
                  title={ticket.title}
                  publishedDate={ticket.estimatedDeadline.slice(0, 10)}
                  status={mapStatus(ticket.status)}
                  priority={ticket.priority}
                  description={ticket.description}
                />
              ))}
            </div>

            <div className="flex-1/12 items-center justify-center">
              <BarChartSprint />
              <BarChartMulti
                data={horasData}
                dataKeys={["Juan", "Mary", "Luis", "Josie"]}
                xAxisKey="sprint"
                yAxisLabel="Horas trabajadas"
              />
              <BarChartMulti
                data={tareasData}
                dataKeys={["Juan", "Mary", "Luis", "Josie"]}
                xAxisKey="sprint"
                yAxisLabel="Tareas completadas"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardDev;
