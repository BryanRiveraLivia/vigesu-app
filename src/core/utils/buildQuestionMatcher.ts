// ===== Tipos mínimos (no fuerzan tu modelo) =====
export type MinimalQuestion = {
  templateInspectionQuestionId: number;
  question?: string;
  typeQuestion?: number;
  templateInspectionId?: number;
};

export type MinimalDetailAnswerItem = {
  inspectionDetailAnswerItemId?: number;
  itemId?: string;
  itemName?: string;
  quantity?: number;
  price?: number;
};

export type MinimalDetailAnswer = {
  inspectionDetailAnswerId?: number;
  typeInspectionDetailAnswerId?: number;
  response?: string;
  items?: MinimalDetailAnswerItem[];
};

export type MinimalDetail = {
  inspectionDetailId?: number;
  typeInspectionDetailId?: number;
  templateInspectionQuestionId?: number; // ← opcional para tolerar tu IInspectionDetail
  typeInspectionDetailAnswerId?: number;
  finalResponse?: string;
  inspectionDetailAnswers?: MinimalDetailAnswer[];
};

// Resultado unificado genérico
export type QuestionMatchGeneric<Q, D> = {
  id: number;
  question: Q | null;
  detail: D | null;
};

// ====== BUILDER GENÉRICO ======
/**
 * Crea una función matcher con índices (O(1)) para buscar por templateInspectionQuestionId.
 * Tolera `undefined` en `data` y `inspectionDetails`, y también campos opcionales en los detalles.
 */
export function buildQuestionMatcherGeneric<
  Q extends MinimalQuestion,
  D extends MinimalDetail,
>(
  data?: {
    templateInspectionQuestions?: Q[];
  } | null,
  inspectionDetails?: D[] | null
) {
  const qById = new Map<number, Q>();
  for (const q of data?.templateInspectionQuestions ?? []) {
    // Solo indexa si el id es número
    if (typeof q.templateInspectionQuestionId === "number") {
      qById.set(q.templateInspectionQuestionId, q);
    }
  }

  const dById = new Map<number, D>();
  for (const d of inspectionDetails ?? []) {
    const id = d?.templateInspectionQuestionId;
    if (typeof id === "number") {
      dById.set(id, d);
    }
  }

  // ← devuelve la arrow usable en el componente
  return (id: number): QuestionMatchGeneric<Q, D> | null => {
    const question = qById.get(id) ?? null;
    const detail = dById.get(id) ?? null;

    if (!question && !detail) return null;

    const answers = (detail?.inspectionDetailAnswers ??
      []) as MinimalDetailAnswer[];
    const items = answers.flatMap((a) => a.items ?? []);

    return {
      id,
      question,
      detail,
    };
  };
}
