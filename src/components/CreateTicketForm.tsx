import React, { useState, useEffect } from "react";

const CreateTicketForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    epicId: 0,
    priority: "",
    type: "",
    estimatedDeadline: "",
    realDeadline: "",
    userPoints: 0,
    estimatedHours: 0,
    realHours: 0,
  });

  const [epics, setEpics] = useState<{ epic_id: number; title: string }[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Hours") || name === "userPoints" || name === "epicId"
          ? Number(value)
          : value,
    }));
  };

  const jwtToken = sessionStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      estimatedDeadline: formData.estimatedDeadline
        ? new Date(formData.estimatedDeadline).toISOString()
        : null,
      realDeadline: formData.realDeadline
        ? new Date(formData.realDeadline).toISOString()
        : null,
    };

    try {
      const response = await fetch("/api/tasks/tasks/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Ticket creado:", data);
      alert("Ticket creado exitosamente");
      onClose(); // Cierra el modal al finalizar
    } catch (error) {
      console.error("Error al crear el ticket:", error);
      alert("Error al crear el ticket");
    }
  };

  useEffect(() => {
    const fetchEpics = async () => {
      const jwtToken = sessionStorage.getItem("token");

      try {
        const response = await fetch("/api/tasks/epics/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok)
          throw new Error(`Error al obtener epics: ${response.status}`);
        const data = await response.json();
        setEpics(data);
      } catch (error) {
        console.error("Error al cargar los epics:", error);
      }
    };

    fetchEpics();
  }, []);

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Ticket
          </h2>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border rounded-lg"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded-lg"
            rows={3}
            required
          />

          <label className="block">
            Epic
            <select
              name="epicId"
              value={formData.epicId}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
              required
            >
              <option value={0} disabled hidden>
                Select Epic
              </option>
              {epics.map((epic) => (
                <option key={epic.epic_id} value={epic.epic_id}>
                  {epic.title}
                </option>
              ))}
            </select>
          </label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            +{" "}
            <option value="" disabled hidden>
              Select priority{" "}
            </option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            +{" "}
            <option value="" disabled hidden>
              Select type{" "}
            </option>
            <option value="Ticket">Ticket</option>
            <option value="Bug">Bug</option>
            <option value="Feature">Feature</option>
          </select>

          <label>Estimated Deadline</label>
          <input
            type="date"
            name="estimatedDeadline"
            value={formData.estimatedDeadline}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <label>Real Deadline</label>
          <input
            type="date"
            name="realDeadline"
            value={formData.realDeadline}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <label className="block">
            Estimated Hours
            <input
              type="number"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </label>

          <label className="block">
            Real Hours
            <input
              type="number"
              name="realHours"
              value={formData.realHours}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </label>

          <label className="block">
            User Points
            <input
              type="number"
              name="userPoints"
              value={formData.userPoints}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Create Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

const TicketPopup = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="">
      <button
        onClick={() => setShowModal(true)}
        className=" text-white px-6 py-2 rounded-lg transition"
      >
        Create Ticket
      </button>

      {showModal && <CreateTicketForm onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default TicketPopup;
