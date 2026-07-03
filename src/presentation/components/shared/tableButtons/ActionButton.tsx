import React from "react";
import { ActionButtonProps } from "./ActionButton.types";

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`btn min-w-[30px] min-h-[30px] p-2 rounded-md ${className}`}
    >
      {icon && icon}
      {label && (
        <span className="hidden xl:block text-[12px] font-normal">{label}</span>
      )}
    </button>
  );
};

export default ActionButton;
