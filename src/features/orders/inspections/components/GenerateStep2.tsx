import React from "react";
import { useInspectionFullStore } from "../../store/inspection/inspectionFullStore";
import { BsQuestionCircle } from "react-icons/bs";
import Wizard from "./Wizard";
import {
  IFullQuestion,
  IFullTypeInspection,
} from "../types/IFullTypeInspection";
import Lottie from "lottie-react";
import checkLottie from "@/assets/lotties/check.json";
import { FaCheckCircle } from "react-icons/fa";
import clsx from "clsx";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useTranslations } from "next-intl";
import { formatApiErrorForToast } from "@/shared/utils/errors";

const GenerateStep2 = () => {
  const t = useTranslations("inspections");
  const router = useRouter();
  const store = useInspectionFullStore.getState();
  const {
    fullInspection,
    groupName,
    groupId,
    setCompleteStep2,
    setCompleteStep3,
  } = useInspectionFullStore();
  const tToasts = useTranslations("toast");
  const goStep = (question: IFullQuestion) => {
    useInspectionFullStore.getState().setStepWizard(3);
    useInspectionFullStore.getState().setCompleteStep2(true);
    useInspectionFullStore.getState().setTitleQuestion(question.question);
    useInspectionFullStore.getState().setFullQuestion(question);
  };

  const enableFinalButton =
    fullInspection?.questions
      .filter(
        (item) => item.groupName === groupName && item.groupId === groupId
      )
      .filter((item) => item.statusInspectionConfig === false).length ?? 0;

  const handleFinalSubmit = async () => {
    if (!fullInspection) return;

    const payload = {
      typeInspectionId: fullInspection.typeInspectionId,
      customerId: fullInspection.customerId,
      employeeId: "empleado-123", // puedes reemplazar esto con el real
      customerName: "Cliente Prueba", // idem
      employeeName: "Empleado QA", // idem
      dateOfInspection: new Date().toISOString(),
      inspectionDetails: fullInspection.questions.map((q) => ({
        typeInspectionDetailId: q.typeInspectionDetailId,
        typeInspectionDetailAnswerId:
          q.answers[0]?.typeInspectionDetailAnswerId ?? 0,
        finalResponse: q.finalResponse ?? "",
        inspectionDetailAnswers: q.answers.map((a) => ({
          typeInspectionDetailAnswerId: a.typeInspectionDetailAnswerId,
          finalResponse: a.response,
          inspectionDetailAnswerItem: (a.selectedItems ?? []).map((item) => ({
            itemId: item.id,
            itemName: item.name,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
        })),
      })),
      inspectionPhotos: [], // puedes completar luego si usas fotos
    };

    //console.log("📤 Enviando payload a API:", payload);

    try {
      const response = await axiosInstance.post("/Inspection", payload);

      toast.success(`${tToasts("ok")}: ${tToasts("msj.28")}`);

      //  RESET COMPLETO
      useInspectionFullStore.getState().resetFullInspection();

      router.push("./");
    } catch (error) {
      /* toast.error(`${tToasts("error")}: ${tToasts("msj.29")}`);
      console.error(error);*/
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    }
  };

  return (
    <>
      <Wizard />
      <div className="flex flex-col my-10 text-center justify-items-center">
        <h1 className="font-bold text-2xl">{fullInspection?.name ?? ""}</h1>
        <p>{fullInspection?.description ?? ""}</p>
      </div>
      {fullInspection?.questions
        .filter(
          (item) => item.groupName === groupName && item.groupId === groupId
        )
        .map((item, index) => (
          <button
            onClick={() => goStep(item)}
            className={clsx(
              `w-full flex flex-row card lg:card-side  shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-lg mb-5  text-white `,
              !item.statusInspectionConfig
                ? `bg-black/80 hover:bg-[#191917] hover:text-white/80`
                : `bg-green-800/80 hover:bg-green-800 hover:text-white/80`
            )}
            key={index}
          >
            <div
              className={clsx(
                ` w-fit flex items-center justify-center p-2`,
                item.statusInspectionConfig ? `bg-green-800` : `bg-[#191917]`
              )}
            >
              {item.statusInspectionConfig ? (
                <FaCheckCircle className="w-[20px] h-[20px]  text-green-400 mx-auto" />
              ) : (
                <BsQuestionCircle className="w-[20px] h-[20px]  text-white mx-auto" />
              )}
            </div>

            <div className="card-body flex flex-row justify-between gap-5">
              <div>
                <h2 className="card-title text-left">{item.question}</h2>
              </div>
            </div>
          </button>
        ))}
      <div className="text-center mt-5">
        {enableFinalButton == 0 && (
          <button
            disabled={enableFinalButton > 0}
            className="btn font-normal bg-black text-white rounded-full pr-3 py-6 sm:flex border-none flex-1 w-fit mx-auto text-[13px]"
            onClick={() => useInspectionFullStore.getState().setStepWizard(1)}
          >
            {t("step2.1")}{" "}
            <span className="underline text-red-400">{t("step2.1_5")}</span>
          </button>
        )}
      </div>
    </>
  );
};

export default GenerateStep2;
