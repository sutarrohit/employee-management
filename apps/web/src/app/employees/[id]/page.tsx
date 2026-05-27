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
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserCircleIcon,
  Mail01Icon,
  Building03Icon,
  BriefcaseIcon,
  CallIcon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

export default function EmployeeDetailPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
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
                    <h1 className="text-2xl font-semibold">John Doe</h1>
                    <p className="text-sm text-muted-foreground">
                      Senior Developer
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Edit</Button>
                  <Button>Save</Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Contact details and personal data.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        strokeWidth={2}
                        className="size-4 text-muted-foreground"
                      />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          john.doe@company.com
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <HugeiconsIcon
                        icon={CallIcon}
                        strokeWidth={2}
                        className="size-4 text-muted-foreground"
                      />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        strokeWidth={2}
                        className="size-4 text-muted-foreground"
                      />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          San Francisco, CA
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
                        className="size-4 text-muted-foreground"
                      />
                      <div>
                        <p className="text-sm font-medium">Department</p>
                        <p className="text-sm text-muted-foreground">
                          Engineering
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <HugeiconsIcon
                        icon={BriefcaseIcon}
                        strokeWidth={2}
                        className="size-4 text-muted-foreground"
                      />
                      <div>
                        <p className="text-sm font-medium">Role</p>
                        <p className="text-sm text-muted-foreground">
                          Senior Developer
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <Badge variant="default">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
