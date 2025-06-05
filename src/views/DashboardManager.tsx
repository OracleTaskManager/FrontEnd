import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Ticket from "../components/Ticket";
import TeamCard from "../components/TeamCard";
// import Notification from "../components/Notification";
import CreateTeamModal from "../components/CreateTeamModal";
import CreateTicketForm from "../components/CreateTicketForm";
import AssignTaskToUser from "../components/AssignTaskToUser";
import EditTaskModal from "../components/EditTaskModal";
import CreateEpicForm from "../components/CreateEpicForm";
import SprintModal from "../components/CreateSprintModal";

export interface Ticketx {
  id: number;
  title: string;
  description: string;
  epic_id?: number;
  priority: "Low" | "Medium" | "High";
  status: "ToDo" | "InProgress" | "Done";
  estimated_deadline: string;
  real_deadline: string;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
  const [ticketView, setTicketView] = useState<"my" | "all">("my");

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/tasks/tasks/my-tasks", {
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch my tasks");

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching my tasks:", error);
    }
  };

  const fetchAllTickets = async () => {
    try {
      const response = await fetch("/api/tasks/tasks/all", {
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch all tasks");

      const data = await response.json();

      //Obtener el taskId y convertirlo en id para que se despliegue en el front
      setTickets(data);
    } catch (error) {
      console.error("Error fetching all tasks:", error);
    }
  };

  useEffect(() => {
    ticketView === "my" ? fetchTickets() : fetchAllTickets();
  }, [ticketView]);

  useEffect(() => {
    fetchTickets();
  }, []);

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
                />
              ))}
            </div>
          </div>

          <div className="max-w-screen mt-4 space-y-4">
            <h2 className="mt-6 text-2xl font-semibold text-black">
              Section Tickets
            </h2>
            <div className="flex space-x-4">
              <CreateEpicForm />
              <CreateTicketForm />
              <AssignTaskToUser onTaskAssigned={fetchTickets} />

              <button
                className=" h-12 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Tasks
              </button>

              <SprintModal />
            </div>

            {isEditModalOpen && (
              <EditTaskModal
                onClose={() => setIsEditModalOpen(false)}
                onUpdated={fetchTickets}
                token={jwtToken ?? ""}
              />
            )}

            {/* Clickable Divs to show my-tasks and all tasks */}
            <div className="flex gap-4 mb-4">
              {/* My tickets */}
              <div
                onClick={() => setTicketView("my")}
                className={`cursor-pointer px-4 py-2 rounded-md ${
                  ticketView === "my"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                My Tickets
              </div>

              {/* All Tickets */}
              <div
                onClick={() => setTicketView("all")}
                className={`cursor-pointer px-4 py-2 rounded-md ${
                  ticketView === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                All Tickets
              </div>
            </div>

            {/* Display Tickets of User */}
            <div className="gap-4">
              {tickets.length === 0 ? (
                <p className="text-gray-500 col-span-full">
                  No hay tareas disponibles.
                </p>
              ) : (
                tickets.map((ticket, index) => (
                  <Ticket
                    key={index}
                    taskId={ticket.id}
                    epic_id={ticket.epic_id}
                    title={ticket.title}
                    status={ticket.status as "ToDo" | "In Progress" | "Done"}
                    priority={ticket.priority}
                    description={ticket.description}
                  />
                ))
              )}
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
        token={jwtToken ?? ""}
      />
    </div>
  );
}

export default DashboardManager;
