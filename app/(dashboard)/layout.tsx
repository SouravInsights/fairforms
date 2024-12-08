import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LogoIcon } from "../components/icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-xl">
            <LogoIcon width={120} height={20} />
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
