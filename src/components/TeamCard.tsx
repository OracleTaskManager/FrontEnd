import React, { useState } from "react";
import AddUserToTeamModal from "./AddUserPopUp";
import EditTeamModal from "./EditTeamModal";

interface TeamMember {
  icon: string;
  name: string;
}

interface TeamCardProps {
  readonly team: string;
  readonly project: string;
  readonly members: TeamMember[];
  readonly teamId: number;
  readonly onDelete: (id: number) => void;
}

export default function TeamCard({
  team,
  project,
  members,
  teamId,
  onDelete,
}: TeamCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="p-4 rounded-md shadow-md bg-neutral-100 w-64">
      {/* Encabezado con nombre y botones eliminar y editar */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-black text-xl font-semibold truncate">{team}</h2>
        <div className="flex items-center">
          <button
            onClick={() => onDelete(teamId)}
            className="text-red-500 hover:text-red-700 text-sm"
            style={{ backgroundColor: "transparent" }}
            title="Delete team"
          >
            X
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="text-blue-500 hover:text-blue-700 text-sm ml-2"
            style={{ backgroundColor: "transparent" }}
            title="Edit team"
          >
            🖉
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        style={{ borderRadius: "30px" }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
      >
        Add User
      </button>

      {showModal && (
        <AddUserToTeamModal
          teamId={teamId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // Puedes refrescar miembros del equipo si quieres
          }}
        />
      )}

      {showEditModal && (
        <EditTeamModal
          teamId={teamId}
          currentTeamName={team}
          onClose={() => setShowEditModal(false)}
          onTeamUpdated={() => {
            // Aquí puedes refrescar la lista de equipos si es necesario
            console.log("Equipo actualizado");
          }}
        />
      )}

      <p className="text-gray-600 mb-4">{project}</p>

      <ul className="space-y-2">
        {members.map((member) => (
          <li
            key={member.name} // Usar un identificador único como el nombre del miembro
            className="flex items-center gap-3 border-b border-gray-300 pb-2"
          >
            <img
              src={member.icon}
              alt={member.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-black">{member.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
