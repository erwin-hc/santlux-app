import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// ─── Variants ────────────────────────────────────────────────────────────────

const loaderVariants = cva("inline-flex items-center justify-center", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    },
    color: {
      default: "text-foreground",
      primary: "text-primary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

export interface LoaderProps extends VariantProps<typeof loaderVariants> {
  variant?:
    | "spinner"
    | "dots"
    | "pulse"
    | "gear"
    | "ring"
    | "bars"
    | "bounce"
    | "wave"
    | "orbit"
    | "ripple";
  className?: string;
  label?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpinnerLoader({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={cn("animate-spin", className)}
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function DotsLoader({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[0.3em] h-[0.3em] rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function PulseLoader({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "block rounded-full bg-current animate-ping opacity-75",
        className,
      )}
    />
  );
}

function GearLoader({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("animate-spin", className)}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
      />
    </svg>
  );
}

function RingLoader({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ring-spin {
          0% { stroke-dashoffset: 60; transform: rotate(0deg); }
          50% { stroke-dashoffset: 10; }
          100% { stroke-dashoffset: 60; transform: rotate(360deg); }
        }
        .ring-path {
          transform-origin: center;
          animation: ring-spin 1.2s linear infinite;
          stroke-linecap: round;
        }
      `}</style>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.2"
      />
      <circle
        className="ring-path"
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="60"
        strokeDashoffset="40"
      />
    </svg>
  );
}

function BarsLoader({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-end gap-[2px]", className)}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[0.2em] bg-current rounded-sm"
          style={{
            height: "0.7em",
            animation: "bars-scale 0.8s ease-in-out infinite alternate",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bars-scale {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </span>
  );
}

function BounceLoader({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[0.3em] h-[0.3em] rounded-full bg-current"
          style={{
            animation: "bounce-ud 0.7s ease-in-out infinite alternate",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce-ud {
          from { transform: translateY(0); }
          to   { transform: translateY(-0.4em); }
        }
      `}</style>
    </span>
  );
}

function WaveLoader({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-[2px]", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-[0.18em] h-[0.7em] bg-current rounded-full"
          style={{
            animation: "wave 1s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50%       { transform: scaleY(1); }
        }
      `}</style>
    </span>
  );
}

function OrbitLoader({ className }: { className?: string }) {
  return (
    <span className={cn("relative block", className)} aria-hidden="true">
      <span className="block w-full h-full rounded-full border-2 border-current opacity-20" />
      <span
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-current"
        style={{ animation: "spin 1s linear infinite" }}
      />
      <span
        className="absolute inset-[15%] rounded-full border-2 border-transparent border-b-current"
        style={{ animation: "spin 1.5s linear infinite reverse" }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}

function RippleLoader({ className }: { className?: string }) {
  return (
    <span className={cn("relative block", className)} aria-hidden="true">
      {[0, 1].map((i) => (
        <span
          key={i}
          className="absolute inset-0 rounded-full border-2 border-current"
          style={{
            animation: "ripple 1.2s ease-out infinite",
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes ripple {
          0%   { transform: scale(0); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const VARIANTS = {
  spinner: SpinnerLoader,
  dots: DotsLoader,
  pulse: PulseLoader,
  gear: GearLoader,
  ring: RingLoader,
  bars: BarsLoader,
  bounce: BounceLoader,
  wave: WaveLoader,
  orbit: OrbitLoader,
  ripple: RippleLoader,
} as const;

export function Loader({
  variant = "spinner",
  size,
  color,
  className,
  label = "Carregando…",
}: LoaderProps) {
  const Component = VARIANTS[variant] ?? SpinnerLoader;

  return (
    <span
      role="status"
      aria-label={label}
      className={cn(loaderVariants({ size, color }), className)}
    >
      <Component className="w-full h-full" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
