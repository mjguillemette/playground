import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createAppSlice, type AppSlice } from "./slices/app-slice";

type Store = AppSlice;

export const useStore = create<Store>()(
  devtools(
    persist(
      (...a) => ({
        ...createAppSlice(...a),
      }),
      { name: "cf-store" }
    )
  )
);
