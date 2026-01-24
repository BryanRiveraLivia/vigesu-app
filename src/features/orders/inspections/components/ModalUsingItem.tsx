"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { AiOutlineSave } from "react-icons/ai";
import ActionButton from "@/presentation/components/shared/tableButtons/ActionButton";
import { IoMdClose } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { axiosInstance } from "@/core/utils/axiosInstance";
import debounce from "lodash/debounce";
import Loading from "@/presentation/components/shared/Loading";
import { useTranslations } from "next-intl";
import { ModalUsingItemProps, ItemOption } from "./ModalUsingItem.types";

const ModalUsingItem = ({
  onClose,
  onSave,
  initialItems,
}: ModalUsingItemProps) => {
  const t = useTranslations("inspections");
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ItemOption[]>([]);
  const [selectedItems, setSelectedItems] = useState<ItemOption[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemOption | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debouncedFetch = useRef(
    debounce(async (term: string) => {
      const q = term.trim();
      if (q.length < 3) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      try {
        setIsSearching(true);
        const res = await axiosInstance.get<ItemOption[]>(
          "/QuickBooks/Items/GetItemName",
        );
        const filtered = (res.data ?? []).filter((item) =>
          item.name.toLowerCase().includes(q.toLowerCase()),
        );
        setResults(filtered);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500),
  ).current;

  const handleAddItem = () => {
    if (selectedItem && quantity > 0) {
      setSelectedItems((prev) => [
        ...prev,
        { ...selectedItem, quantity, _uid: uuidv4() },
      ]);
      setSelectedItem(null);
      setQuery("");
      setQuantity(1);
      setResults([]);
    }
  };

  const handleDeleteItem = (uid: string) => {
    setSelectedItems((prev) => prev.filter((i) => i._uid !== uid));
  };

  useEffect(() => {
    const itemsWithUid = (initialItems ?? []).map((item) => ({
      ...item,
      _uid: item._uid ?? uuidv4(),
    }));
    setSelectedItems(itemsWithUid);
  }, [initialItems]);

  useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

  return (
    <dialog open className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="mb-3 flex flex-row gap-4 items-center justify-center">
          <div className="flex flex-col flex-1">
            <legend className="fieldset-legend text-lg font-normal">
              {t("step4.1")}
            </legend>
            <div className="relative">
              <input
                type="text"
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuery(value);
                  setSelectedItem(null);
                  const q = value.trim();
                  if (q.length === 0) {
                    setResults([]);
                    setIsSearching(false);
                    return;
                  }
                  setIsSearching(true);
                  debouncedFetch(q);
                }}
                className="input input-lg text-lg w-full"
                autoComplete="off"
              />
              {results.length > 0 && (
                <ul className="bg-base-100 w-full rounded-box shadow-md z-50 max-h-60 overflow-y-auto absolute mt-1">
                  {results.map((item) => (
                    <li
                      key={item.id}
                      className="cursor-pointer text-sm block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        debouncedFetch.cancel();
                        setIsSearching(false);
                        setSelectedItem(item);
                        setQuery(item.name);
                        setResults([]);
                        setQuantity(1);
                      }}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                  <Loading enableLabel={false} size="loading-sm " />
                </div>
              )}
            </div>
          </div>
          <div className="max-w-[100px]">
            <legend className="fieldset-legend text-lg font-normal">
              {t("step4.2")}
            </legend>
            <input
              type="number"
              className="input input-lg text-lg w-full text-center"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="mt-6">
            <button
              type="button"
              className="btn bg-black text-white rounded-full font-bold text-2xl"
              onClick={handleAddItem}
              disabled={!selectedItem}
            >
              <FiPlus />
            </button>
          </div>
        </div>

        <div className="mb-3 mt-5">
          <table className="table table-fixed w-full">
            <thead>
              <tr>
                <th className="w-[40%] text-center truncate">{t("step4.3")}</th>
                <th className="w-[40%] text-center truncate">{t("step4.4")}</th>
                <th className="w-[20%] text-center truncate"></th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item._uid} className="odd:bg-base-200">
                  <td className="text-center">{item.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">
                    <ActionButton
                      icon={
                        <FiTrash2 className="w-[20px] h-[20px] opacity-70" />
                      }
                      label={t("step4.7")}
                      onClick={() => handleDeleteItem(item._uid!)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-action flex items-center justify-between">
          <button type="button" className="btn" onClick={onClose}>
            <IoMdClose className="w-[20px] h-[20px] opacity-70" />{" "}
            {t("step4.5")}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onSave(selectedItems)}
          >
            <AiOutlineSave className="w-[20px] h-[20px] opacity-70" />
            {t("step4.6")}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalUsingItem;
