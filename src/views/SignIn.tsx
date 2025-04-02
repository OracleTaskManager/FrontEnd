import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthContainer from "../components/AuthContainer";

function SignIn({ setShowSignUp }) {
  return (
    <div className="flex h-screen w-screen">
      {/* Sección Izquierda */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-[#D0CCD0]">
      <img src= "/src/assets/oracle_logo.webp"
          alt="Oracle Logo"
          className="absolute top-0 left-0 w-30 m-4" 
          />
        <AuthContainer title="Sign In">
          <InputField type="email" placeholder="Email" />
          <InputField type="password" placeholder="Password" />
          <Button text="Sign In" onClick={() => console.log()} />
        </AuthContainer>
      </div>

      {/* Sección Derecha */}
      <div className="w-1/2 flex flex-col items-center text-white mb-4 bg-[#312d2a] justify-center">
        <h2 className="text-6xl font-bold text-center mb-20">Don't have an account?</h2>
        <div className="mt-24">
          <p className="text-4xl mb-5">Sign up here</p>
          <Button text="Sign Up" onClick={() => setShowSignUp(true)} color="red" />
        </div>
      </div>
    </div>
  );
}

export default SignIn;