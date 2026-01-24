import { DOMAIN } from "@/core/config/constants";
import Loading from "@/presentation/components/shared/Loading";
import { useAuthStore } from "@/presentation/stores/useAuthStore";
import { axiosInstance } from "@/core/utils/axiosInstance";
import { useEffect, useState } from "react";
import { AnswerSignProps, UserSignatureData } from "./AnswerSign.types";

const AnswerSign = ({ onComplete }: AnswerSignProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<UserSignatureData | null>(null);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/User/GetUserId?UserId=${user?.userId}`,
        );
        const data = res.data;
        setDataUser(data);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchUser();
  }, [user?.userId]);

  useEffect(() => {
    if (dataUser?.signatureImagePath) {
      onComplete(true, `${dataUser.signatureImagePath}`);
    } else {
      onComplete(false, undefined);
    }
  }, [dataUser?.signatureImagePath, onComplete]);

  return (
    <div className="mt-6">
      {loading ? (
        <Loading
          className="mx-auto bg-contain max-w-[500px] h-auto my-10"
          label=""
        />
      ) : dataUser?.signatureImagePath ? (
        <img
          src={`${DOMAIN}${dataUser.signatureImagePath}`}
          alt="Firma"
          className="mx-auto bg-contain max-w-[500px] h-auto w-full"
        />
      ) : (
        <div className="text-center py-10 opacity-50 italic">
          No se encontró firma para este usuario
        </div>
      )}
    </div>
  );
};

export default AnswerSign;
