"use client";

import Link from "next/link";
import { PartyMark } from "@/components/illustrations";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import { APP_ADMIN_DISPLAY_NAME } from "@/utils/constants";

interface AdminNavigationProps {
  userEmail: string;
}

export function AdminNavigation({ userEmail }: AdminNavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-party-ink/15 bg-party-cream/90 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          {/* Logo */}
          <PartyMark className="h-9 w-9 flex-shrink-0" />

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-party-ink truncate">
              {APP_ADMIN_DISPLAY_NAME}
            </h1>
            <p className="text-xs text-party-ink-soft truncate">{userEmail}</p>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex gap-1 ml-2">
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
                className={`gap-1.5 ${
                  isActive("/dashboard")
                    ? "bg-party-ink text-party-white hover:bg-party-ink/90"
                    : "text-party-ink-soft hover:text-party-ink hover:bg-party-ink/15"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/guests">
              <Button
                variant={isActive("/dashboard/guests") ? "default" : "ghost"}
                size="sm"
                className={`gap-1.5 ${
                  isActive("/dashboard/guests")
                    ? "bg-party-ink text-party-white hover:bg-party-ink/90"
                    : "text-party-ink-soft hover:text-party-ink hover:bg-party-ink/15"
                }`}
              >
                <Users className="h-4 w-4" />
                Guests
              </Button>
            </Link>
          </div>
        </div>

        <form action={logoutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm border-party-ink/15 text-party-ink-soft hover:bg-party-ink/15 hover:text-party-ink"
          >
            Sign Out
          </Button>
        </form>
      </div>

      {/* Mobile Navigation */}
      <div className="flex sm:hidden gap-1 mt-3">
        <Link href="/dashboard" className="flex-1">
          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            size="sm"
            className={`w-full gap-1.5 ${
              isActive("/dashboard")
                ? "bg-party-ink text-party-white hover:bg-party-ink/90"
                : "text-party-ink-soft hover:text-party-ink hover:bg-party-ink/15"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/guests" className="flex-1">
          <Button
            variant={isActive("/dashboard/guests") ? "default" : "ghost"}
            size="sm"
            className={`w-full gap-1.5 ${
              isActive("/dashboard/guests")
                ? "bg-party-ink text-party-white hover:bg-party-ink/90"
                : "text-party-ink-soft hover:text-party-ink hover:bg-party-ink/15"
            }`}
          >
            <Users className="h-4 w-4" />
            Guests
          </Button>
        </Link>
      </div>
    </header>
  );
}
