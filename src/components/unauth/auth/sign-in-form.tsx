"use client";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignTypes } from "./sign-dialog";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { SocialAuth } from "./social-auth";
import { Spinner } from "@/components/ui/spinner";

export const SignInForm = ({
  changeSignType,
  onSuccess,
}: {
  changeSignType: (signType: SignTypes) => void;
  onSuccess: () => void;
}) => {
  const schema = z.object({
    email: z.email({ message: "Insert a valid email address" }),
    password: z.string(),
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (isSubmitting) return;

    const { email, password } = data;
    const { data: response, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    }

    if (response) {
      toast.success("Signed in successfully");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@example.com"
                />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Insert your password"
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation={"vertical"}>
          <Button
            type="submit"
            variant={"default"}
            size={"lg"}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <Button
            type="button"
            variant={"link"}
            size={"lg"}
            className={"font-light"}
            onClick={() => changeSignType(SignTypes.SIGNUP)}
          >
            Create a new account
          </Button>
        </Field>
        <SocialAuth />
      </FieldGroup>
    </form>
  );
};
