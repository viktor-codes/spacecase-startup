"use client";

import { Fragment } from "react";

import { cn } from "@/lib/utils";

export type ConfigureProgressProps = {
  /** One boolean per step, same order as configure flow (sky → order). */
  stepComplete: readonly boolean[];
  labels: readonly string[];
  orientation: "horizontal" | "vertical";
  /** Focus ring on this step: mobile = carousel slide; desktop = first incomplete step. */
  focusedStepIndex?: number | null;
  /** Defaults to `configure-progress` for backwards compatibility. */
  dataTestId?: string;
};

function StepDot({
  index,
  complete,
  isFocused,
}: {
  index: number;
  complete: boolean;
  isFocused: boolean;
}) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] tabular-nums tracking-normal transition-colors",
        complete
          ? "border-brand-pink bg-brand-pink/15 text-brand-pink"
          : "border-(--border-default) bg-surface-raised/40 text-text-secondary",
        isFocused ? "ring-2 ring-brand-pink/45 ring-offset-2 ring-offset-background" : null,
      )}
    >
      {index + 1}
    </span>
  );
}

export default function ConfigureProgress({
  stepComplete,
  labels,
  orientation,
  focusedStepIndex = null,
  dataTestId = "configure-progress",
}: ConfigureProgressProps) {
  const count = Math.min(stepComplete.length, labels.length);

  if (orientation === "vertical") {
    return (
      <nav
        className="flex min-h-[220px] flex-col items-center justify-center py-2 font-mono text-[10px] tracking-[0.18em] text-text-tertiary uppercase"
        aria-label="Configuration progress"
        data-testid={dataTestId}
      >
        <ol className="flex list-none flex-col items-center gap-0 p-0">
          {Array.from({ length: count }, (_, i) => {
            const complete = stepComplete[i] ?? false;
            const label = labels[i] ?? "";
            const segmentDone = i < count - 1 && (stepComplete[i] ?? false);

            return (
              <li key={label} className="flex flex-col items-center">
                <div className="flex flex-col items-center gap-2">
                  <StepDot
                    index={i}
                    complete={complete}
                    isFocused={focusedStepIndex === i}
                  />
                  <span
                    className={cn(
                      "max-w-20 text-center text-[9px] leading-tight sm:text-[10px]",
                      complete ? "text-text-primary" : "text-text-tertiary",
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < count - 1 ? (
                  <span
                    className={cn(
                      "my-2 h-10 w-0.5 shrink-0 rounded-full transition-colors",
                      segmentDone ? "bg-brand-pink/55" : "bg-(--border-default)",
                    )}
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav
      className="w-full px-0.5 font-mono text-[9px] tracking-[0.15em] text-text-tertiary uppercase sm:text-[10px] sm:tracking-[0.18em]"
      aria-label="Configuration progress"
      data-testid={dataTestId}
    >
      {/* Dots + connectors on one row so segment lines align to circle centers, not the full label column. */}
      <div className="flex w-full items-center">
        {Array.from({ length: count }, (_, i) => {
          const complete = stepComplete[i] ?? false;
          const label = labels[i] ?? "";
          const segmentDone = i > 0 && (stepComplete[i - 1] ?? false);

          return (
            <Fragment key={`${label}-track`}>
              {i > 0 ? (
                <span
                  className={cn(
                    "mx-0.5 h-0.5 min-w-[6px] flex-1 self-center rounded-full transition-colors sm:mx-1",
                    segmentDone ? "bg-brand-pink/55" : "bg-(--border-default)",
                  )}
                  aria-hidden
                />
              ) : null}
              <div className="flex w-11 shrink-0 justify-center sm:w-14">
                <StepDot
                  index={i}
                  complete={complete}
                  isFocused={focusedStepIndex === i}
                />
              </div>
            </Fragment>
          );
        })}
      </div>
      <div className="mt-1.5 flex w-full items-start">
        {Array.from({ length: count }, (_, i) => {
          const complete = stepComplete[i] ?? false;
          const label = labels[i] ?? "";

          return (
            <Fragment key={`${label}-caption`}>
              {i > 0 ? (
                <div
                  className="mx-0.5 min-w-[6px] flex-1 sm:mx-1"
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  "line-clamp-2 w-11 shrink-0 text-center text-[8px] leading-tight sm:w-14 sm:text-[9px]",
                  complete ? "text-text-primary" : "text-text-tertiary",
                )}
              >
                {label}
              </span>
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}
