// resources/js/components/ui/toaster.tsx
import React from "react";

export interface ToasterProps {
  children?: React.ReactNode;
}

export function Toaster({ children }: ToasterProps) {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 w-full max-w-xs">
      {children}
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="bg-white border rounded-md shadow-lg p-4">
      {message}
    </div>
  );
}
