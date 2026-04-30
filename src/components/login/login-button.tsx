import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "@/components/login/form";
import { useLoginStore } from "@/components/login/store";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  const [open, setOpen] = useState(false);
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const logout = useLoginStore((state) => state.logout);

  if (isLoggedIn) {
    return (
      <Button
        data-testid="logout-button"
        type="button"
        variant="outline"
        className="gap-1"
        onClick={() => logout()}
      >
        Log out
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="login-button" type="button" variant="outline">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="login-dialog">
        <DialogHeader>
          <DialogTitle>Login to TestRPG</DialogTitle>
          <DialogDescription>Any combination of email and password will work</DialogDescription>
        </DialogHeader>
        <LoginForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
