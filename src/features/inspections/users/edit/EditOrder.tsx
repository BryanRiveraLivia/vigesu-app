"use client";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import AlertInfo from "@/shared/components/shared/AlertInfo";
import { UserStatusLabel } from "../../models/UsersTypes";
import SignaturePad, { SignaturePadRef } from "../../users/SignaturePad";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/shared/components/shared/Loading";
import { toast } from "sonner";
import { DOMAIN } from "@/config/constants";
import debounce from "lodash/debounce";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import { formatApiErrorForToast } from "@/shared/utils/errors";

type EmployeeOption = { id: string; name: string };

const schema = z.object({
  userName: z.string().min(1),
  password: z.string().min(1),
  employeeName: z.string().min(1), // búsqueda/visual del input
  rol: z.string().min(1),
});

const EditOrder = () => {
  const employeeId = useAuthStore((state) => state.user?.employeeId);
  const employeeName = useAuthStore((state) => state.user?.employeeName);

  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const tToasts = useTranslations("toast");
  const signatureRef = useRef<SignaturePadRef>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [modifySign, setModifySign] = useState<boolean>(false);

  const [disablePassword, setDisablePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // -------- Form --------
  const [form, setForm] = useState({
    userName: "",
    password: "",
    employeeName: "",
    rol: "",
  });

  // -------- Employee search/typeahead --------
  const [isSearchingEmp, setIsSearchingEmp] = useState(false);
  const [empResults, setEmpResults] = useState<EmployeeOption[]>([]);
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const [employeeIdSelected, setEmployeeIdSelected] = useState<string | null>(
    null
  );
  const [employeeNameSelected, setEmployeeNameSelected] = useState<
    string | null
  >(null);

  const fetchEmployees = async (term: string) => {
    try {
      setIsSearchingEmp(true);
      const { data } = await axiosInstance.get<EmployeeOption[]>(
        "/QuickBooks/employees/GetEmployeeAll"
      );
      const filtered =
        (data ?? []).filter((e) =>
          e.name.toLowerCase().includes(term.toLowerCase())
        ) ?? [];
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
      const q = term.trim();
      if (q.length >= 3) {
        fetchEmployees(q);
      } else {
        setEmpResults([]);
        setIsSearchingEmp(false);
      }
    }, 400)
  ).current;

  useEffect(() => () => debouncedSearchEmp.cancel(), [debouncedSearchEmp]);

  // -------- Fetch inicial del usuario --------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/User/GetUserId?UserId=${id}`);
        const data = res.data;

        setForm({
          userName: data.userName || "",
          password: "", // nunca mostrar password actual
          employeeName: data.employeeName || "",
          rol: data.rol?.toString() || "",
        });

        // Precargar selección de empleado (id y nombre)
        if (data.employeeId) {
          setEmployeeIdSelected(String(data.employeeId));
        }
        if (data.employeeName) {
          setEmployeeNameSelected(String(data.employeeName));
        }

        // Firma existente
        if (data.signatureImagePath) {
          setSignaturePreview(`${data.signatureImagePath}`);
        }
      } catch (error) {
        /*console.error("Error al cargar usuario:", error);
        toast.error(`${tToasts("error")}: ${error}`);*/
        const msg = formatApiErrorForToast(error);
        toast.error(msg, {
          style: { whiteSpace: "pre-line" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // -------- Submit/Update --------
  const handleUpdate = async () => {
    const validation = schema.safeParse(form);
    if (!validation.success) {
      toast.error(`${tToasts("error")}: ${tToasts("msj.11")}`);
      return;
    }

    if (!employeeIdSelected || !employeeNameSelected) {
      toast.error(`${tToasts("error")}: ${tToasts("msj.12")}`);
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("UserId", String(id));
      formData.append("UserName", form.userName);
      formData.append("Password", form.password);
      formData.append("EmployeeId", employeeIdSelected); // ✅ id seleccionado
      formData.append("EmployeeName", employeeNameSelected); // ✅ name seleccionado
      formData.append("Rol", form.rol);

      const signatureBlob = signatureRef.current?.getImageBlob();
      if (signatureBlob) {
        formData.append("SignatureImage", signatureBlob, "signature.png");
      }

      await axiosInstance.put(`/User/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${tToasts("ok")}: ${tToasts("msj.13")}`);
      router.push("../"); // vuelve al listado de usuarios de este módulo
    } catch (error) {
      /* console.error("PUT user error", error);
      toast.error(`${tToasts("error")}: ${error}`);*/
      const msg = formatApiErrorForToast(error);
      toast.error(msg, {
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <AlertInfo>Modifica los campos para actualizar al usuario.</AlertInfo>

      <fieldset className="fieldset mb-5 border-base-300 rounded-box w-full border p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className="w-[30%] text-lg font-medium">Username</span>
            <input
              type="text"
              className="flex-1 input text-lg bg-[#f6f3f4] text-center border-0"
              value={form.userName}
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
          </div>

          {/* Role */}
          <div className="flex flex-row gap-2 items-center justify-center">
            <span className="w-[30%] text-lg font-medium">Role</span>
            <select
              value={form.rol}
              className="flex-1 select input-lg bg-[#f6f3f4] text-center border-0"
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
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

        {/* Employee Name con autocomplete */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-row gap-2 items-center justify-center md:col-span-2">
            <span className="w-[30%] text-lg font-medium">Employee Name</span>
            <div className="relative flex-1 w-full">
              <input
                type="text"
                className="input border-gray-100 input-lg bg-[#f6f3f4] w-full text-left text-lg font-normal"
                value={form.employeeName}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm({ ...form, employeeName: val });
                  // si el usuario edita manualmente, invalida la selección previa
                  setEmployeeIdSelected(null);
                  setEmployeeNameSelected(null);

                  if (val.trim().length === 0) {
                    setEmpResults([]);
                    setIsSearchingEmp(false);
                    setShowEmpDropdown(false);
                    return;
                  }

                  setShowEmpDropdown(true);
                  setIsSearchingEmp(true);
                  debouncedSearchEmp(val);
                }}
                onFocus={() => {
                  if (form.employeeName.trim().length >= 3) {
                    setShowEmpDropdown(true);
                  }
                }}
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
                        onClick={() => {
                          setEmployeeIdSelected(opt.id);
                          setEmployeeNameSelected(opt.name);
                          setForm({ ...form, employeeName: opt.name });
                          setEmpResults([]);
                          setShowEmpDropdown(false);
                          setIsSearchingEmp(false);
                        }}
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
            <div className="relative flex-1 w-full">
              <input
                type={!disablePassword ? "password" : "text"}
                className="input border-gray-100 input-lg bg-[#f6f3f4] w-full text-left text-lg font-normal relative z-0"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
        <div className="flex items-center justify-between">
          <p className="font-bold">Signature</p>
          {signaturePreview && (
            <button
              className="btn"
              type="button"
              onClick={() => setModifySign(!modifySign)}
            >
              Modify sign
            </button>
          )}
        </div>

        <fieldset className="fieldset border-base-300 rounded-box w-full border mb-0 p-0">
          {!modifySign && signaturePreview && (
            <img
              src={`${DOMAIN}${signaturePreview}`}
              alt="Firma actual"
              className="max-w-full h-auto p-2"
            />
          )}
        </fieldset>

        {(modifySign || !signaturePreview) && (
          <>
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
          </>
        )}
      </div>

      <div className="flex justify-center items-center">
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="mt-8 btn bg-black text-white rounded-full pr-3 py-6 w-full md:w-[300px] mx-auto"
        >
          <span className="py-1 px-2 text-white text-[13px]">Update</span>
        </button>
      </div>
    </>
  );
};

export default EditOrder;
