'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/Global/Loading";

export default function ProtectedRoute({ children }) {
  const { loggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !loggedIn) {
      router.replace("/cms-login");
    }
  }, [loggedIn, loading]);

  if (loading) return <Loading />;

  return loggedIn ? children : null;
}