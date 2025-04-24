import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Calendar() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      {/* Navbar fijo arriba */}
      <Navbar pageTitle="Calendar" />

      <div className="flex flex-1">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar />
        {/* bg-[#D0CCD0] */}
      </div>
    </div>
  );
}

export default Calendar;
