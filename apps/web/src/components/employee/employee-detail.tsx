"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/sidebar/site-header";
import { EmployeeFormFields } from "@/components/employee/employee-form-fields";
import {
  deleteEmployeeMutationOptions,
  employeeDetailOptions,
  updateEmployeeMutationOptions,
} from "@/lib/apis/employee/employee-queries";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Delete01Icon,
  UserCircleIcon,
  Mail01Icon,
  Building03Icon,
  BriefcaseIcon,
  Location01Icon,
  Money01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import type { UpdateEmployee } from "@/types/api-types";
import {
  formSchema,
  type FormValues,
} from "@/components/employee/employee-form";

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

interface EmployeeDetailProps {
  id: string;
}

export function EmployeeDetail({ id }: EmployeeDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: employee } = useSuspenseQuery(employeeDetailOptions(id));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: employee.fullName,
      email: employee.email,
      jobTitle: employee.jobTitle,
      department: employee.department,
      country: employee.country,
      employmentType: employee.employmentType,
      salary: String(employee.salary),
      currency: employee.currency ?? "",
      hireDate: employee.hireDate
        ? format(new Date(employee.hireDate), "yyyy-MM-dd")
        : "",
    },
  });

  const { mutate: updateMutation, isPending: isUpdatePending } = useMutation({
    ...updateEmployeeMutationOptions(),
    onSuccess: () => {
      toast.success("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to update employee");
    },
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const { mutate: deleteMutation, isPending: isDeletePending } = useMutation({
    ...deleteEmployeeMutationOptions(),
    onSuccess: () => {
      toast.success("Employee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      router.push("/employees");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete employee");
    },
  });

  function handleSubmit(data: FormValues) {
    const updateData: UpdateEmployee = {
      fullName: data.fullName,
      email: data.email,
      jobTitle: data.jobTitle,
      department: data.department,
      country: data.country,
      employmentType: data.employmentType,
      salary: Number(data.salary),
      currency: data.currency || undefined,
      hireDate: data.hireDate || undefined,
    };
    updateMutation({ id, data: updateData });
  }

  function handleCancel() {
    form.reset();
    router.push("/employees");
  }

  return (
    <>
      <SiteHeader title="Employee" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="flex w-full justify-end">
                <Button
                  variant="ghost"
                  className="-ml-2 gap-1"
                  onClick={() => router.push("/employees")}
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                  Back to Employees
                </Button>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                    <HugeiconsIcon
                      icon={UserCircleIcon}
                      strokeWidth={2}
                      className="size-8 text-muted-foreground"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold">
                      {employee.fullName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {employee.jobTitle}
                    </p>
                  </div>
                </div>
                <AlertDialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                      Delete Employee
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{employee.fullName}</strong>? This action cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeletePending}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isDeletePending}
                        onClick={(e) => {
                          e.preventDefault();
                          deleteMutation(id, {
                            onSuccess: () => setDeleteDialogOpen(false),
                          });
                        }}
                      >
                        {isDeletePending ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Personal Information
                      </CardTitle>
                      <CardDescription>
                        Contact details and personal data.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <HugeiconsIcon
                          icon={Mail01Icon}
                          strokeWidth={2}
                          className="size-4 text-muted-foreground shrink-0"
                        />

                        <div className="min-w-0">
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                      <Separator />

                      <div className="flex items-center gap-3">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          strokeWidth={2}
                          className="size-4 text-muted-foreground shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium">Country</p>
                          <p className="text-sm text-muted-foreground">
                            {employee.country}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <HugeiconsIcon
                          icon={Money01Icon}
                          strokeWidth={2}
                          className="size-4 text-muted-foreground shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium">Salary</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(employee.salary, employee.currency)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Employment Details
                      </CardTitle>
                      <CardDescription>
                        Role, department, and status.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <HugeiconsIcon
                          icon={Building03Icon}
                          strokeWidth={2}
                          className="size-4 text-muted-foreground shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium">Department</p>
                          <p className="text-sm text-muted-foreground">
                            {employee.department}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <HugeiconsIcon
                          icon={BriefcaseIcon}
                          strokeWidth={2}
                          className="size-4 text-muted-foreground shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium">Job Title</p>
                          <p className="text-sm text-muted-foreground">
                            {employee.jobTitle}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <HugeiconsIcon
                          icon={Calendar03Icon}
                          strokeWidth={2}
                          className="size-4 text-muted-foreground shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium">Hire Date</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(employee.hireDate)}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <Badge variant="default">Active</Badge>
                        <span className="text-sm text-muted-foreground">
                          {employee.employmentType}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <form
                    id="employee-update-form"
                    onSubmit={form.handleSubmit(handleSubmit)}
                  >
                    <EmployeeFormFields control={form.control} />

                    <Separator className="my-6" />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={isUpdatePending}>
                        {isUpdatePending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
