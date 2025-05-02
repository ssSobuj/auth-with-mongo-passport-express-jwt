"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Link from "next/link";
import Swal from "sweetalert2";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email...");
  const hasVerified = useRef(false); // Track if verification has been attempted

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasVerified.current) return; // Skip if already verified
      hasVerified.current = true; // Mark as verified

      try {
        const response = await axios.get(`/auth/verify-email?token=${token}`);
        if (response.status === 200) {
          setStatus("success");
          setMessage("Email verified successfully!");

          // Show success alert
          await Swal.fire({
            title: "Success!",
            text: "Your email has been verified successfully.",
            icon: "success",
            confirmButtonText: "Go to Login",
            timer: 3000,
            timerProgressBar: true,
          });
          router.push("/login");
        }
      } catch (error) {
        setStatus("error");
        const errorMessage =
          error.response?.data?.error ||
          "Verification failed. The link may be invalid or expired.";
        setMessage(errorMessage);

        // Show error alert
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    if (token && !hasVerified.current) {
      verifyEmail();
    } else if (!token) {
      setStatus("error");
      const noTokenMessage = "No verification token provided.";
      setMessage(noTokenMessage);

      Swal.fire({
        title: "Error!",
        text: noTokenMessage,
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    // Cleanup function
    return () => {
      // You can add cleanup logic here if needed
    };
  }, [token, router]);

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
            {status === "success" && (
              <p className="mt-2 text-sm">Redirecting to login page...</p>
            )}
          </div>

          {status === "success" && (
            <div className="text-center">
              <Link
                href="/login"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Login Now
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Logging In
              </Link>
              <Link
                href="/register"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
