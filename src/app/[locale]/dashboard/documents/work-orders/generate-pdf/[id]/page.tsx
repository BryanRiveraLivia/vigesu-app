// app/work-orders/generate-pdf/[id]/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { WorkOrder } from "@/shared/types/order/ITypes";
import { useReactToPrint } from "react-to-print";
import Loading from "@/shared/components/shared/Loading";
import WorkOrderPdf from "@/shared/components/shared/WorkOrderPdf/WorkOrderPdf";
import BackButton from "@/shared/components/shared/BackButton";
import ActionButton from "@/shared/components/shared/tableButtons/ActionButton";
import { FiEdit, FiPrinter } from "react-icons/fi";
import { AiOutlineFilePdf } from "react-icons/ai";
import { usePathname } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useDownloadPDF } from "@/shared/hooks/useDownloadPDF";
import { sanitizeElementForPDF } from "@/shared/utils/utils";
import html2pdf from "html2pdf.js";
import { CiEdit } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { generatePDF } from "@/shared/utils/generatePDF";
import { useTranslations } from "next-intl";

const GeneratePdfPage = () => {
  const tWorkOrders = useTranslations("workorders");
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const pathname = usePathname();
  const { downloadPDF } = useDownloadPDF();
  const { id } = useParams();
  const [data, setData] = useState<WorkOrder | null>(null);
  const componentRef = useRef(null);

  useEffect(() => {
    axiosInstance
      .get(`/WorkOrder/GetWorkOrderById?WorkOrderId=${id}`)
      .then((res) => setData(res.data));
  }, [id]);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  const handleOpenPreview = () => {
    const content = contentRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Extraer estilos del documento actual (Tailwind incluido)
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          return ""; // Evitar errores CORS
        }
      })
      .join("\n");

    printWindow.document.write(`
      <html>
        <head>
          <title>${tWorkOrders("print.preview_title")}</title>
          <style>${styles}</style>
          <style>
            body { font-family: sans-serif; padding: 1rem; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
        <script>
    window.onload = function() {
      window.print();
    };
  </script>
      </html>
    `);

    printWindow.document.close();
  };

  useEffect(() => {
    /*if (data && contentRef.current) {
      handlePrint?.();
    }*/
  }, [data]);

  if (!data) return <Loading />;

  return (
    <>
      <div className="header-page flex flex-row items-center justify-between min-h-[70px] bg-base-200 px-6 gap-2">
        <BackButton
          title={`${tWorkOrders("print.0")} #${id}`}
          link={`../../`}
        />
        <div className="flex flex-row gap-2">
          <ActionButton
            className={`${
              isEditable ? `!bg-[#60285a]` : `bg-[#7c3174]`
            } text-white`}
            icon={
              !isEditable ? (
                <FiEdit className="w-[20px] h-[20px] opacity-70" />
              ) : (
                <IoCloseOutline className="w-[20px] h-[20px] opacity-70" />
              )
            }
            label={isEditable ? tWorkOrders("print.2") : tWorkOrders("print.1")}
            onClick={() => setIsEditable((prev) => !prev)}
          />
          <ActionButton
            className="!bg-black text-white"
            icon={<FiPrinter className="w-[20px] h-[20px] opacity-70" />}
            label={tWorkOrders("print.3")}
            onClick={() => handlePrint()}
          />
          <ActionButton
            className="!bg-red-500 text-white"
            icon={<AiOutlineFilePdf className="w-[20px] h-[20px] opacity-70" />}
            label={tWorkOrders("print.4")}
            onClick={() =>
              generatePDF("pdf-content", `WorkOrder - ${data.workOrderId}.pdf`)
            }
          />
        </div>
      </div>
      <div className="body-app overflow-y-auto ">
        <div
          ref={contentRef}
          className="container max-w-full my-5"
          id="pdf-content"
        >
          <WorkOrderPdf
            ref={componentRef}
            isEditable={isEditable}
            data={data}
          />
        </div>
      </div>
    </>
  );
};

export default GeneratePdfPage;
