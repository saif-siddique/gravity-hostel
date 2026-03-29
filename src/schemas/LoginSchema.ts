import { z } from 'zod'

export const LoginSchema = z.object({
    email: z.email({message: "Please enter a valid email"}),
    password: z
    .string({message: "Password must be a string"})
    .min(3, "Please enter complete password")
    .max(50, "Password is too long")
    
})