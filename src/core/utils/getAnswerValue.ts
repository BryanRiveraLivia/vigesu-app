import { LiftgateInspection } from "../types/order/ITypes";

export interface IInspectionDetailAnswerItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
}

export interface IInspectionDetailAnswer {
  inspectionDetailAnswerId: number;
  typeInspectionDetailAnswerId: number;
  response: string;
  items: IInspectionDetailAnswerItem[];
}

export interface IInspectionDetail {
  inspectionDetailId: number;
  templateInspectionQuestionId: number;
  typeInspectionDetailId: number;
  typeInspectionDetailAnswerId: number;
  finalResponse: string;
  inspectionDetailAnswers: IInspectionDetailAnswer[];
}

interface TemplateInspectionQuestion {
  templateInspectionQuestionId: number;
  question: string;
  typeQuestion: number;
  templateInspectionId: number;
}

/**
 * Retorna las respuestas (inspectionDetailAnswers) que coinciden entre preguntas y respuestas
 * @param templateQuestions Lista de preguntas de plantilla
 * @param inspectionDetails Lista de detalles de inspección
 * @returns Un array con los inspectionDetailAnswers de cada match encontrado
 */
export const getAnswersFromDetails = (
  templateQuestions: TemplateInspectionQuestion[],
  inspectionDetails: IInspectionDetail[]
): IInspectionDetailAnswer[][] => {
  return templateQuestions.map((question) => {
    const match = inspectionDetails.find(
      (detail) =>
        detail.templateInspectionQuestionId ===
        question.templateInspectionQuestionId
    );

    return match?.inspectionDetailAnswers ?? [];
  });
};
