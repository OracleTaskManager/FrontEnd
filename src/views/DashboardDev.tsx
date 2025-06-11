import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Ticket from "../components/Ticket";
// import CircularProgress from "../components/CircularProgress";

export interface Ticketx {
  taskId?: number;
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

function DashboardDev() {
  const [tickets, setTickets] = useState<Ticketx[]>([]);
  const jwtToken = sessionStorage.getItem("token");
  // Para debuguear
  // if (jwtToken) {
  //   console.log("Token disponible:", jwtToken);
  // } else {
  //   console.error("No se encontró el token");
  // }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tasks/tasks/my-tasks", {
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

  const mapStatus = (status: string): "ToDo" | "InProgress" | "Done" => {
    switch (status) {
      case "ToDo":
        return "ToDo";
      case "InProgress":
        return "InProgress";
      case "Finished":
        return "Done";
      default:
        return "Done";
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
              taskId={mainTicket.id}
              title={mainTicket.title}
              estimated_deadline={mainTicket.estimated_deadline}
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
                  taskId={ticket.id}
                  epic_id={ticket.epic_id}
                  title={ticket.title}
                  status={ticket.status}
                  priority={ticket.priority}
                  description={ticket.description}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardDev;
