import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Ticket from "../components/Ticket";
import TeamCard from "../components/TeamCard";
import Notification from "../components/Notification";
import CreateTeamModal from "../components/CreateTeamModal";

type Team = {
  team_id: number;
  team_name: string;
  created_at: string;
};

function DashboardManager() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPcmFjbGUgUHJvamVjdCIsImlkIjoxMDYsInJvbGUiOiJNYW5hZ2VyIiwidGVsZWdyYW1DaGF0SWQiOm51bGwsImV4cCI6MTc0NTYxMDU4M30.kybvK3Y3ST8oN_zyjk-G8xz4FhsEzqlnoqI8LoJmOGY";

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/teams/myteams", {
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
      const response = await fetch(`/teams/?teamId=${id}`, {
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

  // Lista simulada de tickets
  const tickets = [
    {
      title: "Fix login bug",
      publishedDate: "2025-04-01",
      status: "In Progress",
      priority: "High",
      description: "Users are unable to log in with Google authentication.",
    },
    {
      title: "UI improvements on dashboard",
      publishedDate: "2025-03-28",
      status: "To-do",
      priority: "Mid",
      description: "Redesign the user dashboard for better user experience.",
    },
    {
      title: "Database migration",
      publishedDate: "2025-03-20",
      status: "Finished",
      priority: "High",
      description: "Migrate the production database to a new server.",
    },
    {
      title: "Improve security measures",
      publishedDate: "2025-03-15",
      status: "In Progress",
      priority: "Low",
      description: "Implement new security patches for user authentication.",
    },
  ];

  const maxTicketsToShow = 5;
  const otherTickets = tickets.slice(0, maxTicketsToShow);

  console.log("Teams cargados:", teams);
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
        </main>
      </div>
      {/* Modal para crear equipo */}
      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTeamCreated={() => {
          fetch("/teams/myteams", {
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
