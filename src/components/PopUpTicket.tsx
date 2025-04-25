import React, { useState } from "react";

interface TicketPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  publishedDate: string;
  storyPoints: number;
  status: "To-do" | "In Progress" | "Finished";
  priority: "Low" | "Mid" | "High";
  onStatusChange: (newStatus: "To-do" | "In Progress" | "Finished") => void;
  description: string;
}

const PopUpTicket: React.FC<TicketPopUpProps> = ({
  isOpen,
  onClose,
  title,
  publishedDate,
  storyPoints,
  status,
  priority,
  description,
  onStatusChange,
}) => {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const [currentStatus, setCurrentStatus] = useState(status);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setAttachedFiles((prevFiles) => {
        const newFiles = filesArray.filter(
          (file) => !prevFiles.some((prev) => prev.name === file.name)
        );
        return [...prevFiles, ...newFiles];
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
      <div className="bg-[#D0CCD0] rounded-lg shadow-lg p-6 max-w-md w-full relative">
        {/* Closing button "X" */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
          style={{
            backgroundColor: "transparent",
            borderRadius: "30px",
          }}
        >
          ✕
        </button>

        <h2 className="text-black text-xl font-bold mb-2">{title}</h2>
        <p className={`${priorityColors[priority]}`}>
          <strong>Priority: {priority}</strong>
        </p>

        {/* Input para adjuntar archivos */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach images or videos:
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="text-sm text-gray-600 file:mr-4 file:py-1 file:px-4 file:border file:rounded-md file:bg-[#64548f] file:text-white"
          />
        </div>

        {/* Preview de archivos adjuntados */}
        {attachedFiles.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="font-medium text-gray-700">Preview:</p>
            <div className="flex gap-3 flex-wrap">
              {attachedFiles.map((file, idx) => {
                const url = URL.createObjectURL(file);
                if (file.type.startsWith("image/")) {
                  return (
                    <img
                      key={idx}
                      src={url}
                      alt={`preview ${idx}`}
                      className="w-28 h-28 object-cover rounded-md border"
                    />
                  );
                } else if (file.type.startsWith("video/")) {
                  return (
                    <video
                      key={idx}
                      src={url}
                      controls
                      className="w-40 h-28 rounded-md border"
                    />
                  );
                } else {
                  return (
                    <p key={idx} className="text-sm text-gray-700">
                      📄 {file.name}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        )}

        <p className="text-sm text-black mt-4">{publishedDate}</p>
        <p className="text-sm text-black mb-2">
          <strong>Story Points: {storyPoints}</strong>
        </p>
        <div className="mt-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value as "To-do" | "In Progress" | "Finished"
              )
            }
            className={`block mt-1 rounded px-2 py-1 text-sm ${statusColors[status]}`}
            style={{ backgroundColor: "white" }}
          >
            <option value="To-do">To-do</option>
            <option value="In Progress">In Progress</option>
            <option value="Finished">Finished</option>
          </select>
        </div>

        <p className="mt-2 text-black whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};

export default PopUpTicket;
