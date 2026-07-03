"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { axiosInstance } from "@/core/utils/axiosInstance";
import { LiftgateInspection } from "@/core/types/order/ITypes";
import Loading from "@/presentation/components/shared/Loading";
import LiftgateInspectionCheckList, {
  IInspection,
  IInspectionDetail,
} from "@/presentation/components/shared/InspectionsPdf/LiftgateInspectionCheckList";
import BackButton from "@/presentation/components/shared/BackButton";
import ActionButton from "@/presentation/components/shared/tableButtons/ActionButton";
import { FiEdit, FiPrinter } from "react-icons/fi";
import { AiOutlineFilePdf } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { useReactToPrint } from "react-to-print";
import { generatePDF } from "@/core/utils/generatePDF";
import RenderComponentByNumber from "@/presentation/components/shared/InspectionsPdf/RenderComponentByNumber";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  CARGAR_DEMO,
  DEMO_TEMPLATES,
  getDemoTemplateData,
  getDemoInspectionDetails,
} from "@/features/orders/inspections/utils/demoData";

const GeneratePdfPage = () => {
  const tToasts = useTranslations("toast");
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [templateData, setTemplateData] = useState<LiftgateInspection | null>(
    null,
  );
  const [inspectionData, setInspectionData] = useState<IInspection | null>(
    null,
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
    @page { size: auto; margin: 5mm; }
    @media print {
      html, body { 
        -webkit-print-color-adjust: exact !important; 
        print-color-adjust: exact !important; 
        width: 794px !important;
        min-width: 794px !important;
      }
      #pdf-content {
        width: 794px !important;
        min-width: 794px !important;
        max-width: 794px !important;
        margin: 0 auto !important;
        padding: 0 !important;
        overflow: visible !important;
      }
    }
  `,
  });

  useEffect(() => {
    const fetchData = async () => {
      const numInspId = Number(inspectionId);
      const numTempId = Number(templateInspectionId);

      if (CARGAR_DEMO && numInspId < 0) {
        setTemplateData(getDemoTemplateData(numTempId));
        setInspectionData({
          inspectionId: numInspId,
          inspectionNumber: `DEMO-${String(numTempId).padStart(3, "0")}`,
          typeInspectionId: 1,
          templateInspectionId: numTempId,
          customerId: "1",
          employeeId: "1",
          customerName: `Demo Client (${DEMO_TEMPLATES[numTempId] || "Template"})`,
          employeeName: "Demo Inspector AI",
          dateOfInspection: new Date().toISOString(),
          inspectionDetails: getDemoInspectionDetails(numTempId),
          inspectionPhotos: [],
        });
        return;
      }

      try {
        const [resTemplate, resInspection] = await Promise.allSettled([
          axiosInstance.get(
            `/TemplateInspection/GetTemplateInspectionById?TemplateInspectionId=${templateInspectionId}`,
          ),
          axiosInstance.get(
            `/Inspection/GetInspectionById?InspectionId=${inspectionId}`,
          ),
        ]);

        if (resTemplate.status === "fulfilled") {
          setTemplateData(resTemplate.value.data);
        } else if (CARGAR_DEMO) {
          setTemplateData(getDemoTemplateData(numTempId));
        } else {
          toast.error(`${tToasts("error")}: ${tToasts("msj.3")}`);
        }

        if (resInspection.status === "fulfilled") {
          setInspectionData(resInspection.value.data);
        } else if (CARGAR_DEMO) {
          setInspectionData({
            inspectionId: numInspId,
            inspectionNumber: `DEMO-${String(numTempId).padStart(3, "0")}`,
            typeInspectionId: 1,
            templateInspectionId: numTempId,
            customerId: "1",
            employeeId: "1",
            customerName: `Demo Client (${DEMO_TEMPLATES[numTempId] || "Template"})`,
            employeeName: "Demo Inspector AI",
            dateOfInspection: new Date().toISOString(),
            inspectionDetails: getDemoInspectionDetails(numTempId),
            inspectionPhotos: [],
          });
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
                `Inspection - ${templateData.name}.pdf`,
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
