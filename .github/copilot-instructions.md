# Copilot instructions

Project context Copilot should apply to every session in this repository.

## Stack

- Framework: Astro (static output).
- Language: TypeScript.
- Styling: plain CSS in the base layout.

## Conventions

- Keep components small and focused.
- Prefer semantic HTML and accessible markup.
- Do not close, or add closing keywords for, the exercise walkthrough issue (issue #1) in any pull request. The exercise's GitHub Actions workflows manage that issue. When you open a pull request for app work, link only the specific app work-item issue you are implementing.

## Persistence and hydration rules

- Persist bookmarks in browser `localStorage` as records containing the original URL and locally generated short slug. Treat `localStorage` as the persistence source; do not add a backend or external URL-shortening service.
- Keep all browser API access in client-side code that runs after hydration or in browser event handlers. Never access `window`, `localStorage`, or other browser APIs in Astro frontmatter or code executed during the static build. Render a safe initial state that does not depend on browser storage.
