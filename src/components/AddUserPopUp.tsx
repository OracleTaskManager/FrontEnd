import React, { useState } from "react";

interface AddUserToTeamModalProps {
  teamId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPcmFjbGUgUHJvamVjdCIsImlkIjoxMDYsInJvbGUiOiJNYW5hZ2VyIiwidGVsZWdyYW1DaGF0SWQiOm51bGwsImV4cCI6MTc0NTU0NzIyMn0.R8-I7iT_JPdZvDb9D00l9Us7-A32Yj8wpo20sUlUYqE";

const AddUserToTeamModal: React.FC<AddUserToTeamModalProps> = ({
  teamId,
  onClose,
  onSuccess,
}) => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddUser = async () => {
    if (!userId) {
      setError("User ID is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/userteams/add", {
        method: "POST",
        headers: {
          Authorization: `${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          teamId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add user to team");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error adding user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Add User to Team
        </h2>
        <input
          type="number"
          placeholder="User ID"
          className="w-full p-2 border border-gray-300 rounded mb-3 text-black"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUser}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Adding..." : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserToTeamModal;
