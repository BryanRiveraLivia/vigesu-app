"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/useAuthStore";

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos en ms

export default function SessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, logout } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        logout(); // limpia Zustand
        setShowModal(true); // muestra el modal
      }, INACTIVITY_LIMIT);
    };

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );
    resetTimer(); // inicializa el timer

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [logout]);

  useEffect(() => {
    // detecta borrado del store
    const unsub = useAuthStore.subscribe((state) => {
      if (!state.token || !state.user) {
        setShowModal(true);
      }
    });

    return () => unsub();
  }, []);

  const handleLoginRedirect = () => {
    setShowModal(false);
    router.push("/");
  };

  return (
    <>
      {children}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-80 flex items-center justify-center z-[9999]">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Sesión finalizada</h2>
            <p className="mb-6 text-gray-600">
              Por inactividad o pérdida de sesión, debes iniciar nuevamente.
            </p>
            <button
              onClick={handleLoginRedirect}
              className="btn btn-neutral w-full"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}
