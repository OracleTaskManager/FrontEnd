function AuthContainer({ children, title }) {
    return (
        <div className="text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-6 text-black justify-center">{title}</h1>
          <div className="bg-white p-6 rounded-md shadow-md w-80">
            {children}
          </div>
        </div>
    );
}
  
export default AuthContainer;