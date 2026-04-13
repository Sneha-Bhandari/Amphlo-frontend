// app/(cms)/admin/components/ProtectedRoute.jsx
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../(cms)/admin/contexts/AuthContext"; // Fixed path (removed ./admin/)
import Loading from "@/Global/Loading";

export default function ProtectedRoute({ children }) {
  const { loggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !loggedIn) {
      router.replace("/cms-login");
    }
  }, [loggedIn, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return loggedIn ? children : null;
}