"use client";

import { SiteHeader } from "@/components/sidebar/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  UserGroupIcon,
  ArrowDown01Icon,
  FilterHorizontalIcon,
} from "@hugeicons/core-free-icons";

const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    department: "Engineering",
    role: "Developer",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    department: "Design",
    role: "Designer",
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    department: "Marketing",
    role: "Manager",
    status: "On Leave",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    department: "Engineering",
    role: "Senior Developer",
    status: "Active",
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex@example.com",
    department: "HR",
    role: "Coordinator",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily@example.com",
    department: "Finance",
    role: "Analyst",
    status: "Active",
  },
];

export default function EmployeesPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={UserGroupIcon}
                        strokeWidth={2}
                        className="size-5"
                      />
                      Employees
                    </CardTitle>
                    <CardDescription>
                      Manage your team members and their roles.
                    </CardDescription>
                  </div>
                  <Button>
                    <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />
                    Add Employee
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                      <HugeiconsIcon
                        icon={Search01Icon}
                        strokeWidth={2}
                        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        placeholder="Search employees..."
                        className="pl-9"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <HugeiconsIcon
                        icon={FilterHorizontalIcon}
                        strokeWidth={2}
                      />
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">
                            {employee.name}
                          </TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>{employee.role}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                employee.status === "Active"
                                  ? "default"
                                  : employee.status === "On Leave"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {employee.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
