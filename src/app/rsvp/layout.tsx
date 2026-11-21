import type { Metadata } from "next";
import type { ReactNode } from "react";
import { APP_PAGE_DESCRIPTION, APP_PAGE_TITLE } from "@/utils/constants";

export const metadata: Metadata = {
  title: APP_PAGE_TITLE,
  description: APP_PAGE_DESCRIPTION,
  // Personal invitation links should never show up in search results.
  robots: { index: false, follow: false },
};

export default function RsvpLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
