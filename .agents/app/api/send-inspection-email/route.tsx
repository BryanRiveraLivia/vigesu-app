import { EmailTemplate } from "@/features/orders/inspections/components/emailTemplates/EmailTemplate";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { isAllowedOrigin } from "@/core/utils/validateOrigin";

const bodySchema = z.object({
  email: z.string().email().max(254),
  name: z.string().min(1).max(100),
});

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("❌ RESEND_API_KEY no está configurada");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const result = bodySchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues },
        { status: 400 }
      );
    }

    const { email, name } = result.data;
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "Inspections <onboarding@resend.dev>",
      to: [email],
      subject: "Confirmación de Inspección",
      react: <EmailTemplate recipientName={name} />,
    });

    if (error) {
      console.error("Error Resend:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error general:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
