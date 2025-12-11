"use client";
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
import { InspectionStatus } from "../../models/typeInspection";
import {
  TypeQuestion,
  TypeQuestionLabel,
} from "@/features/orders/models/workOrder.types";
import { IoIosInformationCircleOutline } from "react-icons/io";

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
}

const STATUS_ACTIVE = InspectionStatus.Active;

const FormChassi: React.FC<FormChassiProps> = ({
  onQuestionsChange,
  templateName,
  templateId,
  onQuestionsExport,
}) => {
  // Lista local con soporte de edición/duplicado
  type LocalQuestion = ExportedQuestion & { _localId: string };
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [editingLocalId, setEditingLocalId] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [modalDraft, setModalDraft] = useState<{
    questionText: string;
    answers: AnswerNode[];
    groupId: number;
    selectedQuestion: {
      templateInspectionQuestionId: number;
      question: string;
      typeQuestion: number;
    };
  } | null>(null);

  const newLocalId = () =>
    `n_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  // ---------- MAPEOS ----------
  const toAnswerNodes = (answers: ExportedAnswer[] = []): AnswerNode[] =>
    answers.map((a) => ({
      id: newLocalId(),
      label: a.response,
      color: a.color,
      useParts: !!a.usingItem,
      usePrint: !!a.isPrintable, // <- LEE isPrintable
      children: toAnswerNodes(a.subTypeInspectionDetailAnswers ?? []),
    }));

  const getTypeQuestionLabel = (type?: number): string => {
    if (type === null || type === undefined) return "";
    return TypeQuestionLabel[type as TypeQuestion] ?? String(type);
  };

  const toExportedAnswers = (nodes: AnswerNode[] = []): ExportedAnswer[] =>
    nodes.map((n) => ({
      id: undefined, // en CREAR no hay ids aún
      response: n.label,
      color: n.color,
      usingItem: !!n.useParts,
      isPrintable: !!n.usePrint, // <- ESCRIBE isPrintable
      subTypeInspectionDetailAnswers: toExportedAnswers(n.children ?? []),
    }));

  // ---------- DRAFT helpers ----------
  const buildDraftFromLocal = (q: LocalQuestion) => ({
    questionText: q.question,
    answers: toAnswerNodes(q.typeInspectionDetailAnswers ?? []),
    groupId: q.groupId,
    selectedQuestion: {
      templateInspectionQuestionId: q.templateInspectionQuestionId,
      question: q.question,
      typeQuestion: q.typeQuestion,
    },
  });

  // ---------- ABRIR (crear) ----------
  const openCreate = () => {
    setEditingLocalId(null);
    setIsDuplicating(false);
    setModalDraft(null);
    setOpenModal(true);
  };

  // ---------- GUARDAR (crear/editar/duplicar) ----------
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
    const valid = answers.filter((a) => a.label.trim() !== "");
    if (valid.length === 0) {
      alert("Debe agregar al menos una respuesta válida");
      return;
    }

    // convertir a ExportedAnswer[]
    const formattedAnswers = toExportedAnswers(valid);

    if (editingLocalId) {
      // EDITAR
      setQuestions((prev) =>
        prev.map((q) =>
          q._localId !== editingLocalId
            ? q
            : {
                ...q,
                templateInspectionQuestionId:
                  selectedQuestion.templateInspectionQuestionId,
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

    // CREAR o DUPLICAR
    const newEntry: LocalQuestion = {
      _localId: newLocalId(),
      templateInspectionQuestionId:
        selectedQuestion.templateInspectionQuestionId,
      question,
      typeQuestion: selectedQuestion.typeQuestion,
      groupId: group.groupId,
      status: STATUS_ACTIVE,
      typeInspectionDetailAnswers: formattedAnswers,
    };

    setQuestions((prev) => [...prev, newEntry]);
    setIsDuplicating(false);
    setModalDraft(null);
    setOpenModal(false);
  };

  // ---------- EDITAR ----------
  const handleEdit = (localId: string) => {
    const q = questions.find((x) => x._localId === localId);
    if (!q) return;
    setEditingLocalId(localId);
    setIsDuplicating(false);
    setModalDraft(buildDraftFromLocal(q));
    setOpenModal(true);
  };

  // ---------- DUPLICAR ----------
  const handleDuplicate = (localId: string) => {
    const q = questions.find((x) => x._localId === localId);
    if (!q) return;
    // usa el modal con prefill; al guardar creará otro entry
    setEditingLocalId(null);
    setIsDuplicating(true);
    setModalDraft(buildDraftFromLocal(q));
    setOpenModal(true);
  };

  // ---------- ELIMINAR ----------
  const handleDelete = (localId: string) => {
    setQuestions((prev) => prev.filter((q) => q._localId !== localId));
  };

  // ✅ Notificar al padre / exportar SOLO cuando cambie `questions`
  useEffect(() => {
    if (onQuestionsChange) onQuestionsChange(questions.length > 0);
    if (onQuestionsExport) {
      const cleaned: ExportedQuestion[] = questions.map(
        ({ _localId, ...rest }) => rest
      );
      onQuestionsExport(cleaned);
    }
  }, [questions]); // ⬅️ Evita incluir los callbacks como dependencias

  const getFirstLevelAnswers = (answers: ExportedAnswer[]) =>
    (answers ?? [])
      .filter((a) => a.response.trim() !== "")
      .map((a) => a.response)
      .join(", ");

  return (
    <>
      <h2 className="font-bold text-xl md:text-2xl lg:text-3xl text-center mb-5">
        {templateName || "Create Inspection"}
      </h2>

      <div className="rounded-box border-[#00000014] border-1 mb-6 p-3 gap-0 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-5 p-2">
          <button
            type="button"
            onClick={openCreate}
            className="btn min-w-[30px] min-h-[39px] p-2 rounded-md "
          >
            <IoAddCircleOutline className="text-2xl" />
            Add row
          </button>

          <div className="overflow-x-auto rounded-box border-[#00000014] border-1 ">
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
                {questions.map((q) => (
                  <tr key={q._localId}>
                    <td className="text-left">
                      <div
                        className="w-[300px] overflow-hidden text-ellipsis"
                        aria-label="question"
                      >
                        <span className="truncate">{q.question}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <label className="rounded-full text-sm bg-red-400 order-1 md:order-2  md:flex items-center justify-center text-white overflow-hidden px-3 gap-1 py-1  md:min-w-fit flex-row flex truncate truncate">
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
                          onClick={() => handleEdit(q._localId)}
                        />
                        <ActionButton
                          icon={
                            <GrDuplicate className="w-[20px] h-[20px] opacity-70" />
                          }
                          label="Duplicar"
                          onClick={() => handleDuplicate(q._localId)}
                        />
                        <ActionButton
                          icon={
                            <FiTrash2 className="w-[20px] h-[20px] opacity-70" />
                          }
                          label="Delete"
                          onClick={() => handleDelete(q._localId)}
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
