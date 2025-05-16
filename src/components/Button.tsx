import { MouseEventHandler, ReactNode } from "react";
import "./Button.css";

type ButtonProps = {
  text: ReactNode; // <-- changed from string to ReactNode
  onClick: MouseEventHandler<HTMLButtonElement>;
  color?: "red" | "black" | "gray";
};

function Button({ text, onClick, color }: ButtonProps) {
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
