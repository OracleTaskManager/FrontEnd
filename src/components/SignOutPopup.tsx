import React, { useState } from "react";
import Button from "./Button";
import AuthContainer from "../components/AuthContainer";
import SignUpAdmin from "../views/SignUpAdmin";

interface SignOutPopupProps {
  onClose: () => void;
  onSignOut: () => void;
}

const SignOutPopup: React.FC<SignOutPopupProps> = ({ onClose, onSignOut }) => {
  const isDashboardManager = sessionStorage.getItem("role") === "Manager";
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md text-black">
        {showSignUp ? (
          <SignUpAdmin setShowSignUp={setShowSignUp} />
        ) : (
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
              <Button text="Close" onClick={onClose} color="gray" />
            </div>
          </AuthContainer>
        )}
      </div>
    </div>
  );
};

export default SignOutPopup;
