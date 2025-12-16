"use client";

import FormGroup from "@/shared/components/shared/FormGroup";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useAuthStore } from "@/shared/stores/useAuthStore";

import { setCookie } from "cookies-next";
import { toast } from "sonner";
import LanguageSwitcher from "@/features/locale/LanguageSwitcher";
import { formatApiErrorForToast } from "@/shared/utils/errors";

const STATUS_QB_WAITING = "waiting" as const;
const STATUS_QB_IDLE = "idle" as const;
const STATUS_QB_ERROR = "error" as const;

const MAX_QB_ATTEMPTS = 20;
const QB_POLL_INTERVAL_MS = 3000;

export default function Home() {
  const router = useRouter();
  const t = useTranslations("home");
  const tToasts = useTranslations("toast");
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginSchema = z.object({
    userName: z.string().min(1, t("validations.user_required")),
    password: z.string().min(1, t("validations.password_required")),
  });

  type LoginData = z.infer<typeof loginSchema>;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- Estado para QuickBooks ---
  const [qbStatus, setQbStatus] = useState<
    typeof STATUS_QB_IDLE | typeof STATUS_QB_WAITING | typeof STATUS_QB_ERROR
  >(STATUS_QB_IDLE);
  const [qbErrorMessage, setQbErrorMessage] = useState<string | null>(null);
  const [qbPolling, setQbPolling] = useState(false);
  const [qbLastUrl, setQbLastUrl] = useState<string | null>(null); // para mostrar link fallback

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * Flujo QuickBooks:
   * 1) Comprobar si YA hay access-token (usuario ya vinculado).
   * 2) Si no hay, llamar a /QuickBooks/connect, abrir pestaña y empezar polling.
   */
  const ensureQuickBooksConnected = async () => {
    try {
      setQbStatus(STATUS_QB_IDLE);
      setQbErrorMessage(null);

      // 1) Verificar si ya existe access-token
      const tokenRes = await axiosInstance.get("/QuickBooks/access-token");
      const existingToken = tokenRes.data?.access_token as
        | string
        | null
        | undefined;
      if (existingToken && existingToken.trim() !== "") {
        // Ya está todo ok, no hace falta abrir nada
        toast.success("QuickBooks ya estaba conectado.");
        router.push("/dashboard/documents/work-orders");
        return;
      }

      // 2) No hay token -> iniciar flujo completo
      const res = await axiosInstance.get("/QuickBooks/connect");
      const url = res.data?.url as string | undefined;

      if (!url) {
        toast.error("No se pudo obtener la URL de QuickBooks.");
        setQbStatus(STATUS_QB_ERROR);
        setQbErrorMessage("No se pudo obtener la URL de QuickBooks.");
        return;
      }

      setQbLastUrl(url);

      // Abrimos en una nueva pestaña
      const qbWindow = window.open(url, "_blank", "noopener,noreferrer");

      // Algunos navegadores (especialmente mobile) pueden devolver null
      // incluso si abrieron la pestaña. Por eso no marcamos error aquí.
      if (!qbWindow) {
        // Solo mostramos un aviso suave, sin error
        setQbErrorMessage(
          "Si la pestaña de QuickBooks no se abrió, haz clic en el enlace de abajo para abrirla manualmente."
        );
      }

      // Mostramos mensaje de espera y arrancamos el polling
      setQbStatus(STATUS_QB_WAITING);
      setQbPolling(true);
    } catch (error) {
      /*console.error("QuickBooks connect/access-token error:", error);
      toast.error("Error al conectar/verificar QuickBooks.");*/
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
      setQbStatus(STATUS_QB_ERROR);
      setQbErrorMessage("Error al conectar o verificar QuickBooks.");
    }
  };

  /**
   * Polling cada 3 segundos a /QuickBooks/access-token
   */
  useEffect(() => {
    if (!qbPolling) return;

    let attempts = 0;

    const intervalId = window.setInterval(async () => {
      attempts += 1;

      try {
        const res = await axiosInstance.get("/QuickBooks/access-token");
        const accessToken = res.data?.access_token as string | null | undefined;

        if (accessToken && accessToken.trim() !== "") {
          // ✅ Token obtenido
          window.clearInterval(intervalId);
          setQbPolling(false);
          setQbStatus(STATUS_QB_IDLE);
          setQbErrorMessage(null);

          toast.success("QuickBooks conectado correctamente.");
          router.push("/dashboard/documents/work-orders");
          return;
        }

        if (attempts >= MAX_QB_ATTEMPTS) {
          // ❌ No se obtuvo token después de X intentos
          window.clearInterval(intervalId);
          setQbPolling(false);
          setQbStatus(STATUS_QB_ERROR);
          setQbErrorMessage(
            "Inicio de sesión fallido por token. Vuelve a intentar la conexión con QuickBooks."
          );
          toast.error("Inicio de sesión fallido por token.");
        }
      } catch (error) {
        /*console.error("QuickBooks access-token error:", error);*/
        const msg = formatApiErrorForToast(error);
        toast.error(msg, {
          style: { whiteSpace: "pre-line" },
        });
        window.clearInterval(intervalId);
        setQbPolling(false);
        setQbStatus(STATUS_QB_ERROR);
        setQbErrorMessage("Error al verificar QuickBooks.");
        toast.error("Error al verificar QuickBooks.");
      }
    }, QB_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [qbPolling, router]);

  /**
   * Login normal + flujo QuickBooks
   */
  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axiosInstance.post("/Auth/login", data);

      if (res.data?.token && res.data?.user) {
        //  Guarda el token en cookies
        setCookie("auth-token", res.data.token, { path: "/" });

        //  Guarda en Zustand
        setAuth({
          token: res.data.token,
          user: res.data.user,
        });

        toast.success(`${tToasts("ok")}: ${tToasts("msj.1")}`);

        // 🚀 Asegurar conexión con QuickBooks (pre-check + posible ventana nueva)
        await ensureQuickBooksConnected();
      } else {
        toast.error(`${tToasts("error")}: ${tToasts("msj.2")}`);
      }
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: {
            errors?: { key: string; value: string[] }[];
          };
        };
      };

      const backendErrors = error?.response?.data?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length) {
        toast.error(
          `${tToasts("error")}: ${backendErrors[0].value?.join(", ")}`
        );
      } else {
        toast.error(`${tToasts("error")}: ${String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-dvh w-full flex sm:flex-col md:flex-row flex-col items-center justify-center">
      <div className="login-form h-full flex flex-col items-center justify-center w-full md:w-[50%] py-5 fixed md:relative ">
        <div className="w-full h-[39px] flex items-center justify-center">
          <div className="container flex flex-row items-center justify-between h-full">
            <p className="uppercase font-bold text-[20px]">visegu</p>

            <LanguageSwitcher design="header-dashboard" />
          </div>
        </div>

        <div className="flex flex-1 p-[15px] md:p-0 items-center justify-center w-full max-w-[500px] md:max-w-[500px]">
          <div className="container flex flex-col gap-4 !p-5 md:p-0 bg-transparent rounded-md md:bg-transparent max-w-full">
            <div>
              <div className="flex flex-row justify-between">
                <h1 className="uppercase font-bold text-left text-[30px]">
                  {t("form-title")}
                </h1>
              </div>
              <p className="text-gray-400">{t("form-info")}</p>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}

            {/* Mensaje de estado QuickBooks */}
            {qbStatus === STATUS_QB_WAITING && (
              <div className="alert alert-info text-sm flex flex-col gap-1">
                <span>
                  Esperando confirmación del login de QuickBooks... <br />
                  Por favor completa el inicio de sesión en la pestaña que se
                  abrió.
                </span>
                {qbLastUrl && (
                  <a
                    href={qbLastUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-hover font-medium"
                  >
                    Si no ves la pestaña, haz clic aquí para abrir QuickBooks
                    manualmente
                  </a>
                )}
              </div>
            )}

            {qbStatus === STATUS_QB_ERROR && qbErrorMessage && (
              <div className="alert alert-warning text-sm">
                <span>{qbErrorMessage}</span>
              </div>
            )}

            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <label>{t("email")}</label>
                <input
                  type="text"
                  placeholder=""
                  className="input input-lg text-lg w-full"
                  {...register("userName")}
                />
                {errors.userName && (
                  <span className="text-red-500 text-sm">
                    {errors.userName.message}
                  </span>
                )}
              </FormGroup>

              <FormGroup>
                <label>{t("password")}</label>
                <input
                  type="password"
                  placeholder=""
                  className="input input-lg text-lg w-full"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </FormGroup>

              <div className="flex flex-row items-center justify-between gap-2">
                <label className="label w-full flex items-center gap-2">
                  <input type="checkbox" className="checkbox" />
                  {t("remember-password")}
                </label>
                <Link href="#" className="underline min-w-fit">
                  {t("forgot-password")}
                </Link>
              </div>

              <FormGroup>
                <button
                  type="submit"
                  disabled={loading}
                  className="shadow-md btn btn-neutral btn-block min-h-[41px] text-[13px]"
                >
                  {loading && <span className="loading loading-spinner"></span>}
                  {t("btn-login")}
                </button>
              </FormGroup>
            </form>

            <div className="text-center mt-4 flex items-center justify-center text-gray-400 font-light">
              <Link href="#" className="underline">
                {t("mistakes-login")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="login-promo h-full w-full md:w-[50%] bg-cover bg-center hidden md:flex"
        style={{ backgroundImage: 'url("/assets/img/bg.jpg")' }}
      />
    </main>
  );
}
