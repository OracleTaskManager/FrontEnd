import { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthContainer from "../components/AuthContainer";

function SignUp({ setShowSignUp }: { readonly setShowSignUp: (value: boolean) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workMode, setWorkMode] = useState("On Site");
  const [telegramChatId] = useState(null);
  const [role, setRole] = useState("Developer");

  // Obtener el rol del usuario actual para esto primero tuvo que haber iniciado sesión
  const userRole = sessionStorage.getItem("role"); 

  const handleSignUp = async () => {
    try {
      const endpoint =
        userRole === "Manager"
          ? "/api/auth/users/register-admin"
          : "/api/auth/users/register";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (userRole === "Manager") {
        const adminToken = sessionStorage.getItem("token"); // Obtener el token del admin
        if (adminToken) {
          headers["Authorization"] = `Bearer ${adminToken}`;
        } else {
          console.error("No se encontró el token de administrador");
          return;
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name,
          email,
          password,
          workMode,
          role: userRole === "Manager" ? role : "Developer", // Rol por defecto Developer
          telegramChatId,
        }),
      });

      if (response.ok) {
        console.log("Usuario registrado con éxito");
        setShowSignUp(false); // Vuelve al login
      } else {
        const errorText = await response.text();
        console.error("Registro fallido:", errorText);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#D0CCD0]">
      <img
        src="/src/assets/oracle_logo.webp"
        alt="Oracle Logo"
        className="absolute top-0 left-0 w-30 m-4"
      />
      <AuthContainer title="Sign Up">
        <InputField
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <label
          htmlFor="workMode"
          className="w-full text-left text-sm text-gray-600 mb-1"
        >
          Work Mode
        </label>
        <select
          id="workMode"
          value={workMode}
          onChange={(e) => setWorkMode(e.target.value)}
          className="w-full p-2 mb-4 border rounded border-gray-300 text-black"
        >
          <option value="On Site">On Site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        {userRole === "Manager" && (
          <>
            <label
              htmlFor="role"
              className="w-full text-left text-sm text-gray-600 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 mb-4 border rounded border-gray-300 text-black"
            >
              <option value="Developer">Developer</option>
              <option value="Manager">Manager</option>
            </select>
          </>
        )}

        <Button text="Sign Up" onClick={handleSignUp} color="black" />
      </AuthContainer>
    </div>
  );
}

export default SignUp;
