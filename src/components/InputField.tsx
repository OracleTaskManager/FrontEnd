function InputField({ type, placeholder }) {
    return (
      <input 
        className="w-full p-2 mb-4 border rounded border-gray-300 placeholder-gray-500 text-black" 
        type={type} 
        placeholder={placeholder} 
      />
    );
}
  
export default InputField;