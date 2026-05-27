import { EmployeeFormLayout } from "@/components/employee/employee-form-layout";
import { EmployeeForm } from "@/components/employee/employee-form";

export default function NewEmployeePage() {
  return (
    <EmployeeFormLayout
      title="Add Employee"
      description="Create a new employee record."
    >
      <EmployeeForm />
    </EmployeeFormLayout>
  );
}
