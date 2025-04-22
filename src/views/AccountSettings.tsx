import { useState, useEffect } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthContainer from "../components/AuthContainer";

function AccountSettings() {
  // Estados locales para datos del usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Cargar los datos reales del usuario desde la API 
  useEffect(() => {
    // Datos de la cuenta actual
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
    };

    setName(userData.name);
    setEmail(userData.email);
  }, []);

  const handleUpdate = () => {
    // Llamar a tu API para actualizar los datos
    console.log("Datos actualizados:", { name, email, password });
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#D0CCD0]">
      <img
        src="/src/assets/oracle_logo.webp"
        alt="Oracle Logo"
        className="absolute top-0 left-0 w-30 m-4"
      />
      <AuthContainer title="Account Settings">
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
          placeholder="New Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button text="Save Changes" onClick={handleUpdate} />
      </AuthContainer>
    </div>
  );
}

export default AccountSettings;
