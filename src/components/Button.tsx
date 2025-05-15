import "./Button.css";

function Button({ text, onClick, color }) {
  let buttonClass;

  switch (color) {
    case "red":
      buttonClass = "button button-red";
      break;
    case "black":
      buttonClass = "button button-black";
      break;
    case "gray":
      buttonClass = "button button-gray";
      break;
    default:
      buttonClass = "button";
  }

  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;