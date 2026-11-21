import type { Metadata } from "next";
import { PartyMark } from "@/components/illustrations";
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
} from "@/utils/constants";

export const metadata: Metadata = {
  title: LOGIN_METADATA_TITLE,
  description: LOGIN_METADATA_DESCRIPTION,
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-party-cream px-4">
      {/* Background gradient */}

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <PartyMark className="mx-auto mb-4 h-20 w-20" />
          <h1 className="text-xl font-semibold tracking-tight text-party-ink">
            {APP_ADMIN_DISPLAY_NAME}
          </h1>
          <p className="mt-1 text-sm text-party-ink-soft">
            Admin Dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-party-ink/15 bg-white/70 backdrop-blur-sm shadow-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-base text-party-ink">
              Welcome back
            </CardTitle>
            <CardDescription className="text-party-ink-soft">
              Sign in to manage your guest list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-party-ink-soft/60">
          Only authorized administrators can access this area.
        </p>
      </div>
    </div>
  );
}
