"use client";
import React, { useRef, useState, useEffect } from "react";
import { z } from "zod";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import AlertInfo from "@/shared/components/shared/AlertInfo";
import { UserStatusLabel } from "../../models/UsersTypes";
import SignaturePad, { SignaturePadRef } from "../SignaturePad";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import Loading from "@/shared/components/shared/Loading";
import { useTranslations } from "next-intl";
import { formatApiErrorForToast } from "@/shared/utils/errors";
// Opcional si alguna vez quieres precargar algo del usuario logueado
// import { useAuthStore } from "@/shared/stores/useAuthStore";

type EmployeeOption = { id: string; name: string };

const schema = z.object({
  userName: z.string().min(1),
  password: z.string().min(1),
  employeeName: z.string().min(1),
  rol: z.string().min(1),
});

const CreateOrder = () => {
  const router = useRouter();
  const tToasts = useTranslations("toast");
  const signatureRef = useRef<SignaturePadRef>(null);

  const [disablePassword, setDisablePassword] = useState(false);

  const [objFilterForm, setObjFilterForm] = useState({
    userName: "",
    password: "",
    employeeName: "",
    rol: "",
  });

  const [isSearchingEmp, setIsSearchingEmp] = useState(false);
  const [empResults, setEmpResults] = useState<EmployeeOption[]>([]);
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeOption | null>(null);

  // --- Búsqueda ---
  const fetchEmployees = async (term: string) => {
    try {
      setIsSearchingEmp(true);
      const { data } = await axiosInstance.get<EmployeeOption[]>(
        "/QuickBooks/employees/GetEmployeeAll"
      );
      const base: EmployeeOption[] = Array.isArray(data) ? data : [];
      const filtered = base.filter((e) =>
        e.name.toLowerCase().includes(term.toLowerCase())
      );
      setEmpResults(filtered);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmpResults([]);
    } finally {
      setIsSearchingEmp(false);
    }
  };

  const debouncedSearchEmp = useRef(
    debounce((term: string) => {
      if (term.trim().length >= 3) {
        fetchEmployees(term.trim());
      } else {
        setEmpResults([]);
        setIsSearchingEmp(false);
      }
    }, 400)
  ).current;

  useEffect(() => () => debouncedSearchEmp.cancel(), [debouncedSearchEmp]);

  // --- Handlers ---
  const handleChangeEmployeeName: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const val = e.target.value;
    setObjFilterForm((prev) => ({ ...prev, employeeName: val }));

    // Solo limpiar selección si el texto difiere de la selección actual
    if (selectedEmployee && val.trim() !== selectedEmployee.name) {
      setSelectedEmployee(null);
    }

    if (val.trim().length === 0) {
      setEmpResults([]);
      setIsSearchingEmp(false);
      setShowEmpDropdown(false);
      return;
    }

    setShowEmpDropdown(true);
    setIsSearchingEmp(true);
    debouncedSearchEmp(val);
  };

  const handlePickEmployee = (opt: EmployeeOption) => {
    setSelectedEmployee(opt);
    setObjFilterForm((prev) => ({ ...prev, employeeName: opt.name }));
    setEmpResults([]);
    setShowEmpDropdown(false);
    setIsSearchingEmp(false);
  };

  const handleEmployeeInputKeyDown: React.KeyboardEventHandler<
    HTMLInputElement
  > = (e) => {
    if (e.key === "Enter") {
      // Si hay un único match visible, selecciónalo con Enter
      if (empResults.length === 1) {
        e.preventDefault();
        handlePickEmployee(empResults[0]);
      }
    }
  };

  const handleSubmit = async () => {
    const validation = schema.safeParse(objFilterForm);
    const signatureBlob = signatureRef.current?.getImageBlob();
    debugger;
    if (!validation.success) {
      toast.error(`${tToasts("error")}: ${tToasts("msj.7")}`);
      return;
    }

    // Validar que exista selección efectiva
    if (!selectedEmployee) {
      toast.error(`${tToasts("error")}: ${tToasts("msj.8")}`);
      return;
    }

    if (!signatureBlob) {
      toast.error(`${tToasts("error")}: ${tToasts("msj.9")}`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("UserName", objFilterForm.userName);
      formData.append("Password", objFilterForm.password);
      formData.append("EmployeeId", selectedEmployee.id);
      formData.append("EmployeeName", selectedEmployee.name);
      formData.append("Rol", objFilterForm.rol);
      formData.append("SignatureImage", signatureBlob, "signature.png");

      await axiosInstance.post("/User", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${tToasts("ok")}: ${tToasts("msj.10")}`);
      router.push("./");
    } catch (error) {
      /*console.error(error);
      toast.error(`${tToasts("error")}: ${String(error)}`);*/
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    }
  };

  return (
    <>
      <AlertInfo>
        All the grey spaces are editable, meaning you can write on them and add
        the required data.
      </AlertInfo>

      <fieldset className="fieldset mb-5 border-base-300 rounded-box w-full border p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className="w-[30%] text-lg font-medium">Username</span>
            <input
              type="text"
              className="input border-gray-100 input-lg bg-[#f6f3f4] w-full text-left text-lg font-normal"
              value={objFilterForm.userName}
              onChange={(e) =>
                setObjFilterForm({ ...objFilterForm, userName: e.target.value })
              }
            />
          </div>

          {/* Role */}
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className="w-[30%] text-lg font-medium">Role</span>
            <select
              value={objFilterForm.rol}
              className="select text-lg bg-[#f6f3f4] text-center border-0 input-lg w-full"
              onChange={(e) =>
                setObjFilterForm({ ...objFilterForm, rol: e.target.value })
              }
            >
              <option disabled value="">
                Pick a role
              </option>
              {Object.entries(UserStatusLabel).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Name (buscador con dropdown) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-row gap-2 items-center justify-center md:col-span-2">
            <span className="w-[30%] text-lg font-medium">Employee Name</span>
            <div className="relative flex w-full">
              <input
                type="text"
                className="input border-gray-100 input-lg bg-[#f6f3f4] w-full text-left text-lg font-normal"
                value={objFilterForm.employeeName}
                onChange={handleChangeEmployeeName}
                onFocus={() => {
                  if (objFilterForm.employeeName.trim().length >= 3) {
                    setShowEmpDropdown(true);
                  }
                }}
                onKeyDown={handleEmployeeInputKeyDown}
                autoComplete="off"
              />

              {/* Dropdown resultados */}
              {showEmpDropdown && empResults.length > 0 && (
                <ul className="bg-base-100 w-full rounded-box shadow-md z-50 max-h-60 overflow-y-auto absolute mt-1">
                  {empResults.map((opt) => (
                    <li key={opt.id} className="cursor-pointer text-sm">
                      <button
                        type="button"
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handlePickEmployee(opt)}
                      >
                        {opt.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Loader */}
              {isSearchingEmp && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                  <Loading enableLabel={false} size="loading-sm " />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-row gap-2 items-center justify-center md:col-span-2">
            <span className="w-[30%] text-lg font-medium">Password</span>
            <div className="relative flex w-full">
              <input
                type={!disablePassword ? "password" : "text"}
                className="input border-gray-100 input-lg bg-[#f6f3f4] w-full text-left text-lg font-normal relative z-0"
                value={objFilterForm.password}
                onChange={(e) =>
                  setObjFilterForm({
                    ...objFilterForm,
                    password: e.target.value,
                  })
                }
              />
              {disablePassword ? (
                <IoEyeOutline
                  onClick={() => setDisablePassword(false)}
                  className="absolute right-0 top-1/4 mr-3 cursor-pointer size-7 text-gray-400 hover:text-gray-700 z-10"
                />
              ) : (
                <IoEyeOffOutline
                  onClick={() => setDisablePassword(true)}
                  className="absolute right-0 top-1/4 mr-3 cursor-pointer size-7 text-gray-400 hover:text-gray-700 z-10"
                />
              )}
            </div>
          </div>
        </div>
      </fieldset>

      {/* Firma */}
      <div className="flex flex-col gap-2">
        <p className="font-bold">Signature</p>
        <fieldset className="fieldset border-base-300 rounded-box w-full border mb-0 p-0">
          <SignaturePad ref={signatureRef} />
        </fieldset>
        <button
          className="btn"
          type="button"
          onClick={() => signatureRef.current?.clear()}
        >
          Limpiar firma
        </button>
      </div>

      <div className="flex items-center">
        <button
          onClick={handleSubmit}
          className=" mt-8 btn bg-black text-white rounded-full pr-3 py-6 w-full md:w-[300px] mx-auto"
          type="button"
        >
          <span className="py-1 px-2 text-white font-normal rounded-full md:block text-[13px]">
            Save
          </span>
        </button>
      </div>
    </>
  );
};

export default CreateOrder;
