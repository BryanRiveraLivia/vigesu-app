import { DOMAIN } from "@/core/config/constants";
import Loading from "@/presentation/components/shared/Loading";
import { useAuthStore } from "@/presentation/stores/useAuthStore";
import { axiosInstance } from "@/core/utils/axiosInstance";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AnswerSign {
  employeeId: string;
  employeeName: string;
  rol: number;
  signatureImagePath: string;
  status: number;
  userId: number;
  userName: string;
}

interface Props {
  onComplete: (isValid: boolean, url?: string) => void;
}

const AnswerSign = ({ onComplete }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<AnswerSign | null>(null);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/User/GetUserId?UserId=${user?.userId}`
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
  }, [dataUser?.signatureImagePath]);

  return (
    <div className="mt-6">
      {dataUser?.signatureImagePath ? (
        <img
          src={`${DOMAIN}${dataUser.signatureImagePath}`}
          alt="Firma"
          className="mx-auto bg-contain max-w-[500px] h-auto w-full"
        />
      ) : (
        <>
          <Loading
            className="mx-auto bg-contain max-w-[500px] h-auto my-10"
            label=""
          ></Loading>
        </>
      )}
    </div>
  );
};

export default AnswerSign;
