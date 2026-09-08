"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function OffboardingDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [auditHistory, setAuditHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOffboarding();
      fetch(`http://localhost:5000/api/offboarding/${params.id}/audit`)
        .then((response) => (response.ok ? response.json() : []))
        .then(setAuditHistory)
        .catch(() => setAuditHistory([]));
    }
  }, [params.id]);

  const fetchOffboarding = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/offboarding/${params.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch offboarding details");
      }

      const data = await response.json();

      setEmployee(data);
    } catch (error) {
      console.error(
        "Error fetching offboarding details:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold">
          Loading...
        </h1>
      </div>
    );
  }

  // Record not found
  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold">
          Offboarding record not found
        </h1>

        <button
          onClick={() => router.push("/offboarding")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Offboarding
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Back Button */}
      <button
        onClick={() => router.push("/offboarding")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Offboarding
      </button>

      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-6">
        Offboarding Details
      </h1>

      {/* Employee Details */}
      <div className="bg-white p-8 rounded-lg shadow max-w-3xl">

        <div className="grid grid-cols-2 gap-6">

          {/* Employee Name */}
          <div>
            <p className="text-gray-500">
              Employee Name
            </p>

            <p className="font-semibold">
              {employee.employeeName}
            </p>
          </div>

          {/* Employee ID */}
          <div>
            <p className="text-gray-500">
              Employee ID
            </p>

            <p className="font-semibold">
              {employee.employeeId}
            </p>
          </div>

          {/* Department */}
          <div>
            <p className="text-gray-500">
              Department
            </p>

            <p className="font-semibold">
              {employee.department}
            </p>
          </div>

          {/* Reason */}
          <div>
            <p className="text-gray-500">
              Reason
            </p>

            <p className="font-semibold">
              {employee.reason}
            </p>
          </div>

          {/* Last Working Day */}
          <div>
            <p className="text-gray-500">
              Last Working Day
            </p>

            <p className="font-semibold">
              {employee.lastWorkingDay}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-gray-500">
              Status
            </p>

            <p
              className={`font-semibold ${
                employee.status === "Approved"
                  ? "text-green-600"
                  : employee.status === "Pending"
                  ? "text-yellow-600"
                  : "text-gray-700"
              }`}
            >
              {employee.status}
            </p>
          </div>

        </div>

        {/* Separator */}
        <hr className="my-8" />

        {/* Approval Progress */}
        <h2 className="text-xl font-bold mb-4">
          Approval Progress
        </h2>

        <div className="space-y-4">

          {employee.approvalStages?.length > 0 && employee.approvalStages.map((stage) => (
            <div key={stage.key} className="border p-4 rounded">
              <div className="flex justify-between gap-4">
                <span className="font-medium">{stage.name}</span>
                <span className={stage.status === "Approved" ? "text-green-600 font-semibold" : stage.status === "Active" ? "text-blue-600 font-semibold" : "text-yellow-600"}>
                  {stage.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Role: {stage.role} | Mode: {stage.mode}</p>
              {stage.remarks && <p className="mt-2 text-sm text-gray-700">Remark: {stage.remarks}</p>}
            </div>
          ))}

          {/* HR */}
          {!employee.approvalStages?.length && <div className="flex justify-between border p-4 rounded">
            <span>
              HR Clearance
            </span>

            <span
              className={
                employee.hrClearance === "Approved"
                  ? "text-green-600 font-semibold"
                  : "text-yellow-600"
              }
            >
              {employee.hrClearance}
            </span>
          </div>}

          {/* IT */}
          {!employee.approvalStages?.length && <div className="flex justify-between border p-4 rounded">
            <span>
              IT Clearance
            </span>

            <span
              className={
                employee.itClearance === "Approved"
                  ? "text-green-600 font-semibold"
                  : "text-yellow-600"
              }
            >
              {employee.itClearance}
            </span>
          </div>}

          {/* Finance */}
          {!employee.approvalStages?.length && <div className="flex justify-between border p-4 rounded">
            <span>
              Finance Clearance
            </span>

            <span
              className={
                employee.financeClearance === "Approved"
                  ? "text-green-600 font-semibold"
                  : "text-yellow-600"
              }
            >
              {employee.financeClearance}
            </span>
          </div>}

          {/* Manager */}
          {!employee.approvalStages?.length && <div className="flex justify-between border p-4 rounded">
            <span>
              Manager Approval
            </span>

            <span
              className={
                employee.managerApproval === "Approved"
                  ? "text-green-600 font-semibold"
                  : "text-yellow-600"
              }
            >
              {employee.managerApproval}
            </span>
          </div>}

        </div>

        <hr className="my-8" />
        <h2 className="text-xl font-bold mb-4">Activity History</h2>
        <div className="space-y-3">
          {auditHistory.length === 0 ? <p className="text-sm text-gray-500">No activity recorded yet.</p> : auditHistory.map((item) => (
            <div key={item._id} className="border-l-2 border-blue-500 pl-3 text-sm">
              <p className="font-medium">{item.action} by {item.userName || item.userId || "System"}</p>
              <p className="text-gray-500">{item.role || "System"} | {new Date(item.createdAt).toLocaleString()}</p>
              {item.remarks && <p className="text-gray-700">{item.remarks}</p>}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}