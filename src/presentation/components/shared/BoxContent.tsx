import { generalReactChildren } from "@/core/types/TGeneral";
import React, { FC } from "react";

const BoxContent: FC<generalReactChildren> = ({ children }) => {
  return <div className="bg-[white] p-4 rounded-md max-h-auto">{children}</div>;
};

export default BoxContent;
