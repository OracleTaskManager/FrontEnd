import { useState } from "react";
import PopUpTicket from "./PopUpTicket";

interface TicketProps {
  taskId?: number; // Optional, not currently used
  title: string;
  publishedDate: string;
  status: "To-do" | "In Progress" | "Finished";
  priority: "Low" | "Mid" | "High";
  description: string;
  isMain?: boolean; // Optional, only used in one place
  estimatedTime?: string | null; // Optional, not used in current component
  realHours?: string | null; // Optional, not used in current component
  user?: {
    points: number;
  };
}

export default function Ticket({
  taskId,
  title,
  publishedDate,
  status,
  priority,
  description,
  isMain,
}: TicketProps) {
  // Colores condicionales para el estatus
  const statusColors = {
    "To-do": "bg-gray-200 text-gray-800",
    "In Progress": "bg-yellow-200 text-yellow-800",
    Finished: "bg-green-200 text-green-800",
  };

  // Colores condicionales para la prioridad
  const priorityColors = {
    Low: "text-green-600",
    Mid: "text-orange-600",
    High: "text-red-600 font-bold",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ticketStatus, setTicketStatus] = useState(status);

  return (
    <div
      className={`mx-auto flex max-w items-center gap-x-4 rounded-xl bg-neutral-100 p-6 shadow-lg border ${
        isMain ? "min-h-70 min-w-70" : ""
      }`}
    >
      <img
        className={`size-12 shrink-0 ${
          isMain ? "min-h-50 min-w-50" : "min-h-30 min-w-30"
        }`}
        src="/rocket.png"
        alt="ChitChat Logo"
      />

      <div className="flex-1">
        {/* Título */}
        <div className="flex justify-between">
          <h3 className="text-xl font-medium text-black">{title}</h3>
        </div>
        {/* Etiquetas de estatus, fecha y prioridad */}
        <div className="mt-2 flex gap-3">
          <span className="text-gray-500 text-sm">{publishedDate}</span>
          <span
            className={`px-3 text-sm rounded-full ${statusColors[ticketStatus]}`}
          >
            {ticketStatus}
          </span>
          <span className={`text-sm ${priorityColors[priority]}`}>
            {priority} Priority
          </span>
        </div>

        {/* Descripción */}
        <p className="text-gray-500">{description}</p>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#64548f",
            borderRadius: "20px",
            padding: "8px 16px",
            fontSize: "14px",
          }}
        >
          Details
        </button>
        <PopUpTicket
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          publishedDate={publishedDate}
          storyPoints={100}
          status={ticketStatus}
          priority={priority}
          description={description}
          taskId={taskId}
          onStatusChange={(newStatus) => setTicketStatus(newStatus)}
        />
      </div>
    </div>
  );
}
