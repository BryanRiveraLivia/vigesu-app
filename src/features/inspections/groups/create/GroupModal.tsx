// components/GroupModal.tsx
"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AiOutlineSave } from "react-icons/ai";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { StatusEnum } from "@/features/inspections/models/GroupTypes";
import { formatApiErrorForToast } from "@/shared/utils/errors";
import { toast } from "sonner";

interface GroupModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editMode?: boolean;
  defaultValue?: string;
  defaultStatus?: StatusEnum;
  groupIdToEdit?: number;
}

const GroupModal: React.FC<GroupModalProps> = ({
  onClose,
  onSuccess,
  editMode = false,
  defaultValue = "",
  defaultStatus = StatusEnum.Active,
  groupIdToEdit,
}) => {
  const [name, setName] = useState(defaultValue);
  const [status, setStatus] = useState<StatusEnum>(defaultStatus);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return alert("El nombre es obligatorio");
    setLoading(true);
    try {
      if (editMode && groupIdToEdit !== undefined) {
        await axiosInstance.put(`/Group/${groupIdToEdit}`, {
          groupId: groupIdToEdit,
          name,
          status,
        });
      } else {
        await axiosInstance.post("/Group", { name });
      }
      onSuccess();
      onClose();
    } catch (error) {
      /*console.error("Error al guardar grupo", error);
      alert("Hubo un error al guardar el grupo");*/
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
          <label className="font-semibold mb-1 block text-lg">
            {editMode ? "Edit Group" : "New Group"}
          </label>
          <input
            type="text"
            className="input input-lg bg-[#f6f3f4] w-full text-lg"
            placeholder="Group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {editMode && (
          <div className="mb-3">
            <label className="font-semibold mb-1 block text-lg">Status</label>
            <select
              className="select w-full input-lg"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              <option value={StatusEnum.Active}>Activo</option>
              <option value={StatusEnum.Inactive}>Inactivo</option>
            </select>
          </div>
        )}

        <div className="modal-action flex items-center justify-between">
          <button
            type="button"
            className="btn"
            onClick={onClose}
            disabled={loading}
          >
            <IoMdClose className="w-[20px] h-[20px] opacity-70" /> Cancelar
          </button>
          <button
            type="button"
            className="btn"
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
          >
            <AiOutlineSave className="w-[20px] h-[20px] opacity-70" />
            Guardar
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default GroupModal;
