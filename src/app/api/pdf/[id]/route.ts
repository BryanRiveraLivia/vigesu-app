import puppeteer from "puppeteer";
import { NextRequest } from "next/server";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  const type = url.searchParams.get("type") || "default";
  const locale = "es";
  const origin = url.origin;

  let pdfUrl = "";
  let fileNamePDF = "";

  switch (type) {
    case "liftgate":
      pdfUrl = `${origin}/${locale}/dashboard/documents/inspections/generate-pdf/${id}?preview=true`;
      fileNamePDF = `Inspection-${id}.pdf`;
      break;
    default:
      pdfUrl = `${origin}/${locale}/dashboard/documents/work-orders/generate-pdf/${id}?preview=true`;
      fileNamePDF = `WorkOrder-${id}.pdf`;
      break;
  }

  // ✅ Acepta cookies y/o Authorization reenviados desde attach-estimate-pdf
  const cookie = req.headers.get("cookie") || "";
  const auth = req.headers.get("authorization") || "";

  let browser: any;

  try {
    // ✅ headless compatible (evita "new" si tu puppeteer no lo soporta)
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    let lastErr: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      const page = await browser.newPage();

      try {
        await page.setViewport({ width: 1080, height: 8000 });
        page.setDefaultNavigationTimeout(60000);
        page.setDefaultTimeout(60000);

        const extraHeaders: Record<string, string> = {};
        if (cookie) extraHeaders.cookie = cookie;
        if (auth) extraHeaders.Authorization = auth;

        if (Object.keys(extraHeaders).length) {
          await page.setExtraHTTPHeaders(extraHeaders);
        }

        const resp = await page.goto(pdfUrl, { waitUntil: "domcontentloaded" });

        if (!resp) {
          throw new Error(
            `page.goto returned null (attempt=${attempt}) url=${pdfUrl}`
          );
        }

        // Si te redirige a login, aquí suele verse como 200 pero con otra URL.
        // Dejamos el mensaje claro.
        const finalUrl = page.url();
        if (!resp.ok()) {
          throw new Error(
            `page.goto failed (attempt=${attempt}): status=${resp.status()} finalUrl=${finalUrl} targetUrl=${pdfUrl}`
          );
        }

        await sleep(600);

        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
        });

        await page.close().catch(() => {});
        return new Response(Buffer.from(pdfBuffer), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${fileNamePDF}"`,
          },
        });
      } catch (e: any) {
        lastErr = e;
        const msg = String(e?.message || e);

        await page.close().catch(() => {});

        // reintento para frame detached
        if (msg.includes("frame was detached") || msg.includes("detached")) {
          continue;
        }

        break;
      }
    }

    return new Response(`PDF_ERROR: ${lastErr?.message || String(lastErr)}`, {
      status: 500,
    });
  } catch (err: any) {
    console.error("pdf route fatal error:", err);
    return new Response(`PDF_FATAL: ${err?.message || String(err)}`, {
      status: 500,
    });
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
