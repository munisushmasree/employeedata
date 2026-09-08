"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OffboardingPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get offboarding records from backend
  useEffect(() => {
    fetchOffboarding();
  }, []);

  const fetchOffboarding = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/offboarding"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch offboarding records"
        );
      }

      const data = await response.json();

      setEmployees(data);
    } catch (error) {
      console.error(
        "Error fetching offboarding records:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Employee Offboarding
          </h1>

          <p className="text-gray-600">
            Manage employee exit processes
          </p>
        </div>

        {/* Create Offboarding Button */}
        <button
          onClick={() =>
            router.push("/offboarding/create")
          }
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
        >
          + Create Offboarding
        </button>

      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          {/* Table Header */}
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

          {/* Table Body */}
          <tbody>

            {/* Loading */}
            {loading ? (

              <tr>

                <td
                  colSpan="5"
                  className="p-6 text-center"
                >
                  Loading...
                </td>

              </tr>

            ) : employees.length === 0 ? (

              /* No Records */
              <tr>

                <td
                  colSpan="5"
                  className="p-6 text-center"
                >
                  No offboarding records found
                </td>

              </tr>

            ) : (

              /* Records */
              employees.map((employee) => (

                <tr
                  key={employee._id}
                  className="border-t"
                >

                  {/* Employee */}
                  <td className="p-4">
                    {employee.employeeName}
                  </td>

                  {/* Department */}
                  <td className="p-4">
                    {employee.department}
                  </td>

                  {/* Last Working Day */}
                  <td className="p-4">
                    {employee.lastWorkingDay}
                  </td>

                  {/* Status */}
                  <td className="p-4">

                    <span
                      className={
                        employee.status === "Approved"
                          ? "text-green-600 font-semibold"
                          : employee.status === "Pending"
                          ? "text-yellow-600 font-semibold"
                          : employee.status === "Completed"
                          ? "text-blue-600 font-semibold"
                          : "text-gray-700 font-semibold"
                      }
                    >
                      {employee.status}
                    </span>

                  </td>

                  {/* Action */}
                  <td className="p-4">

                    <button
                      onClick={() =>
                        router.push(
                          `/offboarding/${employee._id}`
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}