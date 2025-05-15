import React from "react";

type Task = {
  name: string;
  developer: string;
  estimated: number;
  actual: number;
};

type TaskTableProps = {
  tasks: Task[];
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  return (
    <div className="overflow-x-auto p-4 text-black">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border border-gray-200 px-4 py-2">Task Name</th>
            <th className="border border-gray-200 px-4 py-2">Developer</th>
            <th className="border border-gray-200 px-4 py-2">
              Estimated Hours
            </th>
            <th className="border border-gray-200 px-4 py-2">Actual Hours</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <tr key={idx} className="border-t">
              <td className="border border-gray-200 px-4 py-2">{task.name}</td>
              <td className="border border-gray-200 px-4 py-2">
                {task.developer}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {task.estimated}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {task.actual}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
