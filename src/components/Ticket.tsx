import { useEffect, useState } from "react";
import PopUpTicket from "./PopUpTicket";
import { isTaskBlocked } from "../fetchEndpoints/isTaskBlocked";

interface TicketProps {
  taskId: number;
  isMain?: boolean;
  title?: string;
  description?: string;
  epic_id?: number;
  priority: "Low" | "Medium" | "High";
  status: "ToDo" | "InProgress" | "Done";
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
  type TicketStatus = "ToDo" | "InProgress" | "Done";
  type Priority = "Low" | "Medium" | "High";

  const statusColors: Record<TicketStatus, string> = {
    ToDo: "bg-gray-300",
    InProgress: "bg-yellow-300",
    Done: "bg-green-300",
  };

  const priorityColors: Record<Priority, string> = {
    Low: "text-green-500",
    Medium: "text-yellow-500",
    High: "text-red-500",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>(status);
  const [users, setUsers] = useState<any[]>([]);
  const [assignedTaskToUser, setAssignedTaskToUser] = useState<any[]>([]);
  const [blockedInfo, setBlockedInfo] = useState<
    { blocked: boolean; blockers: any[] } | null
  >(null);
  const [checkingBlocked, setCheckingBlocked] = useState(false);
  const jwtToken = sessionStorage.getItem("token");

  async function updateTaskStatus(newStatus: "ToDo" | "InProgress" | "Done") {
    if (!taskId) {
      console.error("No taskId provided for status update");
      return;
    }

    const updatedTask = {
      title: title,
      description: description,
      epic_id: epic_id,
      priority: typeof priority === "string" ? priority : "Low",
      status: newStatus,
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

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/auth/users", {
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchAssignedTaskToUser = async () => {
    try {
      const response = await fetch("/api/tasks/taskassignments/", {
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setAssignedTaskToUser(data);
    } catch (err) {
      console.error("Error fetching assigned task to user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAssignedTaskToUser();
  }, []);

  useEffect(() => {
    if (!taskId || !jwtToken) return;
    setCheckingBlocked(true);
    isTaskBlocked(taskId, jwtToken)
      .then(setBlockedInfo)
      .catch(() => setBlockedInfo(null))
      .finally(() => setCheckingBlocked(false));
  }, [taskId, jwtToken]);

  const getAssignedUserName = () => {
    const assignment = assignedTaskToUser.find(
      (assignment) => assignment.taskId === taskId
    );
    if (!assignment) return "Unassigned";

    const user = users.find((user) => user.userId === assignment.userId);
    return user ? user.name : "Unknown user";
  };

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
        <p className="text-black">Task id: {taskId}</p>
        <p className="text-black">Epic id: {epic_id}</p>
        <p className="text-gray-700">
          Assigned to: <strong>{getAssignedUserName()}</strong>
        </p>

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
        {checkingBlocked ? (
          <p className="text-yellow-600 text-sm mt-2">
            Verificando dependencias...
          </p>
        ) : blockedInfo?.blocked ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mt-2 rounded">
            <strong>Advertencia:</strong> Esta tarea está bloqueada por:
            <ul className="list-disc ml-6">
              {blockedInfo.blockers.map((b, idx) => (
                <li key={idx}>
                  {b.blockedByTaskId?.title ||
                    `Tarea ${b.blockedByTaskId?.taskId}`} (Estado:{" "}
                  {b.blockedByTaskId?.status})
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="text-gray-500">{description}</p>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: "#64548f",
            borderRadius: "20px",
            padding: "8px 16px",
            fontSize: "14px",
          }}
          disabled={blockedInfo?.blocked}
        >
          Details
        </button>
        <PopUpTicket
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title ?? ""}
          status={ticketStatus}
          priority={priority}
          description={description ?? ""}
          taskId={taskId}
          onStatusChange={(newStatus) => {
            updateTaskStatus(newStatus);
          }}
          epic_id={epic_id}
          type={type}
          estimated_deadline={estimated_deadline}
          real_deadline={real_deadline}
          user_points={user_points}
          estimatedHours={estimatedHours}
          realHours={realHours}
        />
      </div>
    </div>
  );
}
