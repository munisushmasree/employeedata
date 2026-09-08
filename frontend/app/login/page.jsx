"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("hr");

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary login
    // Backend authentication will be connected later

    if (email && password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);

      const roleRoutes = {
        hr: "/hr-overview",
        it: "/it-overview",
        finance: "/finance",
        manager: "/manager",
      };

      router.push(roleRoutes[role]);
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">

        <h1 className="text-2xl font-bold text-center mb-2">
          Employee Offboarding
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Login to continue
        </p>

        <form onSubmit={handleLogin}>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block font-medium">Sign in as</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border px-3 py-2">
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="it">IT / Admin & Systems</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}