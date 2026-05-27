"use client";

import { SiteHeader } from "@/components/sidebar/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function NewEmployeePage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="flex items-center gap-4 mb-6">
                <Link href="/employees">
                  <Button variant="ghost" size="icon">
                    <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-semibold flex items-center gap-2">
                    <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} />
                    Add Employee
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Fill in the details to add a new team member.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Personal Information
                    </CardTitle>
                    <CardDescription>Basic personal details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" placeholder="John Doe" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="San Francisco, CA" />
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
                    <div className="grid gap-3">
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" placeholder="Senior Developer" />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue="active">
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on-leave">On Leave</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end gap-3 px-4 lg:px-6">
                <Button variant="outline" asChild>
                  <Link href="/employees">Cancel</Link>
                </Button>
                <Button>Create Employee</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
