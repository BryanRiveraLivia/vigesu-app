import React, { FC } from "react";
import { AlertInfoProps } from "./AlertInfo.types";

const AlertInfo: React.FC<AlertInfoProps> = ({
  children,
  variant = "info",
  className = "",
}) => {
  return (
    <div
      role="alert"
      className={`alert alert-${variant} alert-soft mb-5 text-lg ${className} !hidden`}
    >
      <span>{children}</span>
    </div>
  );
};

export default AlertInfo;
