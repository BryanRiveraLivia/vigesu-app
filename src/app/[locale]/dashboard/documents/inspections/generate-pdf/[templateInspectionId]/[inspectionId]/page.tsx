"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { LiftgateInspection } from "@/shared/types/order/ITypes";
import Loading from "@/shared/components/shared/Loading";
import LiftgateInspectionCheckList, {
  IInspection,
  IInspectionDetail,
} from "@/shared/components/shared/InspectionsPdf/LiftgateInspectionCheckList";
import BackButton from "@/shared/components/shared/BackButton";
import ActionButton from "@/shared/components/shared/tableButtons/ActionButton";
import { FiEdit, FiPrinter } from "react-icons/fi";
import { AiOutlineFilePdf } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import { generatePDF } from "@/shared/utils/generatePDF";
import RenderComponentByNumber from "@/shared/components/shared/InspectionsPdf/RenderComponentByNumber";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const GeneratePdfPage = () => {
  const tToasts = useTranslations("toast");
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [templateData, setTemplateData] = useState<LiftgateInspection | null>(
    null
  );
  const [inspectionData, setInspectionData] = useState<IInspection | null>(
    null
  );

  const params = useParams();
  const searchParams = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const templateInspectionId = params.templateInspectionId;
  const inspectionId = params.inspectionId;

  const pdfRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: pdfRef, // ✅ v3 usa contentRef, no 'content'
    documentTitle: `Inspection - ${templateData?.name ?? "Inspection"}`,

    pageStyle: `
    @page { size: auto; margin: 12mm; }
    @media print {
      html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  `,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTemplate, resInspection] = await Promise.allSettled([
          axiosInstance.get(
            `/TemplateInspection/GetTemplateInspectionById?TemplateInspectionId=${templateInspectionId}`
          ),
          axiosInstance.get(
            `/Inspection/GetInspectionById?InspectionId=${inspectionId}`
          ),
        ]);

        if (resTemplate.status === "fulfilled") {
          setTemplateData(resTemplate.value.data);
        } else {
          toast.error(`${tToasts("error")}: ${tToasts("msj.3")}`);
        }

        if (resInspection.status === "fulfilled") {
          setInspectionData(resInspection.value.data);
        }
      } catch (error) {
        toast.error(`${tToasts("error")}: ${error}`);
      }
    };

    fetchData();
  }, [templateInspectionId, inspectionId, tToasts]);

  if (!templateData) return <Loading />;

  return (
    <>
      <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
        <BackButton title={templateData.name} link={`../../`} />
        <div className="flex flex-row gap-2">
          <ActionButton
            className={`${isEditable ? `!bg-[#60285a]` : `bg-[#7c3174]`} text-white !hidden`}
            icon={
              !isEditable ? (
                <FiEdit className="w-[20px] h-[20px] opacity-70" />
              ) : (
                <IoCloseOutline className="w-[20px] h-[20px] opacity-70" />
              )
            }
            label={isEditable ? "Disable edition" : "Enable edition"}
            onClick={() => setIsEditable((prev) => !prev)}
          />
          <ActionButton
            className="!bg-black text-white"
            icon={<FiPrinter className="w-[20px] h-[20px] opacity-70" />}
            label={`Print order `}
            onClick={() => handlePrint()}
          />
          <ActionButton
            className="!bg-red-500 text-white"
            icon={<AiOutlineFilePdf className="w-[20px] h-[20px] opacity-70" />}
            label={`Download PDF `}
            onClick={() =>
              generatePDF(
                "pdf-content",
                `Inspection - ${templateData.name}.pdf`
              )
            }
          />
        </div>
      </div>
      <div className="body-app overflow-y-auto">
        <div
          ref={pdfRef}
          className="container min-h-screen max-w-full my-5"
          id="pdf-content"
        >
          <div>
            {RenderComponentByNumber(templateData.templateInspectionId, {
              data: templateData,
              inspectionDetails: inspectionData?.inspectionDetails ?? [],
              isEditable: isEditable,
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneratePdfPage;
