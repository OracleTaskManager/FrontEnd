import { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthContainer from "../components/AuthContainer";

function SignUp({ setShowSignUp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workMode, setWorkMode] = useState("On Site");
  const [telegramChatId] = useState(null);
  const [role, setRole] = useState("Developer");

  const handleSignUp = async () => {
    try {
      //debug
      // console.log("Intentando registrar usuario:", {
      //   name,
      //   email,
      //   password,
      //   workMode,
      //   telegramChatId,
      //   role,
      // });
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          workMode,
          role,
          telegramChatId,
        }),
      });

      if (response.ok) {
        console.log("Usuario registrado con éxito");
        setShowSignUp(false); // Vuelve al login
      } else {
        // Manejo de errores para el registro fallido
        const errorText = await response.text();
        console.error("Registro fallido:", errorText);
      }
    } catch (error) {
      // Manejo de errores de red o de otro tipo
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
        <Button text="Sign Up" onClick={handleSignUp} color="black"/>
      </AuthContainer>
    </div>
  );
}

export default SignUp;
