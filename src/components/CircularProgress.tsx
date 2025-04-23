import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgress = ({ totalTasks, completedTasks }) => {
  const percentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div style={{ width: 120, height: 120 }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          textColor: "#333",
          pathColor: "#4caf50",
          trailColor: "#d6d6d6",
        })}
      />
    </div>
  );
};

export default CircularProgress;
