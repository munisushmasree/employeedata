"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">

      <h2 className="text-xl font-bold mb-8">
        HR Portal
      </h2>

      <div className="space-y-4">

        <button
          onClick={() => router.push("/dashboard")}
          className="block w-full text-left hover:text-blue-400"
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/offboarding")}
          className="block w-full text-left hover:text-blue-400"
        >
          Offboarding
        </button>

        <button
          onClick={() => router.push("/offboarding/create")}
          className="block w-full text-left hover:text-blue-400"
        >
          Create Offboarding
        </button>

      </div>

    </aside>
  );
}
