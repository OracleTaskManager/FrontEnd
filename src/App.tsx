import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardDev from "./views/DashboardDev";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardDev />} />
      </Routes>
    </Router>
  );
}

export default App;
