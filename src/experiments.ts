/**
 * Experiment registry — the single source of truth for all playground experiments.
 *
 * To add a new experiment:
 *   1. Create src/views/experiments/<id>/index.tsx
 *   2. Add an entry here
 *   3. Add a lazy route in src/router.tsx
 *
 * That's it.
 */

export type Contributor = "MG" | "MJ";

export interface Experiment {
  id: string;
  title: string;
  description: string;
  tags: string[];
  contributors: Contributor[];
  path: string;
  /** Optional — shown as a muted label (e.g. "WIP", "stable") */
  status?: "wip" | "stable" | "archived";
}

export const CONTRIBUTORS: Record<Contributor, { name: string; color: string }> = {
  MG: { name: "Mike G", color: "#818cf8" },
  MJ: { name: "Mike J", color: "#34d399" },
};

export const experiments: Experiment[] = [
  {
    id: "r3f-scene",
    title: "R3F Particle Scene",
    description:
      "Animated WebGL scene — wireframe icosahedron, orbital rings, and a drifting particle field. First proof-of-concept for the 3D layer.",
    tags: ["3D", "R3F", "WebGL"],
    contributors: ["MG"],
    path: "/experiments/r3f-scene",
    status: "stable",
  },
];
