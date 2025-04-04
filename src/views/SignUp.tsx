import InputField from "../components/InputField";
import Button from "../components/Button";
import AuthContainer from "../components/AuthContainer";

function SignUp() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#D0CCD0]">
      <img src= "/src/assets/oracle_logo.webp"
          alt="Oracle Logo"
          className="absolute top-0 left-0 w-30 m-4" 
          />
      <AuthContainer title="Sign Up">
        <InputField type="text" placeholder="Name" />
        <InputField type="email" placeholder="Email" />
        <InputField type="password" placeholder="Password" />
        <Button type text="Sign Up" onClick={() => console.log("")} />
      </AuthContainer>
    </div>
  );
}

export default SignUp;