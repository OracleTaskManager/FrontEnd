type InputFieldProps = {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputField({ type, placeholder, value, onChange }: InputFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-2 mb-4 border rounded border-gray-300 placeholder-gray-500 text-black" 
    />
  );
}

export default InputField;