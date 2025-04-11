import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import DashboardDev from "./views/DashboardDev";

function App() {
  //const [en la primera posición, el estado, en la segunda posición, la función que actualiza el estado] = useState(valor inicial del estado);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            showSignUp ? (
              <SignUp setShowSignUp={setShowSignUp} />
            ) : (
              <SignIn setShowSignUp={setShowSignUp} />
            )
          }
        />
        <Route path="/dashboard" element={<DashboardDev />} />
      </Routes>
    </Router>
  );
}

export default App;
