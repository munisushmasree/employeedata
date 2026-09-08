"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">

      <h1 className="font-bold text-xl">
        Employee Offboarding
      </h1>

      <button
        onClick={handleLogout}
        className="text-red-600"
      >
        Logout
      </button>

    </nav>
  );
}
