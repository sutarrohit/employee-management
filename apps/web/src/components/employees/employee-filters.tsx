"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, departments, employmentTypes, jobTitles } from "@/lib/employee-options";

const ALL_VALUE = "all";

export function EmployeeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");

  React.useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  function pushParams(next: URLSearchParams) {
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    next.set("page", "1");
    pushParams(next);
  }

  function applySearch() {
    updateParam("search", search.trim());
  }

  return (
    <Card className="mx-4 lg:mx-6">
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="grid gap-2 xl:col-span-2">
          <Label htmlFor="employee-search">Search</Label>
          <Input
            id="employee-search"
            value={search}
            onBlur={applySearch}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applySearch();
              }
            }}
            placeholder="Name, email, or job title"
          />
        </div>

        <FilterSelect
          label="Country"
          value={searchParams.get("country") ?? ALL_VALUE}
          placeholder="All countries"
          options={countries}
          onChange={(value) => updateParam("country", value === ALL_VALUE ? "" : value)}
        />
        <FilterSelect
          label="Department"
          value={searchParams.get("department") ?? ALL_VALUE}
          placeholder="All departments"
          options={departments}
          onChange={(value) => updateParam("department", value === ALL_VALUE ? "" : value)}
        />
        <FilterSelect
          label="Job title"
          value={searchParams.get("jobTitle") ?? ALL_VALUE}
          placeholder="All job titles"
          options={jobTitles}
          onChange={(value) => updateParam("jobTitle", value === ALL_VALUE ? "" : value)}
        />
        <FilterSelect
          label="Type"
          value={searchParams.get("employmentType") ?? ALL_VALUE}
          placeholder="All types"
          options={employmentTypes}
          onChange={(value) => updateParam("employmentType", value === ALL_VALUE ? "" : value)}
        />

        <div className="flex items-end gap-2 xl:col-span-6">
          <Button type="button" onClick={applySearch}>
            Search
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push(pathname)}>
            Reset filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
