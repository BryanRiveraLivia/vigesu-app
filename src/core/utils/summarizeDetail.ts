type MinimalDetailAnswerItem = {
  inspectionDetailAnswerItemId?: number;
  itemId?: string;
  itemName?: string;
  quantity?: number;
  price?: number;
};

type MinimalDetailAnswer = {
  inspectionDetailAnswerId?: number;
  typeInspectionDetailAnswerId?: number;
  response?: string;
  items?: MinimalDetailAnswerItem[];
};

type MinimalDetail = {
  inspectionDetailId?: number;
  typeInspectionDetailId?: number;
  templateInspectionQuestionId?: number;
  typeInspectionDetailAnswerId?: number;
  finalResponse?: string;
  inspectionDetailAnswers?: MinimalDetailAnswer[];
};

type SummaryResult = {
  OK: boolean;
  Defective: boolean;
  Repairs: string; // "itemName: quantity, ..."
};

/**
 * Defective solo si aparece el código 'D1' (configurable).
 */
export const summarizeDetail = (
  detail?: MinimalDetail | null,
  defectiveCode: string = "D"
): SummaryResult => {
  const norm = (v?: string) => (v ?? "").trim().toUpperCase();
  const code = norm(defectiveCode);

  const final = norm(detail?.finalResponse);
  const answers = detail?.inspectionDetailAnswers ?? [];

  const okFromFinal = final === "OK";
  const okFromAnswers = answers.some((a) => norm(a.response) === "OK");

  const defectiveFromFinal = final === code;
  const defectiveFromAnswers = answers.some((a) => norm(a.response) === code);

  const OK = okFromFinal || okFromAnswers;
  const Defective = defectiveFromFinal || defectiveFromAnswers;

  const allItems = answers.flatMap((a) => a.items ?? []);
  const Repairs = allItems
    .map((it) => {
      const name = (it.itemName ?? "").trim() || "Item";
      const qty = it.quantity ?? 0;
      return `${name}: ${qty}`;
    })
    .join(", ");

  return { OK, Defective, Repairs };
};
