"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await signIn("admin-login", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setMessage("Invalid admin login details.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Auto Access Admin
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Secure admin access for application management
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-gray-600">
            Use the dedicated admin login to review applications, update statuses,
            and manage uploaded supporting documents.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                no: "01",
                title: "Review Applications",
                text: "View all incoming applications in one dashboard.",
              },
              {
                no: "02",
                title: "Manage Documents",
                text: "Review uploaded documents by type and applicant.",
              },
              {
                no: "03",
                title: "Update Status",
                text: "Change application progress and keep records current.",
              },
            ].map((item) => (
              <div
                key={item.no}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {item.no}
                </div>
                <p className="mt-4 text-lg font-bold">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
            Admin Login
          </p>

          <h2 className="text-3xl font-bold">Administrator Access</h2>
          <p className="mt-3 text-gray-600">
            Enter your real admin email and password.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
                required
              />
            </div>

            {message ? (
              <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? "Signing in..." : "Access Admin"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}