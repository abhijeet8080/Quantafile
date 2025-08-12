import { api } from "@/lib/axios";
import { getUserDetails } from "@/services/userServices";
import { RootState } from "@/store";
import { login, logout, rehydrate } from "@/store/slices/authSlice";
import { User } from "@/types/user";
import { ParamValue } from "next/dist/server/request/params";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useGetUserDetails(id: ParamValue, token:string|null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserDetails(id,token)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Failed to fetch user details", err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [id,token]);

  return { user, loading,setUser };
}

export function useRequireAuth() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  return { isAuthenticated, showModal, setShowModal };
}




export function useAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrate());

    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          dispatch(logout());
          return;
        }

        // Make sure the URL matches your backend route prefix for this endpoint
        const res = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Axios stores response data in res.data, no need for res.json()
        const userData = res.data; // Your backend sends user fields at root, not wrapped in 'user'

        dispatch(login({ user: userData, token }));
      } catch (error) {
        console.error("User fetch failed:", error);
        dispatch(logout());
      }
    }

    fetchUser();
  }, [dispatch]);
}
