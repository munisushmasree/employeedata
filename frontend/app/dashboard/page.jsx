"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    fetchOffboardingData();
  }, [router]);

  const fetchOffboardingData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/offboarding"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch offboarding data");
      }

      const data = await response.json();

      // Total Offboardings
      setTotal(data.length);

      // Pending
      const pendingCount = data.filter(
        (item) => item.status === "Pending"
      ).length;

      // Approved
      const approvedCount = data.filter(
        (item) => item.status === "Approved"
      ).length;

      // Completed
      const completedCount = data.filter(
        (item) => item.status === "Completed"
      ).length;

      setPending(pendingCount);
      setApproved(approvedCount);
      setCompleted(completedCount);
    } catch (error) {
      console.error(
        "Error fetching offboarding data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Dashboard Header */}
      <h1 className="text-3xl font-bold text-gray-900">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Employee Offboarding Management
      </p>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        {/* Total Offboardings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">
            Total Offboardings
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {loading ? "..." : total}
          </h2>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">
            Pending
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {loading ? "..." : pending}
          </h2>
        </div>

        {/* Approved */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">
            Approved
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {loading ? "..." : approved}
          </h2>
        </div>

        {/* Completed */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">
            Completed
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {loading ? "..." : completed}
          </h2>
        </div>

      </div>

      {/* View Offboardings Button */}
      <button
        onClick={() => router.push("/offboarding")}
        className="mt-8 bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
      >
        View Offboardings
      </button>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <button onClick={() => router.push("/hr-overview")} className="rounded-lg bg-white p-5 text-left shadow hover:ring-2 hover:ring-blue-300">
          <p className="font-semibold text-gray-900">HR Overview</p>
          <p className="mt-1 text-sm text-gray-500">Review HR clearance requests</p>
        </button>
        <button onClick={() => router.push("/finance")} className="rounded-lg bg-white p-5 text-left shadow hover:ring-2 hover:ring-emerald-300">
          <p className="font-semibold text-gray-900">Finance View</p>
          <p className="mt-1 text-sm text-gray-500">Complete finance clearance</p>
        </button>
        <button onClick={() => router.push("/it-overview")} className="rounded-lg bg-white p-5 text-left shadow hover:ring-2 hover:ring-cyan-300">
          <p className="font-semibold text-gray-900">IT Overview</p>
          <p className="mt-1 text-sm text-gray-500">Clear systems and equipment</p>
        </button>
        <button onClick={() => router.push("/manager")} className="rounded-lg bg-white p-5 text-left shadow hover:ring-2 hover:ring-violet-300">
          <p className="font-semibold text-gray-900">Manager View</p>
          <p className="mt-1 text-sm text-gray-500">Approve employee exits</p>
        </button>
      </div>

    </div>
  );
}