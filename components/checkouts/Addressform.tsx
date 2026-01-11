/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { INDIAN_STATES } from "@/app/context/state"; // Tera path

export function AddressForm() {
  const { register, control, formState: { errors } } = useFormContext();

  // Address Array Control
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const inputClass = (name: string) =>
    `rounded-xl ${errors[name] ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200"}`;

  return (
    <div className="space-y-4">
      {/* 1. Name Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>First Name*</Label>
          <Input {...register("firstName")} className={inputClass("firstName")} placeholder="John" />
          {errors.firstName && <p className="text-[10px] text-red-500">{errors.firstName.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label>Last Name*</Label>
          <Input {...register("lastName")} className={inputClass("lastName")} placeholder="Doe" />
          {errors.lastName && <p className="text-[10px] text-red-500">{errors.lastName.message as string}</p>}
        </div>
      </div>

      {/* 2. Gender Section */}
      <div className="space-y-1">
        <Label>Gender*</Label>
        <select
          {...register("gender")}
          className={`w-full h-10 px-3 py-2 rounded-xl border-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.gender ? "border-red-500" : "border-gray-200"
          }`}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="text-[10px] text-red-500">{errors.gender.message as string}</p>}
      </div>

      {/* 3. DYNAMIC ADDRESS SECTION */}
      <div className="space-y-3">
        <Label className="font-bold flex items-center gap-2 text-orange-600">
          Delivery Addresses (Max 2)
        </Label>
        
        {fields.map((field, index) => (
          <div key={field.id} className="group relative animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  {...register(`addresses.${index}.addressLine` as const)}
                  placeholder={`Address Line ${index + 1} (Flat, Street, Landmark)`}
                  className="rounded-xl border-gray-200"
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 size={18} />
                </Button>
              )}
            </div>
            {/* Error Message for specific address line */}
            {(errors.addresses as any)?.[index]?.addressLine && (
              <p className="text-[10px] text-red-500 mt-1">
                {(errors.addresses as any)[index].addressLine.message}
              </p>
            )}
          </div>
        ))}

        {fields.length < 2 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ addressLine: "" })}
            className="w-full border-dashed border-2 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl"
          >
            <Plus size={16} className="mr-2" /> Add Secondary Address (Optional)
          </Button>
        )}
      </div>

      {/* 4. State, City, Pin Section */}
      <div className="space-y-1">
        <Label>State*</Label>
        <select
          {...register("state")}
          className={`w-full h-10 px-3 py-2 rounded-xl border-2 bg-white text-sm focus:ring-2 focus:ring-orange-500 ${
            errors.state ? "border-red-500" : "border-gray-200"
          }`}
        >
          <option value="">Select State</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        {errors.state && <p className="text-[10px] text-red-500">{errors.state.message as string}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>City*</Label>
          <Input {...register("city")} className={inputClass("city")} placeholder="Mumbai" />
          {errors.city && <p className="text-[10px] text-red-500">{errors.city.message as string}</p>}
        </div>
        <div className="space-y-1">
          <Label>Pin Code*</Label>
          <Input {...register("pinCode")} className={inputClass("pinCode")} placeholder="400001" />
          {errors.pinCode && <p className="text-[10px] text-red-500">{errors.pinCode.message as string}</p>}
        </div>
      </div>

      {/* 5. Phone Section */}
      <div className="space-y-1">
        <Label>Phone*</Label>
        <Input {...register("phone")} type="tel" className={inputClass("phone")} placeholder="9876543210" />
        {errors.phone && <p className="text-[10px] text-red-500">{errors.phone.message as string}</p>}
      </div>
    </div>
  );
}