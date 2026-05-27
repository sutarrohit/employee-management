"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createEmployeeMutationOptions } from "@/lib/apis/employee/employee-queries";
import { EmployeeFormFields } from "./employee-form-fields";

export const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email"),
  jobTitle: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  country: z.string().min(1, "Country is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  salary: z
    .string()
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "Salary must be a positive number",
    ),
  currency: z.string().optional(),
  hireDate: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

const defaultFormValues: FormValues = {
  fullName: "",
  email: "",
  jobTitle: "",
  department: "",
  country: "",
  employmentType: "",
  salary: "",
  currency: "",
  hireDate: "",
};

interface EmployeeFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit?: (data: FormValues) => void;
  isPending?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export function EmployeeForm({
  defaultValues,
  onSubmit: externalOnSubmit,
  isPending: externalPending,
  submitLabel = "Create Employee",
  cancelLabel = "Cancel",
  onCancel,
}: EmployeeFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  const { mutate, isPending: mutationPending } = useMutation({
    ...createEmployeeMutationOptions(),
    onSuccess: () => {
      toast.success("Employee created successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create employee");
    },
  });

  const isPending = externalPending ?? mutationPending;

  function handleSubmit(data: FormValues) {
    if (externalOnSubmit) {
      externalOnSubmit(data);
    } else {
      mutate({ ...data, salary: Number(data.salary) });
    }
  }

  function handleCancel() {
    if (onCancel) {
      onCancel();
    } else {
      form.reset();
    }
  }

  return (
    <form
      id="employee-form"
      className="w-full"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <EmployeeFormFields control={form.control} />

      <Separator className="my-6" />

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button type="submit" form="employee-form" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
