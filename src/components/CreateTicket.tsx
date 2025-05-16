import React, { useState } from "react";

const CreateTicketForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    epicId: 61,
    priority: "Low",
    type: "Ticket",
    estimatedDeadline: "2025-04-25",
    realDeadline: "2025-04-25",
    userPoints: 100,
    estimatedHours: 24,
    realHours: 20,
  });

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
      estimatedDeadline: new Date(formData.estimatedDeadline).toISOString(),
      realDeadline: new Date(formData.realDeadline).toISOString(),
    };

    try {
      const response = await fetch("/api/tasks/tasks/", {
        method: "POST",
        headers: {
          Authorization: `${jwtToken}`,
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

          <input
            type="number"
            name="epicId"
            value={formData.epicId}
            onChange={handleChange}
            placeholder="Epic ID"
            className="w-full p-2 border rounded-lg"
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Ticket">Ticket</option>
            <option value="Bug">Bug</option>
            <option value="Feature">Feature</option>
          </select>

          <input
            type="date"
            name="estimatedDeadline"
            value={formData.estimatedDeadline}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="date"
            name="realDeadline"
            value={formData.realDeadline}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />

          <input
            type="number"
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Estimated Hours"
          />

          <input
            type="number"
            name="realHours"
            value={formData.realHours}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Real Hours"
          />

          <input
            type="number"
            name="userPoints"
            value={formData.userPoints}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="User Points"
          />

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
    <div className="mt-4 mb-5">
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
