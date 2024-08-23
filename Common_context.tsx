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

/*
Previous Logout logic 
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    router.push("/");
    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }
  };

Issues found within the previous logout logic:
  - You were pushing to the home page ("/") right after calling supabase.auth.signOut() before checking if the sign-out was successful. 
    This may result in the page being redirected even if the logout fails, which might be the cause of the page flicker.
  - The user session may still exist when you push the route. Make sure the session is fully cleared before routing.
*/

/* New logout logic
  - The user session is cleared before redirecting to the login page.
  - The user is set to null after logging out.
  - Redirecting to /login after ensuring the session is cleared will prevent the flickering between /home and /login.


*/
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut(); // Clears the session
      if (error) {
        console.error("Error logging out:", error.message);
        return;
      }
      // Ensure the user session is cleared before redirecting
      setUser(null);
      // Redrecting to the login page after logout
      router.push("/login");
    } catch (err) {
      console.error("Unexpected error during logout:", err);
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
