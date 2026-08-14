import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

type NotPrintableProps = {
  children: ReactNode;
};

export function NotPrintable({ children }: NotPrintableProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className="hidden h-full w-full items-center justify-center bg-white p-8 print:flex"
      >
        <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-sky-wash/40">
            <ShieldAlert className="size-6 text-cyan-edge" />
          </span>
          <p className="text-sm font-medium text-ink-black">
            This content is protected to prevent unauthorized printing.
          </p>
        </div>
      </div>
      <div className="print:hidden">{children}</div>
    </>
  );
}
