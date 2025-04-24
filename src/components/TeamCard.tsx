interface TeamMember {
  icon: string; // URL a la imagen
  name: string;
}

interface Team {
  team: string;
  project: string;
  members: TeamMember[];
}
export default function TeamCard({ team, project, members }: Team) {
  return (
    <div className="p-4 rounded-md shadow-md bg-neutral-100 ">
      <h1 className="text-black text-xl font-semibold">{team}</h1>
      <p className="text-gray-600 mb-4">{project}</p>
      <ul className="space-y-2">
        {members.map((member, index) => (
          <li
            key={index}
            className="flex items-center gap-3 border-b border-gray-300"
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
