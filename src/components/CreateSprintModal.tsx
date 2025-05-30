import { useState } from "react";

export default function SprintModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [sprintData, setSprintData] = useState({
    name: "",
    start_date: "2025-07-12T00:00:00.000+00:00",
    end_date: "2025-08-12T00:00:00.000+00:00",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
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
    setResponse(null);

    const payload = {
      name: sprintData.name,
      startDate: sprintData.start_date.slice(0, 10),
      endDate: sprintData.end_date.slice(0, 10),
    };

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

      setResponse(data);
      setIsOpen(false); // Cierra el modal
    } catch (err) {
      if (err instanceof Error) {
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
        New Sprint
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent ">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">Crear Sprint</h2>
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
                  type="datetime-local"
                  name="start_date"
                  value={sprintData.start_date.slice(0, 16)}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border-2 text-black rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={sprintData.end_date.slice(0, 16)}
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
          </div>
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-xl max-w-md">
          <p>Sprint created succesfully</p>
        </div>
      )}
    </>
  );
}
