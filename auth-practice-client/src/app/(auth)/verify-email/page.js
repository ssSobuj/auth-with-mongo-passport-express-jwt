import { Suspense } from "react";
import GuestRoute from "@/components/GuestRoute";
import VerifyEmailContent from "@/components/VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <GuestRoute redirectPath="/dashboard">
      <Suspense fallback={<div>Loading verification...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </GuestRoute>
  );
}
