import { lte, z } from "zod";

export const StudentSignupSchema = z
  .object({
    studentDetail: z.object({
      studentName: z
        .string({ message: "Student name is required field" })
        .min(3, { message: "Student name must be at least 3 characters" })
        .max(40, { message: "Student name must be less than 40 characters" }),
      studentcnic: z
        .string()
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => val.length === 13, {
          message: "CNIC must be exactly 13 digits.",
        })
        .refine((val) => /^\d+$/.test(val), {
          message: "CNIC must contain only digits.",
        }),
      studentPhoneNO: z
        .string()
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => val.length === 11, {
          message: "Phone number must be exactly 11 digits.",
        })
        .refine((val) => /^\d+$/.test(val), {
          message: "Phone number must contain only digits.",
        }),
      studentEmail: z
        .string()
        .transform((val) => {
          // Auto-append .com if not present
          if (val && !val.endsWith(".com")) {
            return val + ".com";
          }
          return val;
        })
        .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
          message: "Invalid email address.",
        }),
    }),
    guardianDetail: z.object({
      guardianName: z
        .string({ message: "Guardian name is required field" })
        .min(3, { message: "Guardian name must be at least 3 characters" })
        .max(40, { message: "Guardian name must be less than 40 characters" }),
      guardianPhoneNO: z
        .string()
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => val.length === 11, {
          message: "Phone number must be exactly 11 digits.",
        })
        .refine((val) => /^\d+$/.test(val), {
          message: "Phone number must contain only digits.",
        }),
      address: z
        .string({ message: "Address is required field" })
        .max(50, { message: "Address must be less than 50 characters" }),
    }),
    loginCredientials: z.object({
      password: z
        .string({ message: "Password is required field" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(100, {
          message: "Password must be less than 100 characters long.",
        }),
      roomNumber: z
        .string({ message: "Room number is required field." }),
      type: z.enum(["standard", "deluxe", "suite"], {
        message: "Type is not valide",
      }),
      capacity: z
        .number({ message: "Capacity is required field" }),
      price: z
        .number({ message: "Price is required field" })
        .min(10, { message: "Price must be at least 10." }),
      roomid: z
        .string({ message: "Room ID is required field" }),
    }),
    confirmPassword: z.string({
      message: "Confirm Password is required field",
    }),
  })
  .refine((data) => data.loginCredientials.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type StudentSignupType = z.infer<typeof StudentSignupSchema>;
