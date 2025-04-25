import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: () => void;
  token: string;
}

const CreateTeamModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onTeamCreated,
  token,
}) => {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!teamName) return setError("Team name is required");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/teams/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teamName }),
      });

      if (!res.ok) throw new Error("Failed to create team");

      setTeamName("");
      onClose();
      onTeamCreated();
    } catch (err) {
      setError("Error creating team");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Create New Team
        </h2>
        <input
          type="text"
          placeholder="Team name"
          className="w-full p-2 border border-gray-300 rounded mb-3 text-black placeholder-gray-500"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
