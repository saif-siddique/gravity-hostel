"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { ContactCard } from "@/components/contact-card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import axios from "axios";
import { useEffect, useState } from "react";

const phoneRegex = /^\+?[1-9][\d\s]{1,16}$/;

export const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be greate than 3 characters")
    .max(50, "Name must be less than 50 characters"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(200, "Message must be at most 200 characters."),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(phoneRegex, {
      message:
        "Invalid phone number. Please use international format (e.g., +1234567890)",
    }),
});

export const phoneHifen = () => { };

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
      email: "",
      phone: "",
    },
  });

  //   useEffect(() => {
  //   const subscription = form.watch((value, { name, type }) => {
  //     if (name === "phone") {
  // 		if (value.phone?.toString.length === 1) {
  // 			form.setValue('phone', "+" + value.phone)
  // 		}
  // 		if (value.phone?.toString().length === 3 || value.phone?.toString().length === 6 || value.phone?.toString().length === 13) {
  // 			value.phone = value.phone.toString() + "-"
  // 			form.setValue('phone', value.phone)
  // 		}
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form.watch]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/public-question", data);

      if (!response.data.success) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response.error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative pt-20 flex size-full min-h-screen w-full items-center justify-center p-4">
      <div className="mx-auto w-full max-w-5xl">
        <ContactCard
          contactInfo={[
            {
              icon: MailIcon,
              label: "Email",
              value: "contact@21st.dev",
            },
            {
              icon: PhoneIcon,
              label: "Phone",
              value: "+92 312 1234567",
            },
            {
              icon: MapPinIcon,
              label: "Address",
              value: "Faisalabad, Pakistan",
              className: "col-span-2",
            },
          ]}
          description="If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day."
          title="Get in touch"
        >
          <form
            id="contact-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact-form-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="contact-form-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. M. Ali Khan"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact-form-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contact-form-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. ali@gmail.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact-form-phone">Phone</FieldLabel>
                    <Input
                      {...field}
                      onChange={(e) => {
                        let input = e.target.value;

                        if (input.length === 1 && input !== "+") {
                          input = "+" + input;
                        }

                        const raw = input.replace(/[^\d+]/g, "");

                        let formatted = raw;

                        if (raw.length > 3) {
                          formatted = raw.slice(0, 3) + " " + raw.slice(3);
                        }

                        if (raw.length > 6) {
                          formatted =
                            formatted.slice(0, 7) + " " + formatted.slice(7);
                        }

                        field.onChange(formatted);
                      }}
                      id="contact-form-phone"
                      placeholder="+XX XXX XXXXXXX"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="message"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contact-form-message">
                      Message
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="contact-form-message"
                      aria-invalid={fieldState.invalid}
                      placeholder=""
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button disabled={isSubmitting} className="w-full" type="submit">
                {isSubmitting && <Loader2 className="animate-spin" />}Submit
              </Button>
            </FieldGroup>
          </form>
        </ContactCard>
      </div>
    </div>
  );
}
