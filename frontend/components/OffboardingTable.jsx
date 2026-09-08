"use client";

import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";

export default function OffboardingTable({ employees }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>
            <th className="text-left p-4">
              Employee
            </th>

            <th className="text-left p-4">
              Department
            </th>

            <th className="text-left p-4">
              Last Working Day
            </th>

            <th className="text-left p-4">
              Status
            </th>

            <th className="text-left p-4">
              Action
            </th>
          </tr>

        </thead>

        <tbody>

          {employees.map((employee) => (

            <tr
              key={employee.id}
              className="border-t"
            >

              <td className="p-4">
                {employee.name}
              </td>

              <td className="p-4">
                {employee.department}
              </td>

              <td className="p-4">
                {employee.lastWorkingDay}
              </td>

              <td className="p-4">
                <StatusBadge status={employee.status} />
              </td>

              <td className="p-4">

                <button
                  onClick={() =>
                    router.push(
                      `/offboarding/${employee.id}`
                    )
                  }
                  className="text-blue-600"
                >
                  View
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
