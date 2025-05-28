// import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import "@fullcalendar/core/main.css";
import "@fullcalendar/resource-timeline/main.css";

function Calendar() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-white">
      {/* Navbar fijo arriba */}
      <Navbar pageTitle="Calendar" />

      <div className="flex flex-1">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar />
        {/* bg-[#D0CCD0] */}
        <div style={{ padding: "2rem" }}>
          <h2>Calendario de Tickets</h2>
          <FullCalendar
            plugins={[resourceTimelinePlugin]}
            initialView="resourceTimelineMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            slotMinWidth={30}
            aspectRatio={2.5}
            height="auto"
            resources={[
              { id: "1", title: "Ticket 1" },
              { id: "2", title: "Ticket 2" },
              { id: "3", title: "Ticket 3" },
              { id: "4", title: "Ticket 4" },
              { id: "5", title: "Ticket 5" },
              { id: "6", title: "Ticket 6" },
            ]}
            events={[
              {
                id: "a",
                resourceId: "1",
                start: "2025-01-01",
                end: "2025-02-15",
                title: "T1",
                color: "#007bff",
              },
              {
                id: "b",
                resourceId: "2",
                start: "2025-01-10",
                end: "2025-02-25",
                title: "T2",
                color: "#28a745",
              },
              {
                id: "c",
                resourceId: "3",
                start: "2025-02-01",
                end: "2025-03-20",
                title: "T3",
                color: "#ffc107",
              },
              {
                id: "d",
                resourceId: "4",
                start: "2025-01-15",
                end: "2025-02-25",
                title: "T4",
                color: "#dc3545",
              },
              {
                id: "e",
                resourceId: "5",
                start: "2025-02-10",
                end: "2025-04-01",
                title: "T5",
                color: "#6f42c1",
              },
              {
                id: "f",
                resourceId: "6",
                start: "2025-01-01",
                end: "2025-03-01",
                title: "T6",
                color: "#17a2b8",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default Calendar;
