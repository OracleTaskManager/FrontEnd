import React, { useEffect, useState } from "react";

interface AddUserToTeamModalProps {
  teamId: number;
  onClose: () => void;
  onSuccess: () => void;
}

<<<<<<< HEAD
const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPcmFjbGUgUHJvamVjdCIsImlkIjo2MSwicm9sZSI6Ik1hbmFnZXIiLCJ0ZWxlZ3JhbUNoYXRJZCI6MTg2MDkxMzEyMCwiZXhwIjoxNzQ3MzEwMDQ5fQ.h2ypz6neBUUlx9IhuxWpdjyvXhQO8kPlrTDReBGy30w";
=======
const jwtToken = localStorage.getItem("token");
  // Para debuguear
  // if (jwtToken) {
  //   console.log("Token disponible:", jwtToken);
  // } else {
  //   console.error("No se encontró el token");
  // }
>>>>>>> origin/sayid
interface User {
  userId: number;
  name: string;
}

const AddUserToTeamModal: React.FC<AddUserToTeamModalProps> = ({
  teamId,
  onClose,
  onSuccess,
}) => {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/auth/users", {
          headers: {
            Authorization: `${jwtToken}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Could not load users.");
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!userId) {
      setError("Please select a user.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/userteams/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          teamId,
        }),
      });

      if (!response.ok) throw new Error("Failed to add user to team");

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

        <select
          className="w-full p-2 border border-gray-300 rounded mb-3 text-black"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.userId} - {user.name}
            </option>
          ))}
        </select>

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
