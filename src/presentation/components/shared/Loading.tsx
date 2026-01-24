import React, { FC } from "react";

interface LoadingProps {
  height?: string;
  enableLabel?: boolean;
  label?: string;
  size?: string;
  className?: string;
}

const Loading: FC<LoadingProps> = ({
  height,
  enableLabel = true,
  label,
  size,
  className,
}) => {
  return (
    <div
      className={`flex flex-col w-full items-center justify-center ${
        height ?? "h-[88vh]"
      } ${className}`}
    >
      <span
        className={`loading loading-spinner ${size ?? "loading-lg"}`}
      ></span>
      {enableLabel && (
        <div className="mt-2 font-medium">{label ?? "Cargando datos..."}</div>
      )}
    </div>
  );
};

export default Loading;
