import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Ticket from "../components/Ticket";

function DashboardDev() {
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
    {
      title: "Improve security measures",
      publishedDate: "2025-03-15",
      status: "In Progress",
      priority: "Low",
      description: "Implement new security patches for user authentication.",
    },
    {
      title: "Improve security measures",
      publishedDate: "2025-03-15",
      status: "In Progress",
      priority: "Low",
      description: "Implement new security patches for user authentication.",
    },
  ];

  const maxTicketsToShow = 4;

  const mainTicket = tickets[0]; // Primer ticket
  const otherTickets = tickets.slice(1, maxTicketsToShow); // Los demás

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      {/* Navbar fijo arriba */}
      <Navbar pageTitle="Home" />

      <div className="flex flex-1">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar />
        {/* bg-[#D0CCD0] */}
        {/* Contenido principal */}
        <main className="flex-1 p-6 overflow-auto bg-white">
          {/* Ticket principal destacado */}
          <Ticket
            title={mainTicket.title}
            publishedDate={mainTicket.publishedDate}
            status={mainTicket.status as "To-do" | "In Progress" | "Finished"}
            priority={mainTicket.priority as "Low" | "Mid" | "High"}
            description={mainTicket.description}
            isMain={true}
          />
          {/* Sección de Tickets */}
          <div className="max-w-screen mt-4 space-y-4">
            <h2 className="mt-6 text-2xl font-semibold text-black">
              Section Tickets
            </h2>
            {/* Lista de Tickets */}
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
    </div>
  );
}

export default DashboardDev;
