// components/AnswerOptions.tsx
import React from "react";
import { AnswerOptionsProps } from "./AnswerOptions.types";

const AnswerOptions = ({ answers, renderAnswer }: AnswerOptionsProps) => {
  return (
    <div className="mt-4 flex flex-row gap-4 flex-nowrap overflow-x-auto">
      {answers.map((answer) => (
        <div
          key={answer.typeInspectionDetailAnswerId}
          className="flex flex-col items-center"
        >
          {renderAnswer(answer, 0)}
        </div>
      ))}
    </div>
  );
};

export default AnswerOptions;
