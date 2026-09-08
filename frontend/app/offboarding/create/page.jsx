"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateOffboardingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    department: "",
    reason: "",
    lastWorkingDay: "",
    resignationDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/offboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          createdByName: localStorage.getItem("userName") || "HR Admin",
          createdById: localStorage.getItem("userId") || "system",
        }),
      });
      if (!response.ok) throw new Error("Unable to create offboarding workflow");
      router.push("/offboarding");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-2">
        Create Offboarding
      </h1>

      <p className="text-gray-600 mb-6">
        Start the employee offboarding process
      </p>

      {/* Form Container */}
      <div className="bg-white p-8 rounded-lg shadow max-w-2xl">

        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit}>

          {/* Employee Name */}
          <div className="mb-4">

            <label className="block mb-2 font-medium">
              Employee Name
            </label>

            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter employee name"
              required
            />

          </div>

          {/* Employee ID */}
          <div className="mb-4">

            <label className="block mb-2 font-medium">
              Employee ID
            </label>

            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter employee ID"
              required
            />

          </div>

          {/* Department */}
          <div className="mb-4">

            <label className="block mb-2 font-medium">
              Department
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            >

              <option value="">
                Select department
              </option>

              <option value="Engineering">
                Engineering
              </option>

              <option value="HR">
                HR
              </option>

              <option value="Finance">
                Finance
              </option>

              <option value="IT">
                IT
              </option>

            </select>

          </div>

          {/* Reason */}
          <div className="mb-4">

            <label className="block mb-2 font-medium">
              Reason
            </label>

            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            >

              <option value="">
                Select reason
              </option>

              <option value="Resignation">
                Resignation
              </option>

              <option value="Termination">
                Termination
              </option>

              <option value="Retirement">
                Retirement
              </option>

            </select>

          </div>

          {/* Last Working Day */}
          <div className="mb-6">

            <label className="block mb-2 font-medium">
              Last Working Day
            </label>

            <input
              type="date"
              name="lastWorkingDay"
              value={formData.lastWorkingDay}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />

          </div>
          {/* Resignation Date */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Resignation Date</label>
            <input
              type="date"
              name="resignationDate"
              value={formData.resignationDate}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
            >
              {saving ? "Creating workflow..." : "Create Offboarding"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/offboarding")}
              className="border px-5 py-2 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
