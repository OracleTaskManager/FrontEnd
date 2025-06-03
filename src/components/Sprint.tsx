import { useEffect, useState } from "react";

interface SprintProps {
  sprintId?: number;
  name: string;
  startDate: string;
  endDate: string;
}

export default function Sprint({
  sprintId,
  name,
  startDate,
  endDate,
}: SprintProps) {
  const jwtToken = sessionStorage.getItem("token");

  // Estado para alternar entre “ver” y “editar”
  const [isEditing, setIsEditing] = useState(false);

  // Inicializamos formData SIEMPRE con strings (no undefined)
  const [formData, setFormData] = useState({
    name: name ?? "",
    startDate: startDate ?? "",
    endDate: endDate ?? "",
  });

  // Evita que en algún render inicial los inputs reciban un value undefined.
  useEffect(() => {
    setFormData({
      name: name ?? "",
      startDate: startDate ?? "",
      endDate: endDate ?? "",
    });
  }, [name, startDate, endDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restauramos los valores originales en caso de “Cancelar”
    setFormData({
      name: name ?? "",
      startDate: startDate ?? "",
      endDate: endDate ?? "",
    });
  };

  const handleSave = async () => {
    if (!sprintId) {
      console.error("No se proporcionó sprintId");
      return;
    }

    // --- AQUÍ ES DONDE HACEMOS LA TRANSFORMACIÓN ---
    let formattedStartDate = null;
    let formattedEndDate = null;

    if (formData.startDate) {
      const date = new Date(formData.startDate);
      // Convertimos a UTC y formateamos a ISO 8601 con milisegundos y offset +00:00
      // .toISOString() ya devuelve el formato "YYYY-MM-DDTHH:MM:SS.sssZ" (la 'Z' indica UTC)
      // Reemplazamos 'Z' con '+00:00' para que coincida exactamente con tu ejemplo.
      formattedStartDate = date.toISOString().replace("Z", "+00:00");
    }

    if (formData.endDate) {
      const date = new Date(formData.endDate);
      formattedEndDate = date.toISOString().replace("Z", "+00:00");
    }
    // ----------------------------------------------

    // Payload para el PUT
    const payload = {
      sprintId,
      name: formData.name,
      startDate: formattedStartDate, // Usamos la fecha ya formateada
      endDate: formattedEndDate, // Usamos la fecha ya formateada
    };

    try {
      const response = await fetch(`/api/tasks/sprints/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(
          "Error al actualizar sprint (status:",
          response.status,
          "):",
          text
        );
        return;
      }

      // Si el servidor responde con 204 No Content, evitamos hacer response.json()
      if (response.status !== 204) {
        const updatedSprint = await response.json();
        console.log("Sprint actualizado:", updatedSprint);
      } else {
        console.log("Sprint actualizado (204 No Content).");
      }

      // Cerramos el modo edición
      setIsEditing(false);
    } catch (error) {
      console.error("Error en fetch PUT:", error);
    }
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2 bg-gray-50">
      <p className="text-sm text-gray-500">Sprint ID: {sprintId}</p>

      {isEditing ? (
        <div className="flex flex-col gap-2 text-black">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
            placeholder="Nombre del Sprint"
          />
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="border rounded px-2 py-1"
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-black text-lg font-semibold">{name}</h2>
          <p className="text-black">StartDate: {startDate}</p>
          <p className="text-black">EndDate: {endDate}</p>
          <button
            onClick={handleEditClick}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
