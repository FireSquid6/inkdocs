---
title: Getting Started
---

# Creating a Project

Creating an inkdocs project is simple. Just run:

```bash
bunx create-inkdocs
```

This CLI will guide you through creating an inkdocs app. It's recommended that you use the swap router. Routing will be explained in more detail in [Building Your Site](/documentation/building-your-site).

# Writing content

If you used the recommended template, just create markdown files in the `content` folder

# Scripts

The default template provides three scripts in the `scripts` folder: `serve`, `build`, and `dev`. You probably won't ever need to edit these files, but they are left open in case you need to.

## Building and Serving

To build and serve inkdocs, just run:

```bash
bun run build
bun run serve
```

This is exactly how inkdocs is built and served in production (assuming you deploy with docker. Netlify and Vercel have their own servers), so it is a good way to find production only issues.

## Using the Devserver

For the devserver to work properly, you need to be using the devserver plugin. This will be on by default. Don't worry, it won't affect anything in production.

To start the devserver, run:

```bash
bun run dev
```

Then open up `localhost:3000` on your preferred web browser. The devserver injects a special client script that communicates with a websocket (typically on port 8008) that tells the page when to reload.
