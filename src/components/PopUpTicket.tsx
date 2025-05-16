import React, { useEffect, useState } from "react";

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
  taskId: number;
}

interface FetchedFile {
  name: string;
  url: string;
  type: string;
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
  taskId,
}) => {
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [fetchedFiles, setFetchedFiles] = useState<FetchedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/files/attachments/")
        .then((res) => res.json())
        .then((data) => {
          setFetchedFiles(data);
        })
        .catch((error) => {
          console.error("Error fetching attachments:", error);
        });
    }
  }, [isOpen]);

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

  // Aquí el método para subir archivos automáticamente
  // const handleUpload = async (files: File[]) => {
  //   setUploading(true);
  //   try {
  //     for (const file of files) {
  //       const formData = new FormData();
  //       formData.append("fileUrl", file);
  //       formData.append("taskId", taskId.toString());

  //       const response = await fetch("/api/files/attachments/upload", {
  //         method: "POST",
  //         body: formData,
  //       });

  //       if (!response.ok) {
  //         throw new Error("Error al subir el archivo");
  //       }
  //     }

  //     alert("Archivos subidos correctamente.");
  //     setAttachedFiles([]);
  //   } catch (error) {
  //     console.error("Error al subir archivos:", error);
  //     alert("Hubo un error al subir los archivos.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setAttachedFiles(filesArray);
      if (filesArray.length > 0) {
        handleUpload(filesArray);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 bg-transparent">
      <div className="bg-neutral-100 rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
          style={{ backgroundColor: "transparent", borderRadius: "30px" }}
        >
          ✕
        </button>

        <h2 className="text-black text-xl font-bold mb-2">{title}</h2>
        <p className={`${priorityColors[priority]}`}>
          <strong>Priority: {priority}</strong>
        </p>

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
            disabled={uploading}
          />
        </div>

        {(fetchedFiles.length > 0 || attachedFiles.length > 0) && (
          <div className="mt-4 space-y-3">
            <p className="font-medium text-gray-700">Attachments:</p>
            <div className="flex gap-3 flex-wrap">
              {fetchedFiles.map((file, idx) => {
                if (file.type.startsWith("image/")) {
                  return (
                    <img
                      key={`fetched-${idx}`}
                      src={file.url}
                      alt={file.name}
                      className="w-28 h-28 object-cover rounded-md border"
                    />
                  );
                } else if (file.type.startsWith("video/")) {
                  return (
                    <video
                      key={`fetched-${idx}`}
                      src={file.url}
                      controls
                      className="w-40 h-28 rounded-md border"
                    />
                  );
                } else {
                  return (
                    <a
                      key={`fetched-${idx}`}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 underline"
                    >
                      📄 {file.name}
                    </a>
                  );
                }
              })}

              {attachedFiles.map((file, idx) => {
                const url = URL.createObjectURL(file);
                if (file.type.startsWith("image/")) {
                  return (
                    <img
                      key={`local-${idx}`}
                      src={url}
                      alt={`preview ${idx}`}
                      className="w-28 h-28 object-cover rounded-md border"
                    />
                  );
                } else if (file.type.startsWith("video/")) {
                  return (
                    <video
                      key={`local-${idx}`}
                      src={url}
                      controls
                      className="w-40 h-28 rounded-md border"
                    />
                  );
                } else {
                  return (
                    <p key={`local-${idx}`} className="text-sm text-gray-700">
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
            value={currentStatus}
            onChange={(e) => {
              const newStatus = e.target.value as
                | "To-do"
                | "In Progress"
                | "Finished";
              setCurrentStatus(newStatus);
              onStatusChange(newStatus);
            }}
            className={`block mt-1 rounded px-2 py-1 text-sm ${statusColors[currentStatus]}`}
            style={{ backgroundColor: "white", color: "black" }}
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
