/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";
import { INDIAN_STATES } from "@/app/context/state";

export const orderSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  
  // Ekdum simple tarika: Enum values pehle, fir error message
 gender: z.enum(["Male", "Female", "Other"], {
  message: "Please select a valid gender",
}),

  // Multiple Addresses (Min 1, Max 2)
  addresses: z.array(
    z.object({
      addressLine: z.string().min(5, "Full address is required"),
    })
  ).min(1, "At least one address is required").max(2, "You can add up to 2 addresses"),

  city: z.string().min(2, "City is required"),
  
  // State validation
  state: z.string().refine((val) => INDIAN_STATES.includes(val as any), {
    message: "Please select a valid state",
  }),

  pinCode: z.string().length(6, "Pin Code must be 6 digits"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
});

export type OrderFormData = z.infer<typeof orderSchema>;