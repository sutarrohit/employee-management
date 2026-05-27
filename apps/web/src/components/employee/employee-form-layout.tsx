import type { ReactNode } from "react";
import { SiteHeader } from "@/components/sidebar/site-header";

interface EmployeeFormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function EmployeeFormLayout({
  title,
  description,
  children,
}: EmployeeFormLayoutProps) {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
