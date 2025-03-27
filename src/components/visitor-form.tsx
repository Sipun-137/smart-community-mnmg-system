"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { AddVisitor } from "@/services/VisitorService";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  apartmentNo: z.string().min(1, {
    message: "Apartment number is required.",
  }),
  visitReason: z.string().min(5, {
    message: "Visit reason must be at least 5 characters.",
  }),
  visitDate: z.date({
    required_error: "Visit date is required.",
  }),
});

export function VisitorForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      apartmentNo: "",
      visitReason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      // Convert the date to ISO string format
      const formattedValues = {
        ...values,
        visitDate: values.visitDate.toISOString(),
      };

      await AddVisitor(formattedValues);
      toast.success(
        "The visitor has been registered for the specified date and time."
      );

      router.push("/dashboard/resident/visitor");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "There was an error registering the visitor. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Enter the visitor&apos;s full name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="8547962385" {...field} />
              </FormControl>
              <FormDescription>Enter a valid phone number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apartmentNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apartment Number</FormLabel>
              <FormControl>
                <Input placeholder="B-24" {...field} />
              </FormControl>
              <FormDescription>
                Enter the apartment number being visited.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visitReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visit Reason</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Purpose of the visit"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe the reason for the visit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visitDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Visit Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal text-black",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP p")
                      ) : (
                        <span>Select date and time</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      onChange={(e) => {
                        const date = field.value || new Date();
                        const [hours, minutes] = e.target.value.split(":");
                        date.setHours(Number.parseInt(hours, 10));
                        date.setMinutes(Number.parseInt(minutes, 10));
                        field.onChange(date);
                      }}
                      defaultValue={
                        field.value
                          ? `${field.value.getHours().toString().padStart(2, "0")}:${field.value.getMinutes().toString().padStart(2, "0")}`
                          : "13:00"
                      }
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the date and time of the visit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register Visitor"
          )}
        </Button>
      </form>
    </Form>
  );
}
