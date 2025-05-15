import "./Button.css";

function Button({ text, onClick, color }) {
  const buttonClass = color === "red" ? "button button-red" : "button button-black";

  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;