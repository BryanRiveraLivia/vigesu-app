import type { AxiosError } from "axios";

type ApiValidationError = {
  title?: string;
  status?: number;
  errors?: Array<{ key: string; value: string[] }>;
  message?: string;
};

export const formatApiErrorForToast = (err: unknown) => {
  const axiosErr = err as AxiosError<ApiValidationError>;

  const data = axiosErr?.response?.data;

  // Caso: tu backend devuelve { title, status, errors: [{key, value:[]}] }
  if (data?.errors?.length) {
    const lines = data.errors.flatMap((e) =>
      (e.value ?? []).map((msg) => `• ${e.key}: ${msg}`)
    );

    const title = data.title || "Error de validación";

    return `${title}\n${lines.join("\n")}`;
  }

  // Caso: mensaje estándar
  return (
    (data as any)?.detail ||
    data?.message ||
    axiosErr?.message ||
    "Ocurrió un error inesperado."
  );
};
