// TicketModal.tsx
import React from "react";

interface TicketPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  publishedDate: string;
  status: "To-do" | "In Progress" | "Finished";
  priority: "Low" | "Mid" | "High";
  description: string;
}

const PopUpTicket: React.FC<TicketPopUpProps> = ({
  isOpen,
  onClose,
  title,
  publishedDate,
  status,
  priority,
  description,
}) => {
  if (!isOpen) return null;

  const priorityColors = {
    Low: "text-green-600",
    Mid: "text-orange-600",
    High: "text-red-600 font-bold",
  };

  const statusColors = {
    "To-do": "bg-gray-200 text-gray-800",
    "In Progress": "bg-yellow-200 text-yellow-800",
    Finished: "bg-green-200 text-green-800",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40">
      <div className="bg-[#D0CCD0] rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
          style={{ backgroundColor: "transparent" }}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className={`${priorityColors[priority]}`}>
          <strong>Priority:</strong> {priority}
        </p>
        <p className="text-sm text-gray-500 mb-2">{publishedDate}</p>
        <p className={`${statusColors[status]}`}>
          <strong>Status:</strong> {status}
        </p>
        <p className="mt-2 text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default PopUpTicket;
