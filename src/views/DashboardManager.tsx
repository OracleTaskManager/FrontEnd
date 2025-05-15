import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Ticket from "../components/Ticket";
import TeamCard from "../components/TeamCard";
import Notification from "../components/Notification";
import CreateTeamModal from "../components/CreateTeamModal";
import BarChartSprint from "../components/BarChartSprint";
import BarChartMulti from "../components/BarChartMulti";
import TaskTable from "../components/TaskTable";

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

type Team = {
  team_id: number;
  team_name: string;
  created_at: string;
};

function DashboardManager() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const jwtToken = sessionStorage.getItem("token");
  // Para debuguear
  // if (jwtToken) {
  //   console.log("Token disponible:", jwtToken);
  // } else {
  //   console.error("No se encontró el token");
  // }

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/auth/teams/myteams", {
          headers: {
            Authorization: `${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }

        const data = await response.json();
        setTeams(data); // Ajusta esto si la respuesta viene en un objeto, como `data.teams`
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  // Deletion of teams
  const handleDeleteTeam = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/auth/teams/?teamId=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete team");
      }

      // Elimina el equipo del estado local
      setTeams((prevTeams) => prevTeams.filter((team) => team.team_id !== id));
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  // Endpoint Tickets
  const [tickets, setTickets] = useState<Ticketx[]>([]);

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

  const maxTicketsToShow = 5;
  const otherTickets = tickets.slice(0, maxTicketsToShow);

  //console.log("Teams cargados:", teams);
  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      <Navbar pageTitle="Home" />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto bg-white">
          {/* <Notification
            title="Task1"
            description="this will be a frontend..."
          /> */}

          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-black mb-2">Teams</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {/* TEAM CONTROLLER */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                +
              </button>
              {teams.map((team) => (
                <TeamCard
                  key={team.team_id}
                  team={team.team_name}
                  project="N/A"
                  teamId={team.team_id}
                  onDelete={() => handleDeleteTeam(team.team_id)}
                  members={[
                    {
                      icon: "https://randomuser.me/api/portraits/lego/1.jpg",
                      name: "Member 1",
                    },
                  ]}
                />
              ))}
            </div>
          </div>

          <div className="max-w-screen mt-4 space-y-4">
            <h2 className="mt-6 text-2xl font-semibold text-black">
              Section Tickets
            </h2>
            {otherTickets.map((ticket, index) => (
              <Ticket
                key={index}
                title={ticket.title}
                publishedDate={ticket.publishedDate}
                status={ticket.status as "To-do" | "In Progress" | "Finished"}
                priority={ticket.priority as "Low" | "Mid" | "High"}
                description={ticket.description}
              />
            ))}
          </div>

          {/* ------------------ KPIS ------------------ */}
          <h2 className="text-2xl font-semibold text-black p-5">KPIs</h2>
          <div className="flex flex-wrap items-center justify-center p-4">
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
            <div className="pt-2.5">
              <BarChartMulti
                data={tareasData}
                dataKeys={["Juan", "Mary", "Luis", "Josie"]}
                xAxisKey="sprint"
                yAxisLabel="Tareas completadas"
              />
            </div>
            <div className="pt-2.5">
              <TaskTable tasks={mockTasks} />
            </div>
          </div>
        </main>
      </div>
      {/* Modal para crear equipo */}
      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTeamCreated={() => {
          fetch("/api/auth/teams/myteams", {
            headers: {
              Authorization: `${jwtToken}`,
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => setTeams(data))
            .catch((err) => console.error("Error actualizando equipos:", err));
        }}
        token={jwtToken}
      />
    </div>
  );
}

export default DashboardManager;
