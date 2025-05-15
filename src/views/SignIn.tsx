import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthContainer from "../components/AuthContainer";

function SignIn({ setShowSignUp }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await fetch("/api/auth/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        //Para debuguear
        const data = await response.json();
        //console.log("Datos de respuesta:", data);
        const token = data.token;
        const role = data.user?.role; // Extraer el rol del usuario

        if (token) {
          // Guardar el token en localStorage
          localStorage.setItem("token", token);

          // Redirigir según el rol
          if (role === "Manager") {
            navigate("/dashboard_manager");
          } else if (role === "Developer") {
            navigate("/dashboard");
          } else {
            console.error("Rol desconocido:", role);
          }
        } else {
          console.error("No se recibió el token");
        }
      } else {
        const errorText = await response.text();
        console.error("Login fallido:", response.statusText, errorText);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sección Izquierda */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-[#D0CCD0]">
        <img
          src="/src/assets/oracle_logo.webp"
          alt="Oracle Logo"
          className="absolute top-0 left-0 w-30 m-4"
        />
        <AuthContainer title="Sign In">
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button text="Sign In" onClick={handleSignIn} color="black"/>
        </AuthContainer>
      </div>

      {/* Sección Derecha */}
      <div className="w-1/2 flex flex-col items-center text-white mb-4 bg-[#312d2a] justify-center">
        <h2 className="text-6xl font-bold text-center mb-20">
          Don't have an account?
        </h2>
        <div className="mt-24">
          <p className="text-4xl mb-5">Sign up here</p>
          <Button
            text="Sign Up"
            onClick={() => setShowSignUp(true)}
            color="red"
          />
        </div>
      </div>
    </div>
  );
}

export default SignIn;