// components/AnswerText.tsx
import { useTranslations } from "next-intl";
import React from "react";
import { AnswerTextProps } from "./AnswerText.types";

const AnswerText = ({ value, onChange }: AnswerTextProps) => {
  const t = useTranslations("placeholders");
  return (
    <div className="mt-6">
      <textarea
        className="textarea textarea-bordered w-full text-lg"
        placeholder={t("write_answer")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default AnswerText;
