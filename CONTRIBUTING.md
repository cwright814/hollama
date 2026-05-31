## Contributing

Here's ways in which you can contribute:

- Found a **bug** or have a **feature request**?
  1. Search for it in the [existing issues](https://github.com/fmaclen/hollama/issues)
  2. Open a [new issue](https://github.com/fmaclen/hollama/issues/new) if it doesn't yet exist
- Comment or upvote [existing issues](https://github.com/fmaclen/hollama/issues) _(active issues will likely be prioritized)_
- Submit a [pull request](https://github.com/fmaclen/hollama/pulls) _(please discuss in an issue first)_

## Developing

Hollama is a static site built with:

- TypeScript
- Svelte & SvelteKit
- Vite
- Tailwind CSS
- Playwright
- Electron

Install dependencies with `pnpm install`, start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open

# run the app with Electron
pnpm electron
```

## Building

To create a production version of Hollama:

```bash
pnpm build

# or package with Electron
pnpm electron:build
```

You can preview the production build with `pnpm preview`.
