import React, { useState } from "react";
import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthContainer from "../components/AuthContainer";

interface UpdateUserFormProps {
  setShowUpdateForm: (value: boolean) => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ setShowUpdateForm }) => {
  const [name, setName] = useState("");
  const [workMode, setWorkMode] = useState("On Site");
  const [telegramChatId, setTelegramChatId] = useState<string | null>(null);

  const handleUpdate = async () => {
    try {
      const endpoint = "/api/auth/users/";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const token = sessionStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.error("No se encontró el token del usuario");
        return;
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          name,
          workMode,
          telegramChatId,
        }),
      });

      if (response.ok) {
        console.log("Datos actualizados con éxito");
        setShowUpdateForm(false);
      } else {
        const errorText = await response.text();
        console.error("Actualización fallida:", errorText);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <AuthContainer title="Update User Info">
      <InputField
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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

      <Button text="Update" onClick={handleUpdate} color="red" />
      <Button 
      text={
          <>
            <img
              src="/src/assets/1904654-cancel-close-cross-delete-reject-remove-stop_122504.svg"
              alt="Cancel icon"
              className="inline-block w-4 h-4 mr-2 filter invert"
            />
            <span>Cancel</span>
          </>
        }
      onClick={() => setShowUpdateForm(false)} color="gray" />
    </AuthContainer>
  );
};

export default UpdateUserForm;
