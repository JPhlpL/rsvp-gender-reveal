import type { Metadata } from "next";
import type { ReactNode } from "react";
import { APP_PAGE_DESCRIPTION, APP_PAGE_TITLE } from "@/utils/constants";

export const metadata: Metadata = {
  title: APP_PAGE_TITLE,
  description: APP_PAGE_DESCRIPTION,
};

export default function RsvpLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
