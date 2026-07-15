import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Lock, Mail } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { SocialAuth } from "./social-auth";
import { Spinner } from "@/components/ui/spinner";
import { SignTypes, useAuthDialogStore } from "@/store/useAuthDialogStore";

export const SignUpForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { onSignTypeChange } = useAuthDialogStore();

  const schema = z
    .object({
      username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" }),
      email: z.email({ message: "Insert a valid email address" }),
      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          {
            message:
              "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
          },
        ),
      confirmPassword: z
        .string()
        .min(1, { message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const { username, email, password } = data;
    const { data: response, error } = await authClient.signUp.email({
      email,
      password,
      name: username,
      username,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (response) {
      toast.success(
        "Account created successfully. Please check your email to verify your account.",
      );
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={"username"}
                    aria-invalid={fieldState.invalid}
                    placeholder="Your username"
                  />
                  <InputGroupAddon>
                    <AtSign />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={"email"}
                    aria-invalid={fieldState.invalid}
                    placeholder="you@example.com"
                  />
                  <InputGroupAddon>
                    <Mail />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={"password"}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Insert your password"
                  />
                  <InputGroupAddon>
                    <Lock />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={"confirmPassword"}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm your password"
                  />
                  <InputGroupAddon>
                    <Lock />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Field orientation={"vertical"}>
          <Button type="submit" size={"lg"} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <Button
            type="button"
            variant={"link"}
            size={"lg"}
            onClick={() => onSignTypeChange(SignTypes.SIGNIN)}
          >
            Already have an account? Sign in
          </Button>
        </Field>
        <SocialAuth />
      </FieldGroup>
    </form>
  );
};
