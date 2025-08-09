"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { verifyEmailWithToken } from "@/lib/api/auth";
export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const dispatch = useDispatch();

  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await verifyEmailWithToken(token);

        toast.success("Email verified successfully!");
        setStatus("success");

        dispatch(
          login({
            user: res.data.user,
            token: res.data.token,
          })
        );

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } catch (err: unknown) {
        if (err && typeof err === "object" && "response" in err) {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || "Something went wrong");
        } else {
          toast.error("Unexpected error occurred");
        }
      }
    };

    verifyEmail();
  }, [token, router, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "pending" && (
            <>
              <Loader2
                className="mx-auto animate-spin text-muted-foreground"
                size={32}
              />
              <p className="text-muted-foreground">Verifying your email...</p>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 className="mx-auto text-green-500" size={32} />
              <p className="text-green-600">
                Email verified! Redirecting to home...
              </p>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="mx-auto text-red-500" size={32} />
              <p className="text-red-600">
                Verification failed. The token may be invalid or expired.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
