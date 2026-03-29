import { z } from "zod";

export const RegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(50, "Full name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

    email: z
      .string()
      .email("Invalid email address"),

    password: z
      .string()
      .min(3, "Password must be at least 8 characters")
      .max(64, "Password must be less than 64 characters"),
    //   .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    //   .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    //   .regex(/[0-9]/, "Password must contain at least one number")
    //   .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),


  })
