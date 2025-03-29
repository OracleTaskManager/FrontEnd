import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface Props {}

function DashboardDev(props: Props) {
  const {} = props;

  return (
    <div className="bg-white min-h-screen min-w-screen">
      <Navbar pageTitle="Home" />
      <Sidebar />
    </div>
  );
}

export default DashboardDev;
