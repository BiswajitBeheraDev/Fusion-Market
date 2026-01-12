/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { INDIAN_STATES } from "@/app/context/state"; 

export function AddressForm() {
  // Yahan 'watch' ko add kiya hai context se
  const { register, control, watch, formState: { errors } } = useFormContext();

  // Gender value ko track karne ke liye
  const selectedGender = watch("gender");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const inputClass = (name: string) =>
    `rounded-xl ${errors[name] ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 shadow-sm"}`;

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* 1. Name Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">First Name*</Label>
          <Input {...register("firstName")} className={inputClass("firstName")} placeholder="First Name" />
          {errors.firstName && <p className="text-[10px] text-red-500 font-bold">{errors.firstName.message as string}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Last Name*</Label>
          <Input {...register("lastName")} className={inputClass("lastName")} placeholder="Last Name" />
          {errors.lastName && <p className="text-[10px] text-red-500 font-bold">{errors.lastName.message as string}</p>}
        </div>
      </div>

      {/* 2. Gender Section (Fixed with watch) */}
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Gender*</Label>
        <div className="flex gap-3">
          {["Male", "Female", "Other"].map((option) => (
            <label 
              key={option} 
              className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 font-bold text-sm
                ${selectedGender === option 
                  ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm" 
                  : "border-gray-100 bg-white text-gray-500 hover:border-orange-200"
                }`}
            >
              <input
                {...register("gender")}
                type="radio"
                value={option}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.gender && <p className="text-[10px] text-red-500 font-bold">{errors.gender.message as string}</p>}
      </div>

      {/* 3. DYNAMIC ADDRESS SECTION */}
      <div className="space-y-3 pt-2">
        <Label className="text-[10px] font-black uppercase text-orange-600 ml-1 flex items-center gap-2">
          Delivery Addresses (Max 2)
        </Label>
        
        {fields.map((field, index) => (
          <div key={field.id} className="group relative animate-in slide-in-from-left-2 duration-300">
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  {...register(`addresses.${index}.addressLine` as const)}
                  placeholder={`Address Line ${index + 1}`}
                  className="rounded-xl border-gray-200 shadow-sm italic text-sm"
                />
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:bg-red-50 rounded-xl shrink-0"
                >
                  <Trash2 size={18} />
                </Button>
              )}
            </div>
            {(errors.addresses as any)?.[index]?.addressLine && (
              <p className="text-[10px] text-red-500 mt-1 font-bold">
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
            className="w-full border-dashed border-2 border-orange-200 text-orange-600 hover:bg-orange-50 rounded-xl font-bold py-5"
          >
            <Plus size={16} className="mr-2" /> Add Secondary Address
          </Button>
        )}
      </div>

      {/* 4. State, City, Pin Section */}
      <div className="space-y-1.5">
        <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">State*</Label>
        <select
          {...register("state")}
          className={`w-full h-11 px-3 py-2 rounded-xl border-2 bg-white text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all ${
            errors.state ? "border-red-500" : "border-gray-200 shadow-sm"
          }`}
        >
          <option value="">Select State</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        {errors.state && <p className="text-[10px] text-red-500 font-bold">{errors.state.message as string}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">City*</Label>
          <Input {...register("city")} className={inputClass("city")} placeholder="City" />
          {errors.city && <p className="text-[10px] text-red-500 font-bold">{errors.city.message as string}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Pin Code*</Label>
          <Input {...register("pinCode")} className={inputClass("pinCode")} placeholder="Pin Code" />
          {errors.pinCode && <p className="text-[10px] text-red-500 font-bold">{errors.pinCode.message as string}</p>}
        </div>
      </div>

      {/* 5. Phone Section */}
      <div className="space-y-1.5">
        <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Phone*</Label>
        <Input {...register("phone")} type="tel" className={inputClass("phone")} placeholder="Phone Number" />
        {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone.message as string}</p>}
      </div>
    </div>
  );
}