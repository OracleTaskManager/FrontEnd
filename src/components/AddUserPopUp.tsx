import React, { useState } from "react";
const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPcmFjbGUgUHJvamVjdCIsImlkIjoxMDYsInJvbGUiOiJNYW5hZ2VyIiwidGVsZWdyYW1DaGF0SWQiOm51bGwsImV4cCI6MTc0NTU0NzIyMn0.R8-I7iT_JPdZvDb9D00l9Us7-A32Yj8wpo20sUlUYqE";
const handleAddUserToTeam = async (teamId: number) => {
  const userId = prompt("Enter the User ID to add to this team:");

  if (!userId) return;

  try {
    const response = await fetch("/userteams/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: Number(userId),
        teamId: teamId,
      }),
    });

    if (!response.ok) throw new Error("Failed to add user to team");

    alert("User added successfully!");
  } catch (error) {
    console.error("Error adding user to team:", error);
    alert("Something went wrong!");
  }
};

export default handleAddUserToTeam;
