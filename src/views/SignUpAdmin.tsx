import { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthContainer from "../components/AuthContainer";

interface SignUpAdminProps {
  readonly setShowSignUp: (value: boolean) => void;
}

function SignUpAdmin({ setShowSignUp }: SignUpAdminProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [workMode, setWorkMode] = useState("On Site");
  const [role] = useState("Manager");
  const [telegramChatId, setTelegramChatId] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      const endpoint = "/api/auth/users/register-admin";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const token = sessionStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.error("No se encontró el token de administrador");
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
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
        setShowSignUp(false); // Vuelve al popup principal
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
        src="/oracle_logo.webp"
        alt="Oracle Logo"
        className="absolute top-0 left-0 w-30 m-4"
      />
      <AuthContainer title="Add an Admin">
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

        <InputField
          type="text"
          placeholder="Telegram Chat ID"
          value={telegramChatId ?? ""}
          onChange={(e) => setTelegramChatId(e.target.value)}
        />

        <Button
          text={
            <>
              <img
                src="/register_login_signup_icon_219991.svg"
                alt="Sign up icon"
                className="inline-block w-4 h-4 mr-2 filter invert"
              />
              <span>Sign Up</span>
            </>
          }
          onClick={handleSignUp}
          color="black"
        />
        <Button
          text={
          <>
            <img
              src="/1904654-cancel-close-cross-delete-reject-remove-stop_122504.svg"
              alt="Log out icon"
              className="inline-block w-4 h-4 mr-2 filter invert"
            />
            <span>Cancel</span>
          </>
        }
          onClick={() => setShowSignUp(false)}
          color="gray"
        />
      </AuthContainer>
    </div>
  );
}

export default SignUpAdmin;
