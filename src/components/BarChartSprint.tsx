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

const data = [
  { sprint: "Sprint 1", hours: 4 },
  { sprint: "Sprint 2", hours: 0 },
  { sprint: "Sprint 3", hours: 8 },
  { sprint: "Sprint 4", hours: 0 },
  { sprint: "Sprint 5", hours: 0 },
  { sprint: "Sprint 6", hours: 12 },
  { sprint: "Sprint 7", hours: 9 },
  { sprint: "Sprint 8", hours: 14 },
  { sprint: "Sprint 9", hours: 9 },
  { sprint: "Sprint 10", hours: 12 },
];

const BarChartSprint = () => {
  return (
    <div className="w-full h-[300px] bg-white rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-4">Hours Invested Per Sprint</h2>
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
