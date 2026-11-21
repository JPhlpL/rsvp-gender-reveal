"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import { APP_ADMIN_DISPLAY_NAME, WEDDING_ASSET_PATHS } from "@/utils/constants";

interface AdminNavigationProps {
  userEmail: string;
}

export function AdminNavigation({ userEmail }: AdminNavigationProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-wedding-sand/40 bg-wedding-cream/90 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          {/* Logo */}
          <Image
            src={WEDDING_ASSET_PATHS.logo}
            alt="JV"
            width={36}
            height={36}
            className="rounded-full border border-wedding-sand shadow-sm flex-shrink-0"
          />

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-wedding-brown truncate">
              {APP_ADMIN_DISPLAY_NAME}
            </h1>
            <p className="text-xs text-wedding-brown-medium truncate">{userEmail}</p>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex gap-1 ml-2">
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
                className={`gap-1.5 ${
                  isActive("/dashboard")
                    ? "bg-wedding-brown text-wedding-white hover:bg-wedding-brown/90"
                    : "text-wedding-brown-medium hover:text-wedding-brown hover:bg-wedding-sand/30"
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
                    ? "bg-wedding-brown text-wedding-white hover:bg-wedding-brown/90"
                    : "text-wedding-brown-medium hover:text-wedding-brown hover:bg-wedding-sand/30"
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
            className="text-xs sm:text-sm border-wedding-sand/60 text-wedding-brown-medium hover:bg-wedding-sand/20 hover:text-wedding-brown"
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
                ? "bg-wedding-brown text-wedding-white hover:bg-wedding-brown/90"
                : "text-wedding-brown-medium hover:text-wedding-brown hover:bg-wedding-sand/30"
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
                ? "bg-wedding-brown text-wedding-white hover:bg-wedding-brown/90"
                : "text-wedding-brown-medium hover:text-wedding-brown hover:bg-wedding-sand/30"
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
