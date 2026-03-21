import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="ServeNow" width={120} height={32} />
          </Link>
          <p className="mt-3 max-w-sm text-sm text-zinc-600">
            Service operations for teams that book jobs, dispatch technicians, and keep customers in the loop.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-sm sm:gap-16">
          <div>
            <p className="font-semibold text-zinc-900">Product</p>
            <ul className="mt-3 space-y-2 text-zinc-600">
              <li>
                <Link href="/services" className="hover:text-teal-700">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-teal-700">
                  Book
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-zinc-900">Accounts</p>
            <ul className="mt-3 space-y-2 text-zinc-600">
              <li>
                <Link href="/login" className="hover:text-teal-700">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-teal-700">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-teal-700">
                  Forgot password
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-100 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} ServeNow. Demo platform.
      </div>
    </footer>
  );
}
