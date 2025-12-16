import { NextRequest } from "next/server";
import { API_CONFIG } from "@/shared/config/apiConfig";

export async function POST(req: NextRequest) {
  try {
    const { quickBookEstimateId, workOrderId, type, realmId } =
      await req.json();

    if (!quickBookEstimateId || !workOrderId) {
      return new Response(
        "Faltan parámetros: quickBookEstimateId o workOrderId",
        {
          status: 400,
        }
      );
    }

    const safeType = type || "workorder";
    const safeRealmId = realmId || "9341454759827689";

    // 1) Generar PDF desde tu propio API usando el origin real del request
    const origin = new URL(req.url).origin;
    const pdfResp = await fetch(
      `${origin}/api/pdf/${workOrderId}?type=${safeType}`
    );

    if (!pdfResp.ok) {
      const t = await pdfResp.text().catch(() => "");
      return new Response(`No se pudo generar PDF. ${t}`, { status: 500 });
    }

    const pdfArrayBuffer = await pdfResp.arrayBuffer();
    if (!pdfArrayBuffer.byteLength) {
      return new Response("PDF vacío", { status: 500 });
    }

    // 2) FormData en server (OK)
    const formData = new FormData();
    formData.append("QuickBookEstimateId", String(quickBookEstimateId));
    formData.append("QuickBookEstimatedId", String(quickBookEstimateId)); // compat
    formData.append(
      "FilePdf",
      new Blob([pdfArrayBuffer], { type: "application/pdf" }),
      `WorkOrder-${workOrderId}.pdf`
    );
    formData.append("RealmId", String(safeRealmId));

    // 3) Forward al backend real con Authorization (Bearer)
    const auth = req.headers.get("authorization") || "";

    const qbResp = await fetch(
      `${API_CONFIG.BASE_URL}/QuickBooks/estimates/attachmentPDF?RealmId=${encodeURIComponent(
        safeRealmId
      )}`,
      {
        method: "POST",
        body: formData,
        headers: {
          ...(auth ? { Authorization: auth } : {}),
          // NO Content-Type aquí
        },
      }
    );

    const text = await qbResp.text().catch(() => "");

    // Devuelve tal cual para ver el error real si falla
    return new Response(text || "OK", { status: qbResp.status });
  } catch (err: any) {
    console.error("attach-estimate-pdf route error:", err);
    return new Response(err?.message || "Error inesperado", { status: 500 });
  }
}
