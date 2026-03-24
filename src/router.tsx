import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Shell } from "@/components/layout/Shell";
import { Home } from "@/views/Home";

/**
 * Add a lazy import + route here whenever you add an experiment to experiments.ts.
 */
const R3FScene = lazy(() =>
  import("@/views/experiments/r3f-scene").then((m) => ({ default: m.R3FScene }))
);

const IsoBoard = lazy(() =>
  import("@/views/experiments/iso-board").then((m) => ({ default: m.IsoBoard }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Shell />,
    children: [
      { index: true, element: <Home /> },
      { path: "experiments/r3f-scene", element: <R3FScene /> },
      { path: "experiments/iso-board", element: <IsoBoard /> },
    ],
  },
]);
