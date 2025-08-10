import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginPromptModalProps {
  isOpen: boolean;
}

export default function LoginPromptModal({ isOpen }: LoginPromptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
     
    >
      <Card
        className="max-w-sm w-full"
       
      >
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            You need to be logged in to perform this action.
          </p>
          <div className="flex justify-end gap-4">
            {/* Removed Cancel button */}
            <Button onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
