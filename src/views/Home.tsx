import { Link } from "react-router-dom";
import { experiments, CONTRIBUTORS, type Experiment } from "@/experiments";

const statusLabel: Record<string, string> = {
  stable: "stable",
  wip: "wip",
  archived: "archived",
};

const statusStyle: Record<string, string> = {
  stable: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
  wip: "text-amber-400 bg-amber-400/10 ring-amber-400/20",
  archived: "text-zinc-500 bg-zinc-500/10 ring-zinc-500/20",
};

function ExperimentCard({ exp }: { exp: Experiment }) {
  return (
    <Link
      to={exp.path}
      className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-200 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04]"
    >
      {/* Status badge */}
      {exp.status && (
        <span
          className={`absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${statusStyle[exp.status]}`}
        >
          {statusLabel[exp.status]}
        </span>
      )}

      <div>
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="mb-2 text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
          {exp.title}
        </h2>
        <p className="text-sm leading-relaxed text-zinc-500">{exp.description}</p>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-1.5">
          {exp.contributors.map((id) => (
            <span
              key={id}
              title={CONTRIBUTORS[id].name}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-zinc-900"
              style={{ backgroundColor: CONTRIBUTORS[id].color }}
            >
              {id}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs text-zinc-600 transition-colors group-hover:text-indigo-400">
          Open
          <svg className="h-3.5 w-3.5 translate-x-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function Home() {
  return (
    <div className="min-h-full px-10 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-zinc-100">Experiments</h1>
        <p className="mt-1 text-sm text-zinc-500">
          A sandbox for exploring patterns, ideas, and half-baked things.
        </p>
      </div>

      {/* Grid */}
      {experiments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {experiments.map((exp) => (
            <ExperimentCard key={exp.id} exp={exp} />
          ))}

          {/* New experiment prompt card */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-6 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
              <svg className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-600">New experiment</p>
            <p className="mt-1 text-xs text-zinc-700">
              Add an entry to <code className="text-zinc-600">src/experiments.ts</code>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-zinc-600">No experiments yet.</p>
          <p className="mt-1 text-sm text-zinc-700">
            Add one to <code>src/experiments.ts</code> to get started.
          </p>
        </div>
      )}
    </div>
  );
}
