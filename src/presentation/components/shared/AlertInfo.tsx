import React from "react";

interface AlertInfoProps {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error" | "neutral";
  className?: string;
}

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
