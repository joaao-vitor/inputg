import { Button } from "@/components/ui/button";
import { Field, FieldSeparator } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";

export const SocialAuth = () => {
  const signUpSocial = async (provider: "google") => {
    await authClient.signIn.social({
      provider,
    });
  };
  return (
    <>
      <FieldSeparator />
      <Field orientation={"vertical"}>
        <Button
          type="button"
          variant={"secondary"}
          size={"lg"}
          onClick={() => signUpSocial("google")}
        >
          <FaGoogle />
          Continue with Google
        </Button>
      </Field>
    </>
  );
};
