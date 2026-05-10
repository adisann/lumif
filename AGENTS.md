<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Figma and UI Guidelines

When implementing Figma designs or UI components:
- Our core UI system is **shadcn/ui** with **Tailwind CSS**. Prefer using or creating shadcn components under `src/components/ui/` rather than writing custom HTML components from scratch.
- We use **Lucide React** (`lucide-react`) for icons.
- Check out `src/app/globals.css` for design system tokens!
  - We use `oklch` syntax across standard semantic token names (e.g., `--background`, `--primary`).
  - Available animations: `fadeIn`, `slideUp`, `fadeInUp`, and `pulse-soft`.
  - Typography uses variables: `var(--font-lexend)` for sans, `var(--font-poppins)` for headings, and `var(--font-geist-mono)` for monospace.
