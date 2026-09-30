import { cn } from "@/lib/utils";

// ------------------------------------------------
// projects/dremnik/src/components/terminal/panel.tsx
//
// One window of the terminal: an amber title strip with a function code,
// and a black body.
// ------------------------------------------------

export function Panel({
  code,
  title,
  right,
  id,
  className,
  children,
}: {
  code: string;
  title: string;
  right?: React.ReactNode;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-label={title} className={cn("drem-panel flex min-w-0 flex-col", className)}>
      <header className="drem-panel-title flex items-center justify-between gap-2">
        <h2 className="truncate">
          <span className="drem-code">{code}</span> {title}
        </h2>
        {right}
      </header>
      <div className="min-w-0 flex-1 p-2.5">{children}</div>
    </section>
  );
}
