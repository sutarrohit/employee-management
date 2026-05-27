"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type SortingState
} from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowLeftDoubleIcon,
  ArrowRight01Icon,
  ArrowRightDoubleIcon,
  Delete01Icon,
  LeftToRightListBulletIcon
} from "@hugeicons/core-free-icons";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteEmployeeMutationOptions, employeeListOptions } from "@/lib/apis/employee/employee-queries";
import { filtersFromURLSearchParams } from "@/lib/employee-filters";
import type { EmployeeResponse } from "@employee-management/api";

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function SortHeader({
  label,
  column
}: {
  label: string;
  column: {
    getIsSorted: () => false | "asc" | "desc";
    toggleSorting: (desc?: boolean) => void;
  };
}) {
  const sorted = column.getIsSorted();

  return (
    <Button
      type='button'
      variant='ghost'
      className='-ml-2 h-8 px-2'
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {label}
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        strokeWidth={2}
        className={sorted === "asc" ? "size-3 rotate-180" : "size-3"}
      />
    </Button>
  );
}

function ActionsCell({ employee }: { employee: EmployeeResponse }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const { mutate, isPending } = useMutation({
    ...deleteEmployeeMutationOptions(),
    onSuccess: () => {
      toast.success(`${employee.fullName} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete employee");
    }
  });

  return (
    <div className='text-right flex items-center justify-end gap-2'>
      <Button asChild variant='outline' className='mr-2'>
        <Link href={`/employees/${employee.id}`}>View/Update</Link>
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant='destructive' size='icon'>
            <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{employee.fullName}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex justify-center'>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                mutate(employee.id, {
                  onSuccess: () => setOpen(false)
                });
              }}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function useTableColumns() {
  const columns: ColumnDef<EmployeeResponse>[] = React.useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: ({ column }) => <SortHeader label='Name' column={column} />,
        cell: ({ row }) => (
          <div className='min-w-44'>
            <Link href={`/employees/${row.original.id}`} className='font-medium text-foreground hover:underline'>
              {row.original.fullName}
            </Link>
            <div className='text-xs text-muted-foreground'>{row.original.email}</div>
          </div>
        )
      },
      {
        accessorKey: "jobTitle",
        header: "Job title",
        cell: ({ row }) => <span className='text-muted-foreground'>{row.original.jobTitle}</span>,
        enableSorting: false
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => <Badge variant='outline'>{row.original.department}</Badge>,
        enableSorting: false
      },
      {
        accessorKey: "country",
        header: "Country",
        enableSorting: false
      },
      {
        accessorKey: "salary",
        header: ({ column }) => <SortHeader label='Salary' column={column} />,
        cell: ({ row }) => (
          <span className='font-mono tabular-nums'>{formatCurrency(row.original.salary, row.original.currency)}</span>
        )
      },
      {
        accessorKey: "employmentType",
        header: "Type",
        cell: ({ row }) => <Badge variant='secondary'>{row.original.employmentType}</Badge>,
        enableSorting: false
      },
      {
        accessorKey: "hireDate",
        header: ({ column }) => <SortHeader label='Hire date' column={column} />,
        cell: ({ row }) => <span className='text-muted-foreground'>{formatDate(row.original.hireDate)}</span>
      },
      {
        id: "actions",
        header: () => <div className='text-right'>Actions</div>,
        cell: ({ row }) => <ActionsCell employee={row.original} />,
        enableHiding: false,
        enableSorting: false
      }
    ],
    []
  );
  return columns;
}

export function EmployeeTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = React.useMemo(() => filtersFromURLSearchParams(searchParams), [searchParams]);
  const { data: employees } = useSuspenseQuery(employeeListOptions(filters));
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const columns = useTableColumns();
  const sorting = React.useMemo<SortingState>(
    () => (filters.sortBy ? [{ id: filters.sortBy, desc: filters.sortOrder === "desc" }] : []),
    [filters.sortBy, filters.sortOrder]
  );

  function pushParams(next: URLSearchParams) {
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function updatePage(page: number) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(page));
    pushParams(next);
  }

  function updatePageSize(pageSize: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", "1");
    next.set("pageSize", pageSize);
    pushParams(next);
  }

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const nextSorting = typeof updater === "function" ? updater(sorting) : updater;
    const next = new URLSearchParams(searchParams.toString());
    const primarySort = nextSorting[0];

    if (primarySort) {
      next.set("sortBy", primarySort.id);
      next.set("sortOrder", primarySort.desc ? "desc" : "asc");
    } else {
      next.delete("sortBy");
      next.delete("sortOrder");
    }

    next.set("page", "1");
    pushParams(next);
  };

  const table = useReactTable({
    data: employees.data,
    columns,
    pageCount: employees.pagination.totalPages,
    state: {
      columnVisibility,
      sorting,
      pagination: {
        pageIndex: employees.pagination.page - 1,
        pageSize: employees.pagination.pageSize
      }
    },
    manualPagination: true,
    manualSorting: true,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel()
  });

  const { page, pageSize, total, totalPages } = employees.pagination;
  const firstRow = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, total);

  return (
    <Card className='mx-4 lg:mx-6'>
      <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            {total} employee{total === 1 ? "" : "s"} found
          </CardDescription>
        </div>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <HugeiconsIcon icon={LeftToRightListBulletIcon} strokeWidth={2} />
                Columns
                <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild size='sm'>
            <Link href='/employees/new'>
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              Add employee
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className='flex flex-col gap-4'>
        <div className='overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader className='bg-muted'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-sm text-muted-foreground'>
            Showing {firstRow}-{lastRow} of {total}
          </div>
          <div className='flex items-center gap-4 sm:gap-8'>
            <div className='hidden items-center gap-2 lg:flex'>
              <Label htmlFor='employee-rows-per-page' className='text-sm font-medium'>
                Rows per page
              </Label>
              <Select value={String(pageSize)} onValueChange={updatePageSize}>
                <SelectTrigger size='sm' className='w-20' id='employee-rows-per-page'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side='top'>
                  <SelectGroup>
                    {[10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='text-sm font-medium'>
              Page {page} of {totalPages}
            </div>
            <div className='ml-auto flex items-center gap-2 sm:ml-0'>
              <Button
                variant='outline'
                className='hidden size-8 p-0 lg:flex'
                onClick={() => updatePage(1)}
                disabled={page <= 1}
              >
                <span className='sr-only'>Go to first page</span>
                <HugeiconsIcon icon={ArrowLeftDoubleIcon} strokeWidth={2} />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => updatePage(page - 1)}
                disabled={page <= 1}
              >
                <span className='sr-only'>Go to previous page</span>
                <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
              </Button>
              <Button
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => updatePage(page + 1)}
                disabled={page >= totalPages}
              >
                <span className='sr-only'>Go to next page</span>
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </Button>
              <Button
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => updatePage(totalPages)}
                disabled={page >= totalPages}
              >
                <span className='sr-only'>Go to last page</span>
                <HugeiconsIcon icon={ArrowRightDoubleIcon} strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
