"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function GateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passphrase }),
    });

    if (res.ok) {
      router.push(searchParams.get("next") || "/");
      router.refresh();
    } else {
      setError("That's not quite it. Try again?");
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="card w-full max-w-sm p-8 flex flex-col gap-4"
    >
      <h1 className="font-display text-2xl text-center">A little secret, please</h1>
      <p className="text-center text-sm text-[var(--ink-muted)]">
        This corner of the internet is just for us.
      </p>
      <input
        type="password"
        autoFocus
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        placeholder="Passphrase"
      />
      {error && <p className="text-sm text-[var(--rose)] text-center">{error}</p>}
      <button type="submit" disabled={loading} className="btn btn-gold justify-center">
        {loading ? "Checking..." : "Come in"}
      </button>
    </motion.form>
  );
}

export default function GatePage() {
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <Suspense fallback={null}>
        <GateForm />
      </Suspense>
    </main>
  );
}
