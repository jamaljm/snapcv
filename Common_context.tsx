"use client";
import { supabase } from "@/utils/supabase/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CommonContextType {
  setPage: (page: string) => void;
  setChange: (change: string) => void;
  logout: () => void;
  userData: any;
  page: string;
}

export const CommonContext = createContext<CommonContextType>({
  setPage: () => {},
  setChange: () => {},
  logout: () => {},
  userData: null,
  page: "",
});

export function useCommonContext() {
  const commonData = useContext(CommonContext);

  if (commonData === undefined) {
    throw new Error(
      "useCommonContext must be used with a CommonContextProvider"
    );
  }

  return commonData;
}

export function CommonContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [Current_page, setCurrent_page] = useState<string>("Home");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        setUser(data.session);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const setPage = (page: string) => {
    setCurrent_page(page);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    router.push("/");
    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }
  };

  const setChange = (change: string) => {
    // Implement your setChange logic here
  };

  return (
    <CommonContext.Provider
      value={{
        setPage,
        setChange,
        logout,
        userData: user,
        page: Current_page,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
}
