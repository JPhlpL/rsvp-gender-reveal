import type { Metadata } from "next";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import {
  APP_ADMIN_DISPLAY_NAME,
  LOGIN_METADATA_DESCRIPTION,
  LOGIN_METADATA_TITLE,
  WEDDING_ASSET_PATHS,
  WEDDING_COUPLE_NAMES_SHORT,
} from "@/utils/constants";

export const metadata: Metadata = {
  title: LOGIN_METADATA_TITLE,
  description: LOGIN_METADATA_DESCRIPTION,
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-wedding-cream px-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-wedding-beige)_0%,_var(--color-wedding-cream)_50%,_var(--color-wedding-white)_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <Image
            src={WEDDING_ASSET_PATHS.logo}
            alt={WEDDING_COUPLE_NAMES_SHORT}
            width={80}
            height={80}
            className="mx-auto mb-4 rounded-full border-2 border-wedding-sand shadow-sm"
          />
          <h1 className="text-xl font-semibold tracking-tight text-wedding-brown">
            {APP_ADMIN_DISPLAY_NAME}
          </h1>
          <p className="mt-1 text-sm text-wedding-brown-medium">
            Admin Dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-wedding-sand/50 bg-white/70 backdrop-blur-sm shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-base text-wedding-brown">
              Welcome back
            </CardTitle>
            <CardDescription className="text-wedding-brown-medium">
              Sign in to manage your guest list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-wedding-brown-warm/60">
          Only authorized administrators can access this area.
        </p>
      </div>
    </div>
  );
}
