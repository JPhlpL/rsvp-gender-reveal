"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportGuestsToExcel } from "@/utils/exportGuests";
import type { Guest } from "@/types/guest";

interface ExportGuestsButtonProps {
  guests: Guest[];
}

export function ExportGuestsButton({ guests }: ExportGuestsButtonProps) {
  const handleExport = () => {
    exportGuestsToExcel(guests);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className="w-full sm:w-auto"
    >
      <Download className="mr-2 h-4 w-4" />
      Export to Excel
    </Button>
  );
}
