import { useState } from "react";
import ShowAllSprints from "./ShowAllSprints";

export default function SprintModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [sprintData, setSprintData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const jwtToken = sessionStorage.getItem("token");

  type CustomInput = { name: string; value: string };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | CustomInput
    >
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setSprintData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...sprintData,
      startDate: sprintData.startDate
        ? new Date(sprintData.startDate).toISOString()
        : null,
      endDate: sprintData.endDate
        ? new Date(sprintData.endDate).toISOString()
        : null,
    };
    console.log(JSON.stringify(payload));
    try {
      const res = await fetch("/api/tasks/sprints/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al crear el sprint");

      alert("Sprint creado exitosamente");
      setIsOpen(false); // Cierra el modal
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700"
      >
        Sprints
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent h-screen">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">
              Create Sprint
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={sprintData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border-2 text-black rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  min={new Date().toISOString().split("T")[0]}
                  value={sprintData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border-2 text-black rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  min={new Date().toISOString().split("T")[0]}
                  value={sprintData.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border-2 text-black rounded-xl"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Create Sprint"}
              </button>
            </form>
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-xl">
                Error: {error}
              </div>
            )}
            <ShowAllSprints />
          </div>
        </div>
      )}
    </>
  );
}
