"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const roleConfig = {
  hr: {
    title: "HR Overview",
    description: "Review employee exits and complete HR clearance.",
    field: "hrClearance",
    stageKey: "hr",
    label: "HR Clearance",
    accent: "blue",
  },
  finance: {
    title: "Finance View",
    description: "Track financial clearance for every employee exit.",
    field: "financeClearance",
    stageKey: "accounts",
    label: "Finance Clearance",
    accent: "emerald",
  },
  it: {
    title: "IT Overview",
    description: "Complete systems, equipment, and access clearance.",
    field: "itClearance",
    stageKey: "admin-systems",
    label: "IT Clearance",
    accent: "cyan",
  },
  manager: {
    title: "Manager View",
    description: "Approve exits for employees in your organization.",
    field: "managerApproval",
    stageKey: "manager",
    label: "Manager Approval",
    accent: "violet",
  },
};

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function RoleOverview({ role }) {
  const router = useRouter();
  const config = roleConfig[role];
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchRecords = async () => {
      try {
        const response = await fetch(`${API_URL}/offboarding/view/${role}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Unable to load offboarding records");
        const data = await response.json();
        setRecords(data.records || []);
        setLastUpdated(new Date());
        setError("");
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
    const refreshTimer = setInterval(fetchRecords, 15000);

    return () => clearInterval(refreshTimer);
  }, [router, refreshKey]);

  const pending = records.filter((record) => {
    const stage = record.approvalStages?.find((item) => item.key === config.stageKey);
    return (stage?.status || record[config.field]) !== "Approved";
  });
  const approved = records.length - pending.length;

  const updateApproval = async (recordId, value) => {
    setUpdatingId(recordId);
    setError("");
    try {
      const response = await fetch(`${API_URL}/offboarding/${recordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageKey: config.stageKey,
          status: value,
          role: config.title,
          userName: localStorage.getItem("userName") || "HR Admin",
          remarks: remarks[recordId] || "",
        }),
      });
      if (!response.ok) throw new Error("Unable to update approval");
      const updated = await response.json();
      setRecords((current) =>
        current.map((record) => (record._id === recordId ? updated : record))
      );
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!config) return null;

  return (
    <main className="min-h-screen bg-gray-100 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <button onClick={() => router.push("/dashboard")} className="mb-3 text-sm text-blue-600 hover:underline">
              Back to dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
            <p className="mt-2 text-gray-600">{config.description}</p>
            {lastUpdated && (
              <p className="mt-1 text-xs text-gray-500">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRefreshKey((current) => current + 1)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Refresh
            </button>
            <button onClick={() => router.push("/offboarding")} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              All offboardings
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Metric label="Total requests" value={loading ? "..." : records.length} />
          <Metric label="Waiting for my action" value={loading ? "..." : pending.length} />
          <Metric label="Completed by me" value={loading ? "..." : approved} />
        </div>

        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <section className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Requests requiring review</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Last working day</th>
                  <th className="p-4">My status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading requests...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-gray-500">No offboarding requests found.</td></tr>
                ) : records.map((record) => {
                  const stage = record.approvalStages?.find((item) => item.key === config.stageKey);
                  const status = stage?.status || record[config.field] || "Pending";
                  const isUpdating = updatingId === record._id;
                  return (
                    <tr key={record._id} className="border-t border-gray-100">
                      <td className="p-4 font-medium text-gray-900">{record.employeeName}</td>
                      <td className="p-4 text-gray-600">{record.department}</td>
                      <td className="p-4 text-gray-600">{record.lastWorkingDay}</td>
                      <td className="p-4">
                        <span className={status === "Approved" ? "font-semibold text-green-600" : "font-semibold text-amber-600"}>{status}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <input
                            value={remarks[record._id] || ""}
                            onChange={(event) => setRemarks((current) => ({ ...current, [record._id]: event.target.value }))}
                            placeholder="Remark"
                            className="w-28 rounded-md border border-gray-300 px-2 py-1.5"
                          />
                          <button disabled={isUpdating || status === "Approved"} onClick={() => updateApproval(record._id, "Approved")} className="rounded-md bg-green-600 px-3 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-40">
                            Approve
                          </button>
                          <button disabled={isUpdating || status !== "Approved"} onClick={() => updateApproval(record._id, "Pending")} className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">
                            Reopen
                          </button>
                          <button onClick={() => router.push(`/offboarding/${record._id}`)} className="px-2 py-1.5 text-blue-600 hover:underline">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}