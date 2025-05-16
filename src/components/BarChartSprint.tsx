import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type DataItem = {
  sprint: string;
  hours: number;
};

type Props = {
  data: DataItem[];
};

const BarChartSprint: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-[500px] h-[300px] bg-white rounded-xl shadow p-4 text-black">
      <h2 className="text-xl font-bold mb-4 ">Hours Invested Per Sprint</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sprint" />
          <YAxis
            label={{ value: "Hours", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="hours" fill="#a78bfa" name="Hours Invested" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartSprint;
