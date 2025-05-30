import { useState, useEffect } from "react";
import AddUserToTeamModal from "./AddUserPopUp";
import EditTeamModal from "./EditTeamModal";

interface TeamMember {
  userId: number;
  name: string;
  icon?: string;
}

interface TeamCardProps {
  readonly team: string;
  readonly project: string;
  readonly teamId: number;
  readonly onDelete: (id: number) => void;
}

export default function TeamCard({
  team,
  project,
  teamId,
  onDelete,
}: TeamCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teamName, setTeamName] = useState(team);

  // Refrescar miembros tras agregar usuario o montar
  const fetchMembers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`/api/auth/teams/${teamId}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("No se pudieron obtener los miembros");
      const data = await res.json();
      setMembers(data);
    } catch {
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  useEffect(() => {
    setTeamName(team);
  }, [team]);

  // Quitar usuario del equipo (desde el admin o responsable)
  const handleRemoveUserFromTeam = async (userId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`/api/auth/userteams/remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, userId }),
      });
      if (!res.ok) throw new Error("No se pudo quitar el usuario del equipo");
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch {
      alert("Error al quitar usuario del equipo");
    }
  };

  // Refrescar miembros tras agregar usuario
  const handleUserAdded = () => {
    fetchMembers();
  };

  // Refrescar nombre tras editar
  const handleTeamUpdated = (newName: string) => {
    setTeamName(newName);
  };

  return (
    <div className="p-4 rounded-md shadow-md bg-neutral-100 w-64">
      {/* Encabezado con nombre y botones de editar/eliminar */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-black text-xl font-semibold truncate">
          {teamName}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="text-blue-500 hover:text-blue-700 text-sm"
            style={{ backgroundColor: "transparent" }}
            title="Edit team"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(teamId)}
            className="text-red-500 hover:text-red-700 text-sm"
            style={{ backgroundColor: "transparent" }}
            title="Delete team"
          >
            X
          </button>
        </div>
      </div>

      {/* Botón para agregar usuario */}
      <button
        onClick={() => setShowModal(true)}
        style={{ borderRadius: "30px" }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
      >
        Add User
      </button>

      {/* Modal para agregar usuario */}
      {showModal && (
        <AddUserToTeamModal
          teamId={teamId}
          onClose={() => setShowModal(false)}
          onSuccess={handleUserAdded}
        />
      )}

      {/* Modal para editar equipo */}
      {showEditModal && (
        <EditTeamModal
          teamId={teamId}
          currentTeamName={teamName}
          onClose={() => setShowEditModal(false)}
          onTeamUpdated={handleTeamUpdated}
        />
      )}

      <p className="text-gray-600 my-4">{project}</p>

      {/* Lista de miembros */}
      <ul
        className="space-y-2 mb-4"
        style={{ maxHeight: "140px", overflowY: "auto" }}
      >
        {members.length === 0 ? (
          <li className="text-gray-500">No hay miembros en este equipo</li>
        ) : (
          members.map((member) => (
            <li
              key={member.userId}
              className="flex items-center gap-3 border-b border-gray-300 pb-2 justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    member.icon ??
                    `https://randomuser.me/api/portraits/lego/${member.userId % 10}.jpg`
                  }
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-black">{member.name}</span>
              </div>

              {/* Botón para quitar usuario del equipo */}
              <button
                onClick={() => handleRemoveUserFromTeam(member.userId)}
                className="text-red-500 hover:text-red-700 text-sm"
                title="Quitar usuario del equipo"
              >
                X
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
