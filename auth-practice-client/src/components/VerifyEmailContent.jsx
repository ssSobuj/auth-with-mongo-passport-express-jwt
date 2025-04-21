"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import Link from "next/link";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/auth/verify-email?token=${token}`);
        if (response.status === 200) {
          setStatus("success");
          setMessage("Email verified successfully! You can now log in.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.error ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("No verification token provided.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <div
            className={`p-4 rounded-md ${
              status === "verifying"
                ? "bg-blue-50 text-blue-800"
                : status === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <p>{message}</p>
          </div>

          {status === "success" && (
            <div className="text-center">
              <Link
                href="/login"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <Link
                href="/register"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register Again
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
