interface TicketProps {
  title: string;
  publishedDate: string;
  status: "To-do" | "In Progress" | "Finished";
  priority: "Low" | "Mid" | "High";
  description: string;
  isMain?: boolean; //Variable to check if its the main ticket
}

export default function Ticket({
  title,
  publishedDate,
  status,
  priority,
  description,
  isMain,
}: TicketProps) {
  // Colores condicionales para el estatus
  const statusColors = {
    "To-do": "bg-gray-200 text-gray-800",
    "In Progress": "bg-yellow-200 text-yellow-800",
    Finished: "bg-green-200 text-green-800",
  };

  // Colores condicionales para la prioridad
  const priorityColors = {
    Low: "text-green-600",
    Mid: "text-orange-600",
    High: "text-red-600 font-bold",
  };

  return (
    <div className="mx-auto flex max-w items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg border">
      <img
        className="size-12 shrink-0 shadow-sm"
        src="/img/logo.svg"
        alt="ChitChat Logo"
      />
      <div className="flex-1">
        {/* Título */}
        <div className="flex justify-between">
          <h3 className="text-xl font-medium text-black">{title}</h3>
        </div>
        {/* Etiquetas de estatus, fecha y prioridad */}
        <div className="mt-2 flex gap-3">
          <span className="text-gray-500 text-sm">{publishedDate}</span>
          <span
            className={`px-3  text-sm rounded-full ${statusColors[status]}`}
          >
            {status}
          </span>
          <span className={`text-sm ${priorityColors[priority]}`}>
            {priority} Priority
          </span>
        </div>

        {/* Descripción */}
        <p className="text-gray-500">{description}</p>
        <button
          style={{
            backgroundColor: "#64548f",
            borderRadius: "20px",
            padding: "8px 16px",
            fontSize: "14px",
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
}
