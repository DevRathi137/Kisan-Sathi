import Link from "next/link";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1a2e1c] flex flex-col items-center justify-center text-center px-6">
      <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-4">404</p>
      <h1 className="text-5xl font-black text-white mb-4">Page Not Found</h1>
      <p className="text-white/50 text-lg max-w-md mb-10">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
}
