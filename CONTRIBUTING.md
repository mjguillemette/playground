# Contributing to Comprehension Framework

## Commit Convention

Every commit in this repo must include the **prompt that produced it** in the commit message body. This serves as a living audit trail — anyone reading git history can see exactly what was asked for and reproduce or iterate on the result.

### Format

```
<type>: <short description>

<what was built / changed and why>

---
Prompt:
<paste the exact prompt that produced this commit, verbatim>
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `refactor` | Code change with no behavior difference |
| `style` | Styling / CSS only |
| `chore` | Tooling, config, deps |
| `docs` | Documentation only |

### Rules

1. **One prompt → one commit.** Don't batch unrelated prompts into a single commit.
2. **Paste the prompt verbatim.** Don't summarize it — future contributors need to be able to re-run it.
3. **Commit only if the result works.** Run the dev server and verify before committing.
4. **If a prompt required follow-up to fix errors**, include all turns of the conversation in the prompt block, separated by `---`.

### Example

```
feat: initial project scaffold with Vite + React 18 + R3F

Set up the full src/ directory structure: components, hooks, lib (Supabase
client, TanStack Query factory), Zustand store, providers, and types stubs.
Added a landing page with an animated react-three-fiber scene (wireframe
icosahedron, orbital rings, particle field) over a dark hero layout.

Stack: Vite 6, React 18, R3F v8, Tailwind CSS v3, TanStack Query v5,
Zustand v5, Supabase JS, Framer Motion.

---
Prompt:
Create the following tree for getting started on a new project:

src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/ui/
├── hooks/
│   └── index.ts
├── lib/
│   ├── query/client.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── utils.ts
├── middleware.ts
├── providers/index.tsx
├── store/
│   ├── slices/app-slice.ts
│   └── index.ts
└── types/
    ├── database.ts
    └── index.ts

Install all dependencies. The project is going to use react-three-fiber
for 3d elements. Also install that, and create a landing page that will
be the slate of our project.

---
(follow-up after stack compatibility issues)

Maybe just start from scratch with the issues we have come up against in
mind? Is there a better stack to go with that would cause less issues?
Nothing is locked in so far - we're just getting a basic starting block
going.
```

---

## Development Setup

```bash
npm install
npm run dev
```

Fill in `.env.local` with your Supabase credentials before running features that require auth:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
