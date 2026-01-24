import { generalReactChildren } from "@/core/types/TGeneral";
import React, { FC } from "react";

const formGroup: FC<generalReactChildren> = ({ children }) => {
  return (
    <div className="form-group w-full flex flex-col gap-1 ">{children}</div>
  );
};

export default formGroup;
