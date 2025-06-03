import React, { useEffect, useState } from "react";
import Sprint from "./Sprint";

interface Sprint {
  sprintId: number;
  name: string;
  startDate: string;
  endDate: string;
}

const ShowAllSprints: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const jwtToken = sessionStorage.getItem("token");

  //Fetch all Sprints
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await fetch("/api/tasks/sprints/", {
          headers: {
            Authorization: `${jwtToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        setSprints(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchSprints();
  }, []);

  return (
    <div>
      {sprints.map((sprint) => (
        <Sprint
          key={sprint.sprintId}
          name={sprint.name}
          startDate={sprint.startDate}
          endDate={sprint.endDate}
          sprintId={sprint.sprintId}
        />
      ))}
    </div>
  );
};

export default ShowAllSprints;
