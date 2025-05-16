import React, { useEffect, useState } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";

type ChartDatum = {
  userName: string;
  sprintName: string;
  total: number;
};

type GroupedData = {
  [sprintName: string]: {
    [userName: string]: number;
  };
};

type FormattedData = {
  sprintName: string;
  [userName: string]: number | string;
};

type Props = {
  title: string;
  fetchData: () => Promise<ChartDatum[]>;
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

export const BarChartMulti: React.FC<Props> = ({ title, fetchData }) => {
  const [data, setData] = useState<FormattedData[]>([]);
  const [userNames, setUserNames] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const rawData = await fetchData();

        // Agrupar datos por sprint
        const grouped: GroupedData = {};
        const usersSet = new Set<string>();

        rawData.forEach(({ userName, sprintName, total }) => {
          usersSet.add(userName);
          if (!grouped[sprintName]) grouped[sprintName] = {};
          grouped[sprintName][userName] = total;
        });

        const formatted: FormattedData[] = Object.entries(grouped).map(
          ([sprintName, users]) => ({
            sprintName,
            ...users,
          })
        );

        setData(formatted);
        setUserNames(Array.from(usersSet));
      } catch (error) {
        console.error("Error loading chart data:", error);
      }
    };

    loadData();
  }, [fetchData]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3 className="text-center text-black">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sprintName" />
          <YAxis />
          <Tooltip />
          <Legend />
          {userNames.map((name, index) => (
            <Bar
              key={name}
              dataKey={name}
              fill={COLORS[index % COLORS.length]}
              name={name}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartMulti;
