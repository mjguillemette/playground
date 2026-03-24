import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Providers } from "@/providers";
import { router } from "@/router";

export default function App() {
  return (
    <Providers>
      <Suspense fallback={<div className="h-screen bg-zinc-950" />}>
        <RouterProvider router={router} />
      </Suspense>
    </Providers>
  );
}
