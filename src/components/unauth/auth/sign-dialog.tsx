"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";
import { authClient } from "@/lib/auth-client";

export enum SignTypes {
  SIGNIN,
  SIGNUP,
}

export const SignDialog = ({
  open,
  onOpenChange,
  signType,
  onSignTypeChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signType: SignTypes;
  onSignTypeChange: (signType: SignTypes) => void;
}) => {
  const { data: session } = authClient.useSession();
  if (session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"p-8"}>
        <DialogHeader>
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl font-semibold">
              Welcome to{" "}
              <span className="font-bold">
                Input<span className="text-emerald-600">G</span>
              </span>
              !
            </h1>
            <h2 className="text-sm text-muted-foreground text-center">
              Insert your credentials below to access your account.
            </h2>
          </div>
        </DialogHeader>
        {signType === SignTypes.SIGNIN ? (
          <SignInForm
            changeSignType={onSignTypeChange}
            onSuccess={() => onOpenChange(false)}
          />
        ) : (
          <SignUpForm
            changeSignType={onSignTypeChange}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
