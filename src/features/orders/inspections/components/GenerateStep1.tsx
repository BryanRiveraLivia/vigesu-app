"use client";
import React, { FC, useState } from "react";
import { axiosInstance } from "@/core/utils/axiosInstance";
import {
  IFullAnswer,
  IFullQuestion,
  IFullTypeInspection,
} from "../types/IFullTypeInspection";
import Loading from "@/presentation/components/shared/Loading";
import { useRouter } from "next/navigation";
import { useInspectionFullStore } from "../../store/inspection/inspectionFullStore";
import Wizard from "./Wizard";
import { FaCheckCircle } from "react-icons/fa";
import clsx from "clsx";
import { BsQuestionCircle } from "react-icons/bs";
import { toast } from "sonner";
import ImageUploader from "../../create-order/ImageUploader";
import { useAuthUser } from "@/presentation/stores/useAuthUser";
import EmailConfirmationModal from "./EmailConfirmationModal";
import { useTranslations } from "next-intl";
import { GenerateStep1Props } from "./GenerateStep1.types";

const GenerateStep1: FC<GenerateStep1Props> = ({ ClientName }) => {
  const t = useTranslations("inspections");
  const [showModal, setShowModal] = useState(false);
  const tToasts = useTranslations("toast");
  const { employeeName, employeeId } = useAuthUser();
  const [inspectionFiles, setInspectionFiles] = useState<File[]>([]);

  const router = useRouter();
  const { groupedQuestions, fullInspection, setStepWizard, setCompleteStep1 } =
    useInspectionFullStore();

  const goStep = async (
    typeInspectionId: number,
    groupName: string,
    groupId: number,
  ) => {
    try {
      const store = useInspectionFullStore.getState();
      const previous = store.fullInspection;

      const res = await axiosInstance.get<IFullTypeInspection>(
        `/TypeInspection/GetFullTypeInspectionId?TypeInspectionId=${typeInspectionId}`,
      );

      const mergedQuestions = res.data.questions.map((q) => {
        const prev = previous?.questions.find(
          (pq) => pq.typeInspectionDetailId === q.typeInspectionDetailId,
        );
        return {
          ...q,
          answers: prev?.answers ?? q.answers,
          finalResponse: prev?.finalResponse ?? "",
          statusInspectionConfig: prev?.statusInspectionConfig ?? false,
        };
      });

      store.setFullInspection({
        ...res.data,
        questions: mergedQuestions,
      });

      useInspectionFullStore.getState().setGroupName(groupName);
      useInspectionFullStore.getState().setGroupId(groupId);
      setCompleteStep1(false);
      setStepWizard(2);
    } catch (err) {
      console.error("Error al obtener datos completos de inspección", err);
    }
  };

  const extractAnswerRecursiveArray = (
    answers: IFullAnswer[],
  ): IFullAnswer[] => {
    return answers.flatMap((answer) => [
      {
        ...answer,
      },
      ...(answer.subAnswers
        ? extractAnswerRecursiveArray(answer.subAnswers)
        : []),
    ]);
  };

  const handleFinalSubmit = async () => {
    if (!fullInspection) return;

    const payload = {
      typeInspectionId: fullInspection.typeInspectionId,
      customerId: fullInspection.customerId,
      employeeId: employeeId?.toString(),
      customerName: ClientName.toString(),
      employeeName: employeeName?.toString(),
      dateOfInspection: new Date().toISOString(),
      inspectionDetails: fullInspection.questions.map((q) => {
        const flatAnswers = extractAnswerRecursiveArray(q.answers ?? []);

        return {
          typeInspectionDetailId: q.typeInspectionDetailId,
          typeInspectionDetailAnswerId:
            flatAnswers[0]?.typeInspectionDetailAnswerId ?? 0,
          finalResponse: q.finalResponse ?? "",
          inspectionDetailAnswers: flatAnswers.map((a) => ({
            typeInspectionDetailAnswerId: a.typeInspectionDetailAnswerId,
            finalResponse: a.response,
            inspectionDetailAnswerItem: (a.selectedItems ?? []).map((item) => ({
              itemId: item.id,
              itemName: item.name,
              quantity: item.quantity,
              price: item.unitPrice,
            })),
          })),
        };
      }),
      inspectionPhotos: inspectionFiles.map((f) => ({
        name: f.name,
        photoUrl: f.name,
      })),
    };

    try {
      const response = await axiosInstance.post("/Inspection", payload);
      const inspectionId = response.data;

      if (inspectionFiles.length > 0) {
        const formData = new FormData();
        formData.append("InspectionId", inspectionId.toString());
        inspectionFiles.forEach((file) => {
          formData.append("Files", file);
        });

        await axiosInstance.post(
          "/Inspection/UploadInspectionPhotos",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }
      toast.success(`${tToasts("ok")}: ${tToasts("msj.28")}`);
      useInspectionFullStore.getState().resetFullInspection();
      router.push("./");
    } catch (error) {
      toast.error(`${tToasts("error")}: ${tToasts("msj.29")}`);
      console.error(error);
    }
  };

  return (
    <>
      <Wizard />
      <div className="">
        {!groupedQuestions ? (
          <Loading height="h-[300px]" label="Esperando configuración ..." />
        ) : (
          <div className="cont my-5 flex flex-col gap-1">
            {fullInspection &&
              Object.entries(
                fullInspection.questions.reduce(
                  (acc, question) => {
                    if (!acc[question.groupName]) acc[question.groupName] = [];
                    acc[question.groupName].push(question);
                    return acc;
                  },
                  {} as Record<string, IFullQuestion[]>,
                ),
              ).map(([groupName, questions]) => {
                const groupId = questions[0]?.groupId;
                return (
                  <button
                    onClick={() =>
                      goStep(
                        fullInspection.typeInspectionId,
                        groupName,
                        groupId,
                      )
                    }
                    className={clsx(
                      `w-full flex flex-row card lg:card-side  shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-lg mb-5  text-white `,
                      questions.every((q) => q.statusInspectionConfig)
                        ? `bg-green-800/80 hover:bg-green-800 hover:text-white/80`
                        : `bg-black/80 hover:bg-[#191917] hover:text-white/80`,
                    )}
                    key={groupName}
                  >
                    <div
                      className={clsx(
                        ` w-fit flex items-center justify-center p-2`,
                        questions.every((q) => q.statusInspectionConfig)
                          ? `bg-green-800`
                          : `bg-[#191917]`,
                      )}
                    >
                      {questions.every((q) => q.statusInspectionConfig) ? (
                        <FaCheckCircle className="w-[20px] h-[20px]  text-green-400 mx-auto" />
                      ) : (
                        <BsQuestionCircle className="w-[20px] h-[20px]  text-white mx-auto" />
                      )}
                    </div>
                    <div className="card-body flex flex-row justify-between gap-5">
                      <div className="flex flex-col items-start">
                        <h2 className="card-title text-left">{groupName} </h2>
                        <p className="text-lg text-left">
                          {fullInspection.description}
                        </p>
                      </div>
                      <div className="card-actions justify-end flex items-center ">
                        {questions.filter((item) => item.status === 0).length >
                          0 && (
                          <span className="badge badge-error text-white text-lg">
                            {
                              questions.filter((item) => item.status === 0)
                                .length
                            }
                          </span>
                        )}
                        {questions.filter((item) => item.status === 1).length >
                          0 && (
                          <span className="badge badge-success text-white text-lg">
                            {
                              questions.filter((item) => item.status === 1)
                                .length
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>
      {fullInspection?.questions.every((q) => q.statusInspectionConfig) && (
        <ImageUploader onFilesChange={setInspectionFiles} />
      )}

      <div className="text-center mt-5">
        <button
          className="btn font-normal bg-black text-white rounded-full pr-3 py-6 sm:flex border-none flex-1 w-full md:w-[300px] mx-auto text-[13px] disabled:!bg-black/50"
          disabled={
            !fullInspection?.questions.every((q) => q.statusInspectionConfig)
          }
          onClick={() => setShowModal(true)}
        >
          {t("step1.1")}
        </button>
      </div>
      <EmailConfirmationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleFinalSubmit}
        userName={employeeName || "Usuario"}
      />
    </>
  );
};

export default GenerateStep1;
