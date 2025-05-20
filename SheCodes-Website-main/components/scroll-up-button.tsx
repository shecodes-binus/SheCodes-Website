"use client"; // <-- This directive marks it as a Client Component

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export function ScrollUpButton() {
  // This function is now safe because it runs in the client environment
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      variant="outline"
      className="rounded-full border-blueSky border-2 text-blueSky font-medium hover:bg-blueSky hover:text-white px-6 py-5"
      onClick={scrollToTop} // onClick is allowed in Client Components
    >
      <ArrowUp className="h-6 w-6 shrink-0" /> Scroll to Top
    </Button>
  );
}