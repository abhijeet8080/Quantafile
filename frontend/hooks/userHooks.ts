import { getUserDetails } from "@/lib/api/auth";
import { User } from "@/types/user";
import { ParamValue } from "next/dist/server/request/params";
import { useEffect, useState } from "react";

export function useGetUserDetails(id: ParamValue) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserDetails(id)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Failed to fetch user details", err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { user, loading,setUser };
}