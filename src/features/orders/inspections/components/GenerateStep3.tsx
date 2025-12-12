//  Versión corregida: hijos colapsados; se despliegan 1x1 al seleccionar el padre
"use client";
import React, { useEffect, useState } from "react";
import { useInspectionFullStore } from "../../store/inspection/inspectionFullStore";
import { isColorLight } from "@/shared/utils/utils";
import { IFullAnswer } from "../types/IFullTypeInspection";
import Wizard from "./Wizard";
import ModalUsingItem from "./ModalUsingItem";
import { GoChecklist } from "react-icons/go";
import clsx from "clsx";
import { TypeQuestion, TypeQuestionLabel } from "../../models/workOrder.types";
import { IoIosInformationCircleOutline } from "react-icons/io";
import Lottie from "lottie-react";
import checkLottie from "@/assets/lotties/check.json";
import { toast } from "sonner";
import AnswerSign from "./typeQuest/AnswerSign";
import AnswerText from "./typeQuest/AnswerText";
import AnswerOptions from "./typeQuest/AnswerOptions";
import { IoCloseOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

interface ItemWithQuantity {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

interface ExportedAnswer {
  response: string;
  usingItem: boolean;
  selectedItems: ItemWithQuantity[];
  subAnswers: ExportedAnswer[];
}

const GenerateStep3 = () => {
  const t = useTranslations("inspections");
  const tToasts = useTranslations("toast");
  const { fullInspection, groupName, groupId, titleQuestion, fullQuestion } =
    useInspectionFullStore();

  const [selectedTree, setSelectedTree] = useState<IFullAnswer[]>([]);
  const [isSignValid, setIsSignValid] = useState(false);
  const [signUrl, setSignUrl] = useState<string | undefined>(undefined);
  const [showItemModal, setShowItemModal] = useState(false);
  const [modalAnswer, setModalAnswer] = useState<IFullAnswer | null>(null);
  const [initialItems, setInitialItems] = useState<ItemWithQuantity[]>([]);
  const [textResponse, setTextResponse] = useState("");

  const { resetTrigger } = useInspectionFullStore();
  const [showRootPicker, setShowRootPicker] = useState(false);
  const [selectedRootId, setSelectedRootId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedTree([]);
    setTextResponse("");
    setSignUrl(undefined);
    setIsSignValid(false);
  }, [resetTrigger]);

  const originalRoots = fullQuestion?.originalAnswers ?? [];
  const currentAnswers =
    fullQuestion?.originalAnswers ?? fullQuestion?.answers ?? [];

  const isSingle = fullQuestion?.typeQuestion === TypeQuestion.SingleChoice;
  const isMultiple = fullQuestion?.typeQuestion === TypeQuestion.MultipleChoice;
  const isText = fullQuestion?.typeQuestion === TypeQuestion.TextInput;
  const isSign = fullQuestion?.typeQuestion === TypeQuestion.Sign;

  // ---------- utils selección ----------
  const isSelected = (id: string, tree: IFullAnswer[]): boolean => {
    for (const a of tree) {
      if (String(a.typeInspectionDetailAnswerId) === id) return true;
      if (a.subAnswers?.length && isSelected(id, a.subAnswers)) return true;
    }
    return false;
  };

  const getAnswerFromTree = (
    tree: IFullAnswer[],
    id: string
  ): IFullAnswer | undefined => {
    for (const a of tree) {
      if (String(a.typeInspectionDetailAnswerId) === id) return a;
      if (a.subAnswers?.length) {
        const found = getAnswerFromTree(a.subAnswers, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  // ¿Algún descendiente de este nodo está seleccionado?
  const hasSelectedDescendant = (node: IFullAnswer): boolean => {
    if (!node.subAnswers?.length) return false;
    return node.subAnswers.some(
      (sub) =>
        isSelected(String(sub.typeInspectionDetailAnswerId), selectedTree) ||
        hasSelectedDescendant(sub)
    );
  };

  const updateSelectedItems = (
    tree: IFullAnswer[],
    answerId: string,
    items: ItemWithQuantity[]
  ): IFullAnswer[] =>
    tree.map((a) => {
      if (String(a.typeInspectionDetailAnswerId) === answerId) {
        return { ...a, selectedItems: items };
      }
      if (a.subAnswers?.length) {
        return {
          ...a,
          subAnswers: updateSelectedItems(a.subAnswers, answerId, items),
        };
      }
      return a;
    });

  // ---------- toggle con limpieza de ramas ----------
  const toggleAnswer = (
    tree: IFullAnswer[],
    answer: IFullAnswer,
    parentId?: string
  ): IFullAnswer[] => {
    const isRoot = !parentId;

    if (!isMultiple) {
      // SINGLE: una opción por nivel
      if (isRoot) {
        return [{ ...answer, subAnswers: [] }];
      }
      return tree.map((node) => {
        if (String(node.typeInspectionDetailAnswerId) === parentId) {
          return { ...node, subAnswers: [{ ...answer, subAnswers: [] }] };
        }
        if (node.subAnswers?.length) {
          return {
            ...node,
            subAnswers: toggleAnswer(node.subAnswers, answer, parentId),
          };
        }
        return node;
      });
    }

    // MULTIPLE: solo 1 raíz, múltiples por nivel debajo
    if (isMultiple) {
      if (isRoot) {
        const exists = tree.find(
          (a) =>
            a.typeInspectionDetailAnswerId ===
            answer.typeInspectionDetailAnswerId
        );
        if (exists) {
          // Quitar raíz (y su árbol)
          return tree.filter(
            (a) =>
              a.typeInspectionDetailAnswerId !==
              answer.typeInspectionDetailAnswerId
          );
        } else {
          // Forzamos una sola raíz
          return [{ ...answer, subAnswers: [] }];
        }
      }
      return tree.map((node) => {
        if (String(node.typeInspectionDetailAnswerId) === parentId) {
          const exists = node.subAnswers?.some(
            (sub) =>
              sub.typeInspectionDetailAnswerId ===
              answer.typeInspectionDetailAnswerId
          );
          const newSubs = exists
            ? node.subAnswers!.filter(
                (sub) =>
                  sub.typeInspectionDetailAnswerId !==
                  answer.typeInspectionDetailAnswerId
              )
            : [...(node.subAnswers ?? []), { ...answer, subAnswers: [] }];
          return { ...node, subAnswers: newSubs };
        }
        if (node.subAnswers?.length) {
          return {
            ...node,
            subAnswers: toggleAnswer(node.subAnswers, answer, parentId),
          };
        }
        return node;
      });
    }
    return tree;
  };

  // ---------- render recursivo con colapso ----------
  const renderAnswerRecursive = (
    answer: IFullAnswer,
    level: number = 0,
    parentId?: string
  ): React.ReactNode => {
    const backgroundColor =
      answer.color === "#ffffff" ? "#171717" : answer.color;
    const isLight = isColorLight(backgroundColor);
    const textColor = isLight ? "#000000" : "#ffffff";
    const id = String(answer.typeInspectionDetailAnswerId);
    const selected = isSelected(id, selectedTree);

    const treeAnswer = getAnswerFromTree(selectedTree, id);
    const hasItems =
      treeAnswer?.selectedItems?.length && treeAnswer.selectedItems.length > 0;

    // Mostrar hijos SOLO si el nodo está seleccionado
    // (o si hay un descendiente seleccionado cuando re-hidratas una respuesta guardada)
    const showChildren = selected || hasSelectedDescendant(answer);

    return (
      <div key={id} className="flex flex-col items-center">
        <div className="flex flex-col items-center relative">
          {level > 0 && (
            <div className="absolute top-[-16px] h-4 w-px bg-gray-300" />
          )}

          <div className="flex flex-row items-center justify-start my-2">
            <div
              className="flex flex-row items-center gap-0 cursor-pointer group"
              onClick={() => {
                const updated = toggleAnswer(selectedTree, answer, parentId);
                setSelectedTree(updated);

                const isRoot = !parentId;
                if (
                  isRoot &&
                  (isSingle || isMultiple) &&
                  updated.length === 1 &&
                  isLastQuestionInGroup
                ) {
                  completeCurrentQuestion(updated[0].response);
                }
              }}
            >
              <div
                data-color={answer.color}
                style={{ backgroundColor, color: textColor }}
                className={clsx(
                  !answer.usingItem
                    ? "overflow-hidden rounded-tl-full rounded-full px-5 flex flex-row transition-all group-hover:shadow-lg"
                    : "overflow-hidden rounded-tl-full rounded-bl-full px-5 flex flex-row transition-all group-hover:shadow-lg"
                )}
              >
                <div className="h-[45px] flex items-center justify-center pr-4">
                  <input
                    type={isMultiple ? "checkbox" : "radio"}
                    name={`select-answer-${level}-${parentId ?? "root"}`}
                    checked={selected}
                    readOnly
                    className={clsx(
                      isMultiple
                        ? "checkbox bg-white checked:bg-white checked:text-green-600 checked:border-green-500"
                        : "radio bg-white checked:bg-white checked:text-green-600 checked:border-green-500"
                    )}
                  />
                </div>
                <div className="flex flex-row items-center justify-center min-w-auto h-[45px] overflow-hidden">
                  <p className="truncate">{answer.response}</p>
                </div>
              </div>
            </div>

            {answer.usingItem &&
              (!hasItems ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    openItemModal(answer);
                  }}
                  className={clsx(
                    "h-full cursor-pointer flex items-center rounded-tr-full rounded-br-full justify-center px-3 min-w-[45px] overflow-hidden bg-[#35353382]"
                  )}
                >
                  <GoChecklist className="size-7 text-black/50 transition-all hover:text-black" />
                </div>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    openItemModal(answer);
                  }}
                  className={clsx(
                    "h-full cursor-pointer flex items-center rounded-tr-full rounded-br-full justify-center px-3 min-w-[45px] overflow-hidden bg-green-300"
                  )}
                >
                  <Lottie
                    animationData={checkLottie}
                    style={{ width: 35, height: 35 }}
                    loop={false}
                  />
                </div>
              ))}

            {selected &&
              answer.selectedItems &&
              answer.selectedItems.length > 0 && (
                <div className="text-xs text-center mt-1 text-gray-500">
                  {answer.selectedItems.length} ítem
                  {answer.selectedItems.length > 1 ? "s" : ""} agregado
                  {answer.selectedItems.length > 1 ? "s" : ""}
                </div>
              )}
          </div>

          {/* 🔽 SOLO renderiza los hijos cuando el padre está seleccionado */}
          {showChildren && answer.subAnswers?.length > 0 && (
            <div className="mt-4 flex flex-row gap-4 pt-4 border-t border-black/10">
              {answer.subAnswers.map((sub) => (
                <div
                  key={sub.typeInspectionDetailAnswerId}
                  className="flex flex-col items-center"
                >
                  {renderAnswerRecursive(sub, level + 1, id)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const openItemModal = (answer: IFullAnswer) => {
    const answerId = String(answer.typeInspectionDetailAnswerId);
    const selected = isSelected(answerId, selectedTree);
    if (!selected) {
      toast.error(`${tToasts("error")}: ${tToasts("msj.30")}`);
      return;
    }
    const findAnswerInTree = (tree: IFullAnswer[]): IFullAnswer | null => {
      for (const node of tree) {
        if (String(node.typeInspectionDetailAnswerId) === answerId) return node;
        if (node.subAnswers?.length) {
          const found = findAnswerInTree(node.subAnswers);
          if (found) return found;
        }
      }
      return null;
    };
    const nodeInTree = findAnswerInTree(selectedTree);
    setModalAnswer(answer);
    setInitialItems(nodeInTree?.selectedItems ?? []);
    setShowItemModal(true);
  };

  const exportTree = (answers: IFullAnswer[]): ExportedAnswer[] =>
    answers.map((a) => ({
      response: a.response,
      usingItem: a.usingItem,
      selectedItems: a.selectedItems ?? [],
      subAnswers: a.subAnswers?.length ? exportTree(a.subAnswers) : [],
    }));

  const completeSign = () => {
    const store = useInspectionFullStore.getState();
    const current = store.fullInspection;
    const fq = store.fullQuestion;
    if (!current || !fq) return;
    const updatedQuestions = current.questions.map((q) =>
      q.typeInspectionDetailId === fq.typeInspectionDetailId
        ? { ...q, statusInspectionConfig: true }
        : q
    );
    store.setFullInspection({ ...current, questions: updatedQuestions });
    store.setStepWizard(2);
  };

  const completeCurrentQuestionWithRoot = (rootLabel: string) => {
    const store = useInspectionFullStore.getState();
    const current = store.fullInspection;
    const fq = store.fullQuestion;
    if (!current || !fq) return;

    const updatedQuestions = current.questions.map((q) => {
      if (q.typeInspectionDetailId === fq.typeInspectionDetailId) {
        return {
          ...q,
          finalResponse: rootLabel,
          statusInspectionConfig: true,
          answers: selectedTree.length > 0 ? selectedTree : q.answers,
        };
      }
      return q;
    });

    const currentGroupQuestions = updatedQuestions.filter(
      (q) => q.groupId === fq.groupId && q.groupName === fq.groupName
    );
    const groupCompleted = currentGroupQuestions.every(
      (q) => q.statusInspectionConfig
    );

    const updatedInspection = {
      ...current,
      questions: updatedQuestions,
      statusInspectionConfig: updatedQuestions.every(
        (q) => q.statusInspectionConfig
      ),
    };
    store.setFullInspection(updatedInspection);

    setShowRootPicker(false);

    if (!groupCompleted) {
      const nextUnanswered = currentGroupQuestions.find(
        (q) => !q.statusInspectionConfig
      );
      if (nextUnanswered) {
        store.setFullQuestion(nextUnanswered);
        store.setGroupId(nextUnanswered.groupId);
        store.setGroupName(nextUnanswered.groupName);
        store.setTitleQuestion(nextUnanswered.question);
        store.setStepWizard(3);
        return;
      }
    }

    toast.success(`${tToasts("ok")}: ${tToasts("msj.31")}`);
    store.setStepWizard(2);
  };

  const completeCurrentQuestion = (responseValue: string | null = null) => {
    const store = useInspectionFullStore.getState();
    const current = store.fullInspection;
    const fq = store.fullQuestion;
    if (!current || !fq) return;

    let resolvedFinalResponse = responseValue ?? "";
    if (isSingle && selectedTree.length === 1) {
      resolvedFinalResponse = selectedTree[0].response;
    }

    const updatedQuestions = current.questions.map((q) => {
      if (q.typeInspectionDetailId === fq.typeInspectionDetailId) {
        return {
          ...q,
          finalResponse: resolvedFinalResponse,
          statusInspectionConfig: true,
          answers: selectedTree.length > 0 ? selectedTree : q.answers,
        };
      }
      return q;
    });

    const currentGroupQuestions = updatedQuestions.filter(
      (q) => q.groupId === fq.groupId && q.groupName === fq.groupName
    );
    const groupCompleted = currentGroupQuestions.every(
      (q) => q.statusInspectionConfig
    );

    const updatedInspection = {
      ...current,
      questions: updatedQuestions,
      statusInspectionConfig: updatedQuestions.every(
        (q) => q.statusInspectionConfig
      ),
    };
    store.setFullInspection(updatedInspection);

    if (!groupCompleted) {
      const nextUnanswered = currentGroupQuestions.find(
        (q) => !q.statusInspectionConfig
      );
      if (nextUnanswered) {
        store.setFullQuestion(nextUnanswered);
        store.setGroupId(nextUnanswered.groupId);
        store.setGroupName(nextUnanswered.groupName);
        store.setTitleQuestion(nextUnanswered.question);
        store.setStepWizard(3);
        return;
      }
    }

    toast.success(`${tToasts("ok")}: ${tToasts("msj.31")}`);
    store.setStepWizard(2);
  };

  const isLastQuestionInGroup = fullInspection?.questions
    .filter(
      (q) =>
        q.groupId === fullQuestion?.groupId &&
        q.groupName === fullQuestion?.groupName
    )
    .every(
      (q) =>
        q.statusInspectionConfig ||
        q.typeInspectionDetailId === fullQuestion?.typeInspectionDetailId
    );

  useEffect(() => {
    if (!fullQuestion || !fullInspection) return;

    const q = fullInspection.questions.find(
      (qq) => qq.typeInspectionDetailId === fullQuestion.typeInspectionDetailId
    );

    if (q && !q.originalAnswers && fullQuestion.answers) {
      q.originalAnswers = structuredClone(fullQuestion.answers);
    }
    if (q?.originalAnswers) {
      fullQuestion.originalAnswers = q.originalAnswers;
    }

    const alreadyAnswered = q?.statusInspectionConfig;

    if (alreadyAnswered && (isSingle || isMultiple)) {
      setSelectedTree(q.answers ?? []);
      setTextResponse(q.finalResponse ?? "");
      setSignUrl(q.finalResponse ?? "");
      setIsSignValid(!!q.finalResponse);
    } else if (alreadyAnswered && isText) {
      setTextResponse(q.finalResponse ?? "");
    } else if (alreadyAnswered && isSign) {
      setSignUrl(q.finalResponse ?? "");
      setIsSignValid(!!q.finalResponse);
    } else {
      setSelectedTree([]);
      setTextResponse("");
      setSignUrl("");
      setIsSignValid(false);
    }
  }, [fullQuestion?.typeInspectionDetailId]);

  return (
    <>
      <Wizard />
      <div className="card bg-base-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <h1 className="text-2xl font-bold order-2 md:order-1">
            {t("step3.1")} {titleQuestion}
          </h1>
          <label className="rounded-full bg-red-400 order-1 md:order-2  md:flex items-center justify-center text-white overflow-hidden px-3 gap-1 py-1  md:min-w-fit flex-row flex truncate">
            <IoIosInformationCircleOutline className="size-6" />
            {fullQuestion?.typeQuestion !== undefined
              ? TypeQuestionLabel[fullQuestion.typeQuestion as TypeQuestion]
              : ""}
          </label>
        </div>

        {isSign && (
          <AnswerSign
            onComplete={(valid, url) => {
              setIsSignValid(valid);
              setSignUrl(url);
            }}
          />
        )}

        {isText && (
          <AnswerText value={textResponse} onChange={setTextResponse} />
        )}

        {(isSingle || isMultiple) && (
          <AnswerOptions
            answers={currentAnswers}
            renderAnswer={renderAnswerRecursive}
          />
        )}

        <div className="text-center mt-6">
          {isText && (
            <button
              disabled={textResponse.length === 0}
              className="btn font-normal bg-black text-white rounded-full pr-3 py-6 sm:flex border-none flex-1 w-full md:w-[300px] mx-auto text-[13px]"
              onClick={() => completeCurrentQuestion(textResponse)}
            >
              {isLastQuestionInGroup ? "Save" : "Continue"}
            </button>
          )}

          {(isSingle || isMultiple) && (
            <button
              disabled={selectedTree.length === 0}
              className="btn font-normal bg-black text-white rounded-full pr-3 py-6 sm:flex border-none flex-1 w-full md:w-[300px] mx-auto text-[13px]"
              onClick={() => setShowRootPicker(true)}
            >
              {isLastQuestionInGroup ? "Save" : "Continue"}
            </button>
          )}

          {isSign && (
            <button
              disabled={!isSignValid}
              className="btn font-normal bg-black text-white rounded-full pr-3 py-6 sm:flex border-none flex-1 w-full md:w-[300px] mx-auto text-[13px]"
              onClick={() => completeCurrentQuestion(signUrl)}
            >
              {isLastQuestionInGroup ? "Save" : "Continue"}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center mt-5 px-6">
        <button
          className="btn font-normal bg-red-300 text-white rounded-full pr-3 py-6 sm:flex border-none flex-1 w-full  md:max-w-[300px] mx-auto text-[13px] transition-all hover:bg-red-600"
          onClick={() => useInspectionFullStore.getState().setStepWizard(2)}
        >
          {t("step3.2")}
        </button>
      </div>

      {showItemModal && modalAnswer && (
        <ModalUsingItem
          onClose={() => setShowItemModal(false)}
          onSave={(items: ItemWithQuantity[]) => {
            if (!modalAnswer) return;
            setSelectedTree((prev) =>
              updateSelectedItems(
                prev,
                String(modalAnswer.typeInspectionDetailAnswerId),
                items
              )
            );
            setShowItemModal(false);
          }}
          initialItems={initialItems}
        />
      )}

      {showRootPicker && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md relative  h-[75%] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold ">{t("step3.3")}</h2>
              <button
                className="bg-black text-white w-[38px] h-[38px] absolute right-0 top-0 rounded-bl-3xl flex items-center justify-center transition-all cursor-pointer"
                onClick={() => setShowRootPicker(!showRootPicker)}
              >
                <IoCloseOutline className="text-2xl font-bold" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {(fullQuestion?.originalAnswers ?? []).map((root) => (
                <button
                  key={root.typeInspectionDetailAnswerId}
                  onClick={() => {
                    setSelectedRootId(root.response);
                    setShowRootPicker(false);
                    completeCurrentQuestionWithRoot(root.response);
                  }}
                  className="btn w-full min-h-[39px] p-2 rounded-md text-lg hover:opacity-85"
                  style={{
                    backgroundColor: root.color,
                    color: isColorLight(root.color) ? "#000" : "#fff",
                  }}
                >
                  {root.response}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateStep3;
