function Button({ text, onClick, color = "black" }) {
    const buttonColor = color === "red" ? "bg-red-600" : "bg-black";
    return (
        <button 
            className={`bg-red w-full p-2 text-white rounded ${buttonColor}`} 
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;