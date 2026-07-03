"use client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const EmailConfirmationModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  userName,
}) => {
  const tToasts = useTranslations("toast");
  const tPlaceholders = useTranslations("placeholders");
  const tGeneral = useTranslations("general");
  const tModal = useTranslations("email_modal");

  const [email, setEmail] = useState("bryan.riv09@gmail.com");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.includes("@")) {
      toast.warning(`${tToasts("warning")}: ${tToasts("msj.25")}`);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/send-inspection-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: userName }),
      });

      const json = await res.json();

      if (!res.ok || json.error) throw new Error("Fallo al enviar correo");

      toast.success(`${tToasts("ok")}: ${tToasts("msj.26")}`);
      onClose();
      onConfirm(); // Ejecuta handleFinalSubmit
    } catch (err) {
      toast.error(`${tToasts("error")}: ${tToasts("msj.27")}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-lg font-semibold">{tModal("title")}</h2>
        <input
          type="email"
          className="input input-bordered w-full"
          placeholder={tPlaceholders("email_example")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-4">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            {tGeneral("btnCancel")}
          </button>
          <button
            className="btn bg-black text-white"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? tGeneral("sending") : tGeneral("btnSend")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationModal;
