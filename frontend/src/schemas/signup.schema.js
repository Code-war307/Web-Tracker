import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters"),

    email: z
      .string()
      .regex(emailRegex, "Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
