---
title: Inkdocs working notes
author: firesquid6
description: My working notes for inkdocs while I was making the prototype and initial version of inkdocs.
---

See [the exscalidraw](https://excalidraw.com/#json=vLl1eq1dLLDo3hOySVoLH,SXJzVd3g2NH7nvJ8IWnngg) for information on how the building process should work.

# Unanswered Questions

- How do you deploy elysia to vercel?
  - The answer is probably docker but idrk how that works
- Will the server store the built files in memory, or load them from disk every time?
  - Maybe this could be a toggle. tbh I wouldn't think it would matter that much since we're dealing with kilobytes at most
- How do we get tailwind working?

# Main metrics:

- Build time
- Response time

# Todo

- ( ) Parsers
  - ( ) html parser
  - ( ) yaml parser
  - ( ) markdown parser
- ( ) Layout support
- ( ) create-inkdocs-app
- ( ) Server
- ( ) filepath to route
- ( ) filesystem interface

# Places to share once finished

- Hack Club
- Linkedin
- Ethan's Discord

# Documentation for Inkdocs

Documentation should address the following goals to the reader, in order:

1. How do I get my markdown files on the internet?
2. How do I theme those pages?
3. How do I add custom stuff

Pages:

- Getting Started
  - Quickstart
  - Build it Yourself
- Writing Content
- Building Your Site
  - Parsers
  - The base file
  - Layouts
  - Craftsmen and Artifacts
- Deployment
- Recipes
  - Using tailwind
  - Using a custom parser
- Contributing

Of course, the documentation site for inkdocs should be made with inkdocs.

- Features
  - Fast: Inkdocs uses bun for building and elysia for its server.
  - Flexible: Don't be stuck in a Hugo or Wordpress theme. Inkdocs makes it easy to build your own themes
  - Easy: Just need markdown files on the internet? Inkdocs can get you up in minutes.
