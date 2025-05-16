import React, { useState } from "react";

interface EditTeamModalProps {
  teamId: number;
  currentTeamName: string;
  onClose: () => void;
  onTeamUpdated: () => void;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({
  teamId,
  currentTeamName,
  onClose,
  onTeamUpdated,
}) => {
  const [teamName, setTeamName] = useState(currentTeamName);

  const handleUpdate = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("No se encontró el token de autenticación");
      return;
    }

    try {
      const response = await fetch("/api/auth/teams/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamId,
          teamName,
        }),
      });

      if (response.ok) {
        alert("Equipo actualizado con éxito");
        onTeamUpdated();
        onClose();
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error("Error al actualizar el equipo:", errorText);
        alert("Error al actualizar el equipo");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error en la petición");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md shadow-md">
        <h2 className="text-xl font-bold mb-4 text-black">Edit Team</h2>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-2 rounded mb-4 rounded-md border border-gray-300 text-black"
          placeholder="Team Name"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;
