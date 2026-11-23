import type { Metadata } from "next";
import type { ReactNode } from "react";
import { APP_PAGE_DESCRIPTION, APP_PAGE_TITLE } from "@/utils/constants";

export const metadata: Metadata = {
  title: APP_PAGE_TITLE,
  description: APP_PAGE_DESCRIPTION,
  // A showcase link for sharing, not something to find through search.
  robots: { index: false, follow: false },
};

export default function InvitationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
