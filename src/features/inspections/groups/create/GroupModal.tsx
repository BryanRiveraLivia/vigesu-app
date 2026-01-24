// components/GroupModal.tsx
"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { AiOutlineSave } from "react-icons/ai";
import { GroupStatusEnum } from "@/core/domain/entities/group.entity";
import { useGroupMutations } from "@/presentation/hooks/groups/useGroupMutations";

interface GroupModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editMode?: boolean;
  defaultValue?: string;
  defaultStatus?: GroupStatusEnum;
  groupIdToEdit?: number;
}

const GroupModal: React.FC<GroupModalProps> = ({
  onClose,
  onSuccess,
  editMode = false,
  defaultValue = "",
  defaultStatus = GroupStatusEnum.Active,
  groupIdToEdit,
}) => {
  const [name, setName] = useState(defaultValue);
  const [status, setStatus] = useState<GroupStatusEnum>(defaultStatus);

  const { createGroup, updateGroup, loading } = useGroupMutations();

  const handleSubmit = async () => {
    if (!name.trim()) return alert("El nombre es obligatorio");

    try {
      if (editMode && groupIdToEdit !== undefined) {
        await updateGroup(groupIdToEdit, name, status);
      } else {
        await createGroup(name);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar grupo", error);
      alert("Hubo un error al guardar el grupo");
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
              onChange={(e) =>
                setStatus(Number(e.target.value) as GroupStatusEnum)
              }
            >
              <option value={GroupStatusEnum.Active}>Activo</option>
              <option value={GroupStatusEnum.Inactive}>Inactivo</option>
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
