import { useState } from "react";
import PopUpTicket from "./PopUpTicket";

interface TicketProps {
  taskId: number;
  isMain?: boolean;
  title?: string;
  description?: string;
  epic_id?: number;
  priority?: string;
  status?: string;
  type?: string;
  estimated_deadline?: string;
  real_deadline?: string;
  user_points?: number;
  estimatedHours?: number;
  realHours?: number;
}

export default function Ticket({
  taskId,
  title,
  status,
  priority,
  description,
  isMain,
  epic_id,
  type,
  estimated_deadline,
  real_deadline,
  user_points,
  estimatedHours,
  realHours,
}: TicketProps) {
  const statusColors = {
    "To-do": "bg-gray-200 text-gray-800",
    "In Progress": "bg-yellow-200 text-yellow-800",
    Finished: "bg-green-200 text-green-800",
  };

  const priorityColors = {
    Low: "text-green-600",
    Mid: "text-orange-600",
    High: "text-red-600 font-bold",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(status);
  const jwtToken = sessionStorage.getItem("token");

  async function updateTaskStatus(
    newStatus: "To-do" | "In Progress" | "Finished"
  ) {
    if (!taskId) {
      console.error("No taskId provided for status update");
      return;
    }

    const updatedTask = {
      title: title,
      description: description,
      epic_id: typeof epic_id === "number" ? epic_id : null,
      priority: typeof priority === "string" ? priority : "Low",
      status: status ?? "",
      type: type,
      estimated_deadline:
        (estimated_deadline ?? estimated_deadline)?.split("T")[0] ?? "",
      real_deadline: (real_deadline ?? real_deadline)?.split("T")[0] ?? "",
      user_points: user_points ?? user_points,
      estimatedHours: estimatedHours,
      realHours: realHours,
    };

    try {
      const response = await fetch(`/api/tasks/tasks/update-task/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error updating status:", response.status, errorText);
        return;
      }

      setTicketStatus(newStatus);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

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
        <div className="flex justify-between">
          <h3 className="text-xl font-medium text-black">{title}</h3>
        </div>
        <div className="mt-2 flex gap-3">
          <span
            className={`px-3 text-sm rounded-full ${statusColors[ticketStatus]}`}
          >
            {ticketStatus}
          </span>
          <span className={`text-sm ${priorityColors[priority]}`}>
            {priority} Priority
          </span>
        </div>

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
          title={title ?? ""}
          status={
            (ticketStatus ?? "To-do") as "To-do" | "In Progress" | "Finished"
          }
          priority={(priority ?? "Low") as "Low" | "Mid" | "High"}
          description={description ?? ""}
          taskId={taskId}
          onStatusChange={(newStatus) => {
            updateTaskStatus(newStatus);
          }}
          epic_id={epic_id}
          type={type ?? ""}
          estimated_deadline={estimated_deadline ?? ""}
          real_deadline={real_deadline ?? ""}
          user_points={user_points ?? 0}
          estimatedHours={estimatedHours ?? 0}
          realHours={realHours ?? 0}
        />
      </div>
    </div>
  );
}
