"use client";
import React, { useEffect, useState, useRef } from "react";
import AnswerItem, { type AnswerNode } from "./AnswerItem";
import { IoMdClose } from "react-icons/io";
import { AiOutlineSave } from "react-icons/ai";
import { debounce } from "lodash";
import { axiosInstance } from "@/shared/utils/axiosInstance";

type Group = { groupId: number; name: string; status: number };
type TemplateInspectionQuestion = {
  templateInspectionQuestionId: number;
  question: string;
  typeQuestion: number;
};

interface Props {
  onClose: () => void;
  onSave: (
    question: string,
    answers: AnswerNode[],
    selectedGroup: { groupId: number; name: string; status: number },
    selectedQuestion: {
      templateInspectionQuestionId: number;
      question: string;
      typeQuestion: number;
    }
  ) => void;
  templateId: number;

  // Prefill para editar/duplicar dentro del flujo de CREAR
  initialData?: {
    question: string;
    answers: AnswerNode[];
    group:
      | { groupId: number }
      | { groupId: number; name: string; status: number };
    selectedQuestion: {
      templateInspectionQuestionId: number;
      question: string;
      typeQuestion: number;
    };
  };
}

const InspectionModal: React.FC<Props> = ({
  onClose,
  onSave,
  templateId,
  initialData,
}) => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<AnswerNode[]>([]);

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [questionSuggestions, setQuestionSuggestions] = useState<
    TemplateInspectionQuestion[]
  >([]);
  const [selectedQuestion, setSelectedQuestion] =
    useState<TemplateInspectionQuestion | null>(null);

  // flags para aplicar partes del prefill exactamente una vez CUANDO haya data
  const appliedBaseRef = useRef(false);
  const appliedGroupRef = useRef(false);
  const appliedQuestionRef = useRef(false);

  const genId = () => `n_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const ensureAnswerIds = (nodes: AnswerNode[]): AnswerNode[] =>
    (nodes ?? []).map((n) => ({
      id: n.id ?? genId(),
      label: n.label,
      color: n.color,
      useParts: !!n.useParts,
      usePrint: !!n.usePrint,
      children: ensureAnswerIds(n.children ?? []),
    }));

  // --- cargar grupos
  useEffect(() => {
    axiosInstance
      .get("/Group/GetGroupAll")
      .then((res) => setGroups(res.data.items || []))
      .catch((err) => console.error("Error al cargar grupos:", err));
  }, []);

  // --- cargar preguntas del template
  useEffect(() => {
    if (!templateId) return;
    axiosInstance
      .get("/TemplateInspection/GetTemplateInspectionById", {
        params: { TemplateInspectionId: templateId },
      })
      .then((res) =>
        setQuestionSuggestions(res.data.templateInspectionQuestions || [])
      )
      .catch((err) => console.error("Error al cargar preguntas:", err));
  }, [templateId]);

  // 1) Prefill base (texto y respuestas) apenas hay initialData
  useEffect(() => {
    if (appliedBaseRef.current) return;
    if (!initialData) return;

    setQuestion(initialData.question ?? "");
    setAnswers(ensureAnswerIds(initialData.answers ?? []));
    appliedBaseRef.current = true;
  }, [initialData]);

  // 2) Resolver selección de grupo CUANDO existan grupos
  useEffect(() => {
    if (appliedGroupRef.current) return;
    if (!initialData) return;
    if (groups.length === 0) return;

    const g =
      groups.find((gr) => gr.groupId === initialData.group.groupId) || null;
    if (g) setSelectedGroup(g);
    appliedGroupRef.current = true;
  }, [groups, initialData]);

  // 3) Resolver selección de pregunta CUANDO existan sugerencias
  useEffect(() => {
    if (appliedQuestionRef.current) return;
    if (!initialData) return;
    if (questionSuggestions.length === 0) return;

    const q = questionSuggestions.find(
      (qq) =>
        qq.templateInspectionQuestionId ===
        initialData.selectedQuestion.templateInspectionQuestionId
    );
    if (q) {
      setSelectedQuestion(q);
      setQuestion(q.question); // sincroniza el input con el label real
    }
    appliedQuestionRef.current = true;
  }, [questionSuggestions, initialData]);

  const addAnswer = () => {
    setAnswers((prev) => [
      ...prev,
      {
        id: genId(),
        label: "",
        color: "#f87171",
        useParts: false,
        usePrint: false,
        children: [],
      },
    ]);
  };

  const updateAnswer = (index: number, updated: AnswerNode) => {
    const next = [...answers];
    next[index] = { ...updated, id: updated.id ?? genId() };
    setAnswers(next);
  };

  const deleteAnswer = (index: number) => {
    const next = [...answers];
    next.splice(index, 1);
    setAnswers(next);
  };

  const handleSubmit = () => {
    if (!question.trim()) return alert("Pregunta obligatoria");
    const validAnswers = answers.filter((a) => a.label.trim() !== "");
    if (validAnswers.length === 0)
      return alert("Debe agregar al menos una respuesta válida");
    if (!selectedGroup) return alert("Debe seleccionar un grupo válido");
    if (!selectedQuestion) return alert("Debe seleccionar una pregunta válida");

    onSave(question, validAnswers, selectedGroup, {
      templateInspectionQuestionId:
        selectedQuestion.templateInspectionQuestionId,
      question: selectedQuestion.question,
      typeQuestion: selectedQuestion.typeQuestion,
    });
    onClose();
  };

  return (
    <dialog open className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="mb-3">
          <label className="font-semibold mb-1 block text-lg">
            Select a group
          </label>
          <select
            className="input input-lg bg-[#f6f3f4] w-full text-center text-lg font-normal"
            value={selectedGroup?.groupId ?? ""}
            onChange={(e) => {
              const found = groups.find(
                (g) => g.groupId === Number(e.target.value)
              );
              setSelectedGroup(found ?? null);
            }}
          >
            <option value="" disabled>
              Selecciona un grupo
            </option>
            {groups.map((group) => (
              <option key={group.groupId} value={group.groupId}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="font-semibold mb-1 block text-lg">Question</label>
          <select
            className="input input-lg bg-[#f6f3f4] w-full text-center text-lg font-normal"
            value={selectedQuestion?.templateInspectionQuestionId ?? ""}
            onChange={(e) => {
              const found = questionSuggestions.find(
                (q) => q.templateInspectionQuestionId === Number(e.target.value)
              );
              setSelectedQuestion(found ?? null);
              setQuestion(found?.question ?? "");
            }}
          >
            <option value="" disabled>
              Selecciona una pregunta
            </option>
            {questionSuggestions.map((q) => (
              <option
                key={q.templateInspectionQuestionId}
                value={q.templateInspectionQuestionId}
              >
                {q.question}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-5">
            <span className="font-semibold">Respuestas</span>
            <button type="button" className="btn" onClick={addAnswer}>
              Agregar Respuesta
            </button>
          </div>
          {answers.map((answer, index) => (
            <AnswerItem
              key={answer.id}
              node={answer}
              onChange={(updated) => updateAnswer(index, updated)}
              onDelete={() => deleteAnswer(index)}
            />
          ))}
        </div>

        <div className="modal-action flex items-center justify-between">
          <button type="button" className="btn" onClick={onClose}>
            <IoMdClose className="w-[20px] h-[20px] opacity-70" /> Cancelar
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleSubmit}
            disabled={
              !question.trim() ||
              answers.filter((a) => a.label.trim() !== "").length === 0 ||
              !selectedGroup ||
              !selectedQuestion
            }
          >
            <AiOutlineSave className="w-[20px] h-[20px] opacity-70" />
            Guardar
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default InspectionModal;
