// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import DashboardDev from "./views/DashboardDev";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<DashboardDev />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { useState } from "react";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";

function App() {
  //const [en la primera posición, el estado, en la segunda posición, la función que actualiza el estado] = useState(valor inicial del estado);
  const [showSignUp, setShowSignUp] = useState(false);

  // Si showSignUp es true, muestra el componente SignUp, de lo contrario, muestra el componente SignIn
  return showSignUp ? <SignUp setShowSignUp={setShowSignUp} /> : <SignIn setShowSignUp={setShowSignUp} />;
}

export default App;