import { NavLink, useLocation } from "react-router-dom";
import { experiments, CONTRIBUTORS, type Contributor } from "@/experiments";

const statusDot: Record<string, string> = {
  stable: "bg-emerald-500",
  wip: "bg-amber-400",
  archived: "bg-zinc-600",
};

function ContributorBadge({ id }: { id: Contributor }) {
  const c = CONTRIBUTORS[id];
  return (
    <span
      title={c.name}
      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-zinc-900"
      style={{ backgroundColor: c.color }}
    >
      {id}
    </span>
  );
}

export function Sidebar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <aside className="flex h-screen w-52 shrink-0 flex-col border-r border-white/5 bg-zinc-950">
      {/* Logotype */}
      <NavLink
        to="/"
        className="flex items-center gap-3 px-5 py-5 group"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/20 ring-1 ring-indigo-500/30">
          <span className="text-xs font-black tracking-tighter text-indigo-400">PG</span>
        </div>
        <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
          playground
        </span>
      </NavLink>

      <div className="mx-4 mb-3 border-t border-white/5" />

      {/* Home link */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
              isActive
                ? "bg-white/5 text-white"
                : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200"
            }`
          }
        >
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          All experiments
        </NavLink>

        {/* Experiments list */}
        <div className="pt-4">
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Experiments
          </p>
          {experiments.map((exp) => (
            <NavLink
              key={exp.id}
              to={exp.path}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-300"
                    : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200"
                }`
              }
            >
              <span className="flex items-center gap-2 truncate">
                {exp.status && (
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[exp.status] ?? "bg-zinc-600"}`} />
                )}
                <span className="truncate">{exp.title}</span>
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Contributors footer */}
      <div className="border-t border-white/5 px-4 py-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          Contributors
        </p>
        <div className="flex gap-1.5">
          {(Object.keys(CONTRIBUTORS) as Contributor[]).map((id) => (
            <ContributorBadge key={id} id={id} />
          ))}
        </div>
      </div>
    </aside>
  );
}
