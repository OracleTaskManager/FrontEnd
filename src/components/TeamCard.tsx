import handleAddUserToTeam from "./AddUserPopUp";

interface TeamMember {
  icon: string;
  name: string;
}

interface TeamCardProps {
  team: string;
  project: string;
  members: TeamMember[];
  teamId: number;
  onDelete: (id: number) => void;
}

export default function TeamCard({
  team,
  project,
  members,
  teamId,
  onDelete,
}: TeamCardProps) {
  return (
    <div className="p-4 rounded-md shadow-md bg-neutral-100 w-64">
      {/* Encabezado con nombre y botón eliminar */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-black text-xl font-semibold truncate">{team}</h2>
        <button
          onClick={() => onDelete(teamId)}
          className="text-red-500 hover:text-red-700 text-sm"
          style={{ backgroundColor: "transparent" }}
          title="Delete team"
        >
          X
        </button>
      </div>

      <button
        onClick={() => handleAddUserToTeam(teamId)}
        style={{ borderRadius: "30px" }}
        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
      >
        Add User
      </button>

      <p className="text-gray-600 mb-4">{project}</p>

      <ul className="space-y-2">
        {members.map((member, index) => (
          <li
            key={index}
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
