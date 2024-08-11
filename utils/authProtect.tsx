"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Spinner } from "@nextui-org/react";
// import Loader from "@/components/layout/Loader";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthProtect: React.FC<P> = (props) => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const { data, error } = await supabase.auth.getSession();
          setUser(data.session);
          console.log(data);
          if (!data.session) {
            router.push("/login");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      fetchData();
    }, [router]);

    if (!user)
      return (
        <div className="w-full h-screen flex justify-center items-center">
          <Spinner color="default" />
        </div>
      ); 

    return <WrappedComponent {...props} />;
  };

  return AuthProtect;
};

export default withAuth;
