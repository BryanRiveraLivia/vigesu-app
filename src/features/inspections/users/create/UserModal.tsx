"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AiOutlineSave } from "react-icons/ai";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { UserStatusLabel } from "../../models/UsersTypes";
import SignaturePad, { SignaturePadRef } from "../SignaturePad";
import { useRef } from "react";
import { formatApiErrorForToast } from "@/shared/utils/errors";
import { toast } from "sonner";

interface UserModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editMode?: boolean;
  defaultData?: {
    userId: number;
    userName: string;
    password: string;
    employeeId: string;
    employeeName: string;
    rol: number;
  };
}

const UserModal: React.FC<UserModalProps> = ({
  onClose,
  onSuccess,
  editMode = false,
  defaultData,
}) => {
  console.log("defaultData: ", defaultData);
  const signatureRef = useRef<SignaturePadRef>(null);

  const [userName, setUserName] = useState(defaultData?.userName || "");
  const [employeeId, setEmployeeId] = useState(defaultData?.employeeId || "");
  const [employeeName, setEmployeeName] = useState(
    defaultData?.employeeName || ""
  );
  const [rol, setRol] = useState(defaultData?.rol || 0);
  const [password, setPassword] = useState(defaultData?.password || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userName || !employeeName)
      return alert("Todos los campos son obligatorios");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("UserName", userName);
      formData.append("Password", password);
      formData.append("EmployeeId", employeeId);
      formData.append("EmployeeName", employeeName);
      formData.append("Rol", rol.toString());

      const signatureBlob = signatureRef.current?.getImageBlob();
      if (signatureBlob) {
        formData.append("SignatureImage", signatureBlob, "signature.png");
      }

      if (editMode && defaultData?.userId !== undefined) {
        formData.append("UserId", defaultData.userId.toString());

        await axiosInstance.put(`/User/${defaultData.userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axiosInstance.post("/User", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      /*console.error("Error al guardar usuario", error);
      alert("Hubo un error al guardar el usuario");*/
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog open className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="mb-3">
          <label className="block text-lg font-semibold">Username</label>
          <input
            className="input input-lg w-full"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="block text-lg font-semibold">Employee ID</label>
          <input
            className="input input-lg w-full"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="block text-lg font-semibold">Employee Name</label>
          <input
            className="input input-lg w-full"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="block text-lg font-semibold">Password</label>
          <input
            className="input input-lg w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="block text-lg font-semibold">Role</label>
          <select
            className="select input-lg w-full"
            value={rol}
            onChange={(e) => setRol(Number(e.target.value))}
          >
            {Object.entries(UserStatusLabel).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-lg font-semibold">Firma</label>
          <SignaturePad ref={signatureRef} />
        </div>
        <div className="mt-2">
          <button
            className="btn btn-sm btn-outline"
            type="button"
            onClick={() => signatureRef.current?.clear()}
          >
            Limpiar firma
          </button>
        </div>

        <div className="modal-action flex justify-between">
          <button className="btn" onClick={onClose} disabled={loading}>
            <IoMdClose className="w-5 h-5 opacity-70" /> Cancelar
          </button>
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={loading || !userName.trim()}
          >
            <AiOutlineSave className="w-5 h-5 opacity-70" /> Guardar
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default UserModal;
