import React from "react";
import { IFullAnswer } from "../../types/IFullTypeInspection";

export interface AnswerOptionsProps {
  answers: IFullAnswer[];
  renderAnswer: (answer: IFullAnswer, level?: number) => React.ReactNode;
}
