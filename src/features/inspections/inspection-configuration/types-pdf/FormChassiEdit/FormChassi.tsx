import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import InspectionModal from "./InspectionModal";
import { AnswerNode } from "./AnswerItem";
import { IoAddCircleOutline } from "react-icons/io5";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import ActionButton from "@/shared/components/shared/tableButtons/ActionButton";
import { GrDuplicate } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import {
  ExportedAnswer,
  ExportedQuestion,
} from "@/shared/types/inspection/ITypes";
import {
  TypeQuestion,
  TypeQuestionLabel,
} from "@/features/orders/models/workOrder.types";
import { IoIosInformationCircleOutline } from "react-icons/io";

const STATUS_ACTIVE = 0 as const;
const STATUS_DELETED = 1 as const;

const dedupeAnswers = (answers: ExportedAnswer[]): ExportedAnswer[] => {
  const seen = new Set<string>();
  const out: ExportedAnswer[] = [];
  for (const a of answers ?? []) {
    const key =
      `${(a.response || "").trim()}|${a.color || ""}|` +
      `${a.usingItem ? 1 : 0}|${a.isPrintable ? 1 : 0}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({
        ...a,
        subTypeInspectionDetailAnswers: dedupeAnswers(
          a.subTypeInspectionDetailAnswers ?? []
        ),
      });
    }
  }
  return out;
};

const newLocalId = (): string =>
  `n_${Date.now()}_${Math.random().toString(36).slice(2)}`;

type LocalQuestion = ExportedQuestion & { _localId: string };

type ModalDraft = {
  questionText: string;
  answers: AnswerNode[];
  groupId: number;
  selectedQuestion: {
    templateInspectionQuestionId: number;
    question: string;
    typeQuestion: number;
  };
};

// ✅ FIX: incluir usePrint leyendo de isPrintable
const toAnswerNodes = (answers: ExportedAnswer[] = []): AnswerNode[] =>
  (answers ?? []).map((a) => ({
    id: a.id != null ? String(a.id) : newLocalId(),
    label: a.response,
    color: a.color,
    useParts: !!a.usingItem,
    usePrint: !!a.isPrintable, // <-- AQUÍ el fix
    children: toAnswerNodes(a.subTypeInspectionDetailAnswers ?? []),
  }));

const collectExistingIds = (
  answers: ExportedAnswer[] = [],
  out = new Set<number>()
): Set<number> => {
  for (const a of answers ?? []) {
    if (typeof a.id === "number" && a.id > 0) out.add(a.id);
    if (a.subTypeInspectionDetailAnswers?.length) {
      collectExistingIds(a.subTypeInspectionDetailAnswers, out);
    }
  }
  return out;
};

// ✅ FIX: escribir isPrintable usando node.usePrint (no hardcodear true)
const nodesToExportedAnswersWithWhitelist = (
  nodes: AnswerNode[] = [],
  whitelist: Set<number>
): ExportedAnswer[] =>
  (nodes ?? []).map((n) => {
    const num = /^\d+$/.test(n.id) ? Number(n.id) : NaN;
    const preserve = Number.isFinite(num) && whitelist.has(num);
    return {
      id: preserve ? num : undefined,
      response: n.label,
      color: n.color,
      usingItem: !!n.useParts,
      isPrintable: !!n.usePrint, // <-- AQUÍ el fix
      subTypeInspectionDetailAnswers: nodesToExportedAnswersWithWhitelist(
        n.children ?? [],
        whitelist
      ),
    };
  });

const forceIdsToZero = (answers: ExportedAnswer[] = []): ExportedAnswer[] =>
  (answers ?? []).map((a) => ({
    ...a,
    id: 0,
    subTypeInspectionDetailAnswers: forceIdsToZero(
      a.subTypeInspectionDetailAnswers ?? []
    ),
  }));

interface FormChassiProps {
  register: UseFormRegister<{
    client: string;
    name: string;
    theme: string;
    status?: string;
  }>;
  errors: FieldErrors<{
    client: string;
    name: string;
    theme: string;
    status?: string;
  }>;
  onQuestionsChange?: (hasQuestions: boolean) => void;
  templateName: string;
  templateId: number;
  onQuestionsExport?: (questions: ExportedQuestion[]) => void;
  initialQuestions?: ExportedQuestion[];
}

const FormChassi: React.FC<FormChassiProps> = ({
  onQuestionsChange,
  templateName,
  templateId,
  onQuestionsExport,
  initialQuestions,
}) => {
  console.log("initialQuestions", initialQuestions);
  const [openModal, setOpenModal] = useState(false);
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [editingLocalId, setEditingLocalId] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [modalDraft, setModalDraft] = useState<ModalDraft | null>(null);

  const countOccurrences = (
    templateInspectionQuestionId: number,
    excludeLocalId?: string
  ) =>
    questions.filter(
      (q) =>
        q.status !== STATUS_DELETED &&
        q.templateInspectionQuestionId === templateInspectionQuestionId &&
        (!excludeLocalId || q._localId !== excludeLocalId)
    ).length;

  const buildDraftFromLocalQuestion = (q: LocalQuestion): ModalDraft => ({
    questionText: q.question,
    answers: toAnswerNodes(q.typeInspectionDetailAnswers ?? []), // <-- ahora trae usePrint correcto
    groupId: q.groupId,
    selectedQuestion: {
      templateInspectionQuestionId: q.templateInspectionQuestionId,
      question: q.question,
      typeQuestion: q.typeQuestion,
    },
  });

  const openCreate = () => {
    setEditingLocalId(null);
    setIsDuplicating(false);
    setModalDraft(null);
    setOpenModal(true);
  };

  const handleSave = (
    question: string,
    answers: AnswerNode[],
    group: { groupId: number },
    selectedQuestion: {
      templateInspectionQuestionId: number;
      question: string;
      typeQuestion: number;
    }
  ) => {
    const validAnswers = answers.filter((a) => a.label.trim() !== "");
    if (validAnswers.length === 0) {
      alert("Debe agregar al menos una respuesta válida");
      return;
    }

    const tplId = selectedQuestion.templateInspectionQuestionId;

    if (editingLocalId) {
      const occ = countOccurrences(tplId, editingLocalId);
      if (occ + 1 > 2) {
        alert(
          "Esta pregunta ya está usada dos veces. Cambie la selección de pregunta antes de guardar."
        );
        return;
      }

      const original = questions.find((q) => q._localId === editingLocalId);
      const whitelist = collectExistingIds(
        original?.typeInspectionDetailAnswers ?? []
      );

      const formattedAnswers = dedupeAnswers(
        nodesToExportedAnswersWithWhitelist(validAnswers, whitelist)
      );

      setQuestions((prev) =>
        prev.map((q) =>
          q._localId !== editingLocalId
            ? q
            : {
                ...q,
                templateInspectionQuestionId: tplId,
                question,
                typeQuestion: selectedQuestion.typeQuestion,
                groupId: group.groupId,
                status: STATUS_ACTIVE,
                typeInspectionDetailAnswers: formattedAnswers,
              }
        )
      );

      setEditingLocalId(null);
      setModalDraft(null);
      setOpenModal(false);
      return;
    }

    const occ = countOccurrences(tplId);
    if (occ + 1 > 2) {
      alert(
        "Esta pregunta ya está usada dos veces. Cambie la selección de pregunta antes de guardar."
      );
      return;
    }

    const baseAnswers = dedupeAnswers(
      nodesToExportedAnswersWithWhitelist(validAnswers, new Set<number>())
    );

    const answersForInsert = isDuplicating
      ? forceIdsToZero(baseAnswers)
      : baseAnswers;

    const newEntry: LocalQuestion = {
      _localId: newLocalId(),
      typeInspectionDetailId: isDuplicating ? 0 : undefined,
      templateInspectionQuestionId: tplId,
      question,
      typeQuestion: selectedQuestion.typeQuestion,
      groupId: group.groupId,
      status: STATUS_ACTIVE,
      typeInspectionDetailAnswers: answersForInsert,
    };

    setQuestions((prev) => [...prev, newEntry]);
    setModalDraft(null);
    setOpenModal(false);
    setIsDuplicating(false);
  };

  const handleDuplicateById = (localId: string) => {
    const original = questions.find((q) => q._localId === localId);
    if (!original) return;

    const occ = countOccurrences(original.templateInspectionQuestionId);
    if (occ >= 2) {
      alert(
        "Esta pregunta ya está usada dos veces. Se abrirá el formulario para que cambie la selección."
      );
    }

    const draft = buildDraftFromLocalQuestion(original);
    setEditingLocalId(null);
    setIsDuplicating(true);
    setModalDraft(draft);
    setOpenModal(true);
  };

  const handleEditById = (localId: string) => {
    const q = questions.find((x) => x._localId === localId);
    if (!q) return;

    const draft = buildDraftFromLocalQuestion(q);
    setEditingLocalId(localId);
    setIsDuplicating(false);
    setModalDraft(draft);
    setOpenModal(true);
  };

  const handleDeleteById = (localId: string) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q._localId === localId);
      if (idx === -1) return prev;
      const q = prev[idx];

      if (!q.typeInspectionDetailId || q.typeInspectionDetailId === 0) {
        return prev.filter((x) => x._localId !== localId);
      }

      const next = [...prev];
      next[idx] = { ...q, status: STATUS_DELETED };
      return next;
    });
  };

  const getFirstLevelAnswers = (answers: ExportedAnswer[]) =>
    (answers ?? [])
      .filter((a) => a.response.trim() !== "")
      .map((a) => a.response)
      .join(", ");

  useEffect(() => {
    if (onQuestionsChange)
      onQuestionsChange(questions.some((q) => q.status !== STATUS_DELETED));
  }, [questions, onQuestionsChange]);

  useEffect(() => {
    if (!onQuestionsExport) return;

    const cleaned: ExportedQuestion[] = questions.map((q) => {
      const { _localId: _omit, ...rest } = q;
      return {
        ...rest,
        typeInspectionDetailAnswers: dedupeAnswers(
          rest.typeInspectionDetailAnswers ?? []
        ),
      };
    });

    onQuestionsExport(cleaned);
  }, [questions, onQuestionsExport]);

  const getTypeQuestionLabel = (type?: number): string => {
    if (type === null || type === undefined) return "";
    return TypeQuestionLabel[type as TypeQuestion] ?? String(type);
  };

  useEffect(() => {
    const copy = JSON.parse(
      JSON.stringify(initialQuestions || [])
    ) as ExportedQuestion[];
    const seeded: LocalQuestion[] = copy.map((q) => ({
      ...q,
      _localId: newLocalId(),
      typeInspectionDetailAnswers: dedupeAnswers(
        q.typeInspectionDetailAnswers ?? []
      ),
    }));
    setQuestions(seeded);
  }, [initialQuestions]);

  const visibleRows = questions
    .filter((q) => q.status !== STATUS_DELETED)
    .map((q) => ({ q, localId: q._localId }));

  return (
    <>
      <h2 className="font-bold text-xl md:text-2xl lg:text-3xl text-center mb-5">
        {templateName || "Create Inspection"}
      </h2>

      <div className="rounded-box border-[#00000014] border-1 mb-6 p-3 gap-0 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-5 p-2">
          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="btn min-w-[30px] min-h-[39px] p-2 rounded-md"
          >
            <IoAddCircleOutline className="text-2xl" />
            Add row
          </button>

          <div className="overflow-x-auto rounded-box border-[#00000014] border-1">
            <table className="table w-full">
              <thead className="bg-[#191917]">
                <tr className="border-b-[#00000014]">
                  <th className="text-center w-[30%] text-white font-medium">
                    Description
                  </th>
                  <th className="text-center w-[15%] text-white font-medium">
                    Tipo
                  </th>
                  <th className="text-center w-[30%] text-white font-medium">
                    Respuestas automáticas
                  </th>
                  <th className="text-center w-[25%] text-white font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map(({ q, localId }) => (
                  <tr key={localId}>
                    <td className="text-left">
                      <div
                        className="w-[300px] overflow-hidden text-ellipsis"
                        aria-label="question"
                      >
                        <span className="truncate">{q.question}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <label className="rounded-full text-sm bg-red-400 order-1 md:order-2  md:flex items-center justify-center text-white overflow-hidden px-3 gap-1 py-1  md:min-w-fit flex-row flex">
                        {" "}
                        <IoIosInformationCircleOutline className="size-6" />
                        {getTypeQuestionLabel(q.typeQuestion)}
                      </label>
                    </td>
                    <td className="text-center">
                      <span className="text-sm font-medium">
                        {getFirstLevelAnswers(q.typeInspectionDetailAnswers)}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex w-full flex-row gap-2 items-center justify-end">
                        <ActionButton
                          icon={
                            <MdEdit className="w-[20px] h-[20px] opacity-70" />
                          }
                          label="Editar"
                          onClick={() => handleEditById(localId)}
                        />
                        <ActionButton
                          icon={
                            <GrDuplicate className="w-[20px] h-[20px] opacity-70" />
                          }
                          label="Duplicar"
                          onClick={() => {
                            const qOri = questions.find(
                              (q) => q._localId === localId
                            );
                            if (!qOri) return;
                            const draft = buildDraftFromLocalQuestion(qOri);
                            setEditingLocalId(null);
                            setIsDuplicating(true);
                            setModalDraft(draft);
                            setOpenModal(true);
                          }}
                        />
                        <ActionButton
                          icon={
                            <FiTrash2 className="w-[20px] h-[20px] opacity-70" />
                          }
                          label="Delete"
                          onClick={() => handleDeleteById(localId)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openModal && (
        <InspectionModal
          onClose={() => {
            setOpenModal(false);
            setEditingLocalId(null);
            setModalDraft(null);
            setIsDuplicating(false);
          }}
          onSave={handleSave}
          templateId={templateId}
          initialData={
            modalDraft
              ? {
                  question: modalDraft.questionText,
                  answers: modalDraft.answers,
                  group: { groupId: modalDraft.groupId },
                  selectedQuestion: modalDraft.selectedQuestion,
                }
              : undefined
          }
        />
      )}
    </>
  );
};

export default FormChassi;
