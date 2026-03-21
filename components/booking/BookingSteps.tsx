import { cn } from "@/lib/utils";

const steps = ["Service", "Schedule", "Details"];

export function BookingSteps({ step }: { step: number }) {
  return (
    <ol className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                active && "bg-teal-700 text-white",
                done && "bg-teal-100 text-teal-900",
                !active && !done && "bg-zinc-200 text-zinc-600",
              )}
            >
              {n}
            </span>
            <span
              className={cn(
                "hidden text-sm font-medium sm:inline",
                active ? "text-zinc-900" : "text-zinc-500",
              )}
            >
              {label}
            </span>
            {i < steps.length - 1 && <span className="hidden h-px w-6 bg-zinc-200 sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}
