"use client";

import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { isTokenExpired } from "@/core/utils/tokenHelpers";
import { performLogout } from "@/core/utils/logout";

export const useSessionValidator = () => {
  useEffect(() => {
    const token = getCookie("auth-token");
    if (typeof token === "string" && isTokenExpired(token)) {
      performLogout();
    }
  }, []);
};
