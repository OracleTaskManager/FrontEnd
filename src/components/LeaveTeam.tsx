import React, { useState } from "react";

interface LeaveTeamButtonProps {
  teamId: number;
  onLeave?: () => void; // Callback opcional para actualizar UI después de salir
}

const LeaveTeamButton: React.FC<LeaveTeamButtonProps> = ({
  teamId,
  onLeave,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const token = sessionStorage.getItem("token");

  const handleLeaveTeam = async () => {
    setLoading(true);
    setError(null);

    const url = `/api/auth/userteams/remove?teamId=${teamId}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al salir del equipo");
      }

      setSuccess(true);
      if (onLeave) onLeave(); // Llama callback para actualizar vista
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleLeaveTeam}
        disabled={loading || success}
        className={`px-4 py-2 rounded ${
          success
            ? "bg-green-500 text-white"
            : "bg-red-500 hover:bg-red-600 text-white"
        }`}
      >
        {loading
          ? "Saliendo..."
          : success
          ? "Has salido del equipo"
          : "Salir"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default LeaveTeamButton;
