import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { username } from "better-auth/plugins";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  plugins: [username()],

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!user.username && user.email) {
            const prefix = user.email.split("@")[0];
            const suffix = Math.floor(Math.random() * 1000).toString();
            const username = `${prefix}${suffix}`;

            return {
              data: {
                ...user,
                username,
              },
            };
          }
          return { data: user };
        },
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log("Sending verification email to:", user.email);
      try {
        const response = await resend.emails.send({
          to: user.email,
          from: "Acme <onboarding@resend.dev>",
          subject: "[INPUTG] Verify your email address",
          html: `<p>Click the link below to verify your email address:</p><p><a href="${url}">${url}</a></p>`,
        });
        console.log(response);
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
