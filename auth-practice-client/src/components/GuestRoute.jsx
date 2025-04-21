// components/GuestRoute.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ children, redirectPath = "" }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.back();
      }
    }
  }, [user, loading, router, redirectPath]);

  if (loading || user) {
    return <div>Loading...</div>;
  }

  return children;
}
