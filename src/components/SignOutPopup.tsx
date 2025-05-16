import React, { useState } from "react";
import Button from "./Button";
import AuthContainer from "../components/AuthContainer";
import SignUpAdmin from "../views/SignUpAdmin";
import UpdateUserForm from "../views/UpdateUserForm";

interface SignOutPopupProps {
  onClose: () => void;
  onSignOut: () => void;
}

const SignOutPopup: React.FC<SignOutPopupProps> = ({ onClose, onSignOut }) => {
  const isDashboardManager = sessionStorage.getItem("role") === "Manager";
  const [showSignUp, setShowSignUp] = useState(false);
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? You will lose all your information."
    );

    if (!confirmDelete) return;

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
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        console.log("Cuenta eliminada con éxito");
        sessionStorage.clear(); // Limpiar el almacenamiento de sesión
        window.location.href = "/"; // Redirigir al login
      } else {
        const errorText = await response.text();
        console.error("Error al eliminar la cuenta:", errorText);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md text-black">
        {(() => {
          if (showUpdateUserForm) {
            return <UpdateUserForm setShowUpdateForm={setShowUpdateUserForm} />;
          }
          if (showSignUp) {
            return <SignUpAdmin setShowSignUp={setShowSignUp} />;
          }
          return (
            <AuthContainer title="Select an option">
              {isDashboardManager && (
                <Button
                  text={
                    <>
                      <img
                        src="/src/assets/add_user_icon_184116.svg"
                        alt="Add User Icon"
                        className="inline-block w-4 h-4 mr-2 filter invert"
                      />
                      <span>Register Manager</span>
                    </>
                  }
                  onClick={() => setShowSignUp(true)}
                  color="black"
                />
              )}
              <div className="mt-4">
                <Button
                  text={<span>Update data</span>}
                  onClick={() => setShowUpdateUserForm(true)}
                  color="black"
                />
              </div>
              <div className="mt-4">
                <Button
                  text={
                    <>
                      <img
                        src="/src/assets/log_out_icon_128821.svg"
                        alt="Log out icon"
                        className="inline-block w-4 h-4 mr-2 filter invert"
                      />
                      <span>Log out</span>
                    </>
                  }
                  onClick={onSignOut}
                  color="red"
                />
              </div>
              <div className="mt-4">
                <Button
                  text={
                    <>
                      <img
                        src="/src/assets/biggarbagebin_121980.svg"
                        alt="Delete account icon"
                        className="inline-block w-4 h-4 mr-2 filter invert"
                      />
                      <span>Delete Account</span>
                    </>
                  }
                  onClick={handleDeleteAccount}
                  color="red"
                />
              </div>
              <div className="mt-4">
                <Button text="Close" onClick={onClose} color="gray" />
              </div>
            </AuthContainer>
          );
        })()}
      </div>
    </div>
  );
};

export default SignOutPopup;
