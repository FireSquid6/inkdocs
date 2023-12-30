---
title: Inkdocs working notes
author: firesquid6
description: My working notes for inkdocs while I was making the prototype and initial version of inkdocs.
---

See [the exscalidraw](https://excalidraw.com/#json=vLl1eq1dLLDo3hOySVoLH,SXJzVd3g2NH7nvJ8IWnngg) for information on how the building process should work.

# Main metrics:

- Build time
- Response time

# Todo

- (x) Parsers
  - (x) html parser
  - (x) yaml parser
  - (x) markdown parser
- (x) Layout support
- ( ) create-inkdocs-app
- ( ) server
- (x) filepath to route
- (x) filesystem interface
- (x) build system
- ( ) plugin interface
  - ( ) search plugin
  - ( ) mdx plugin
  - ( ) norg plugin
  - ( ) in8n plugin
- ( ) 404 page support and handling
- ( ) server caching

# Places to share once finished

- Hack Club
- Linkedin
- Ethan's Discord

# Plugins

Plugins should be able to:

- Add layouts and craftsmen (essentially act as a theme)
- Add special api routes to the server

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
  - Using a plugin
  - Dealing with translations
- Contributing

Of course, the documentation site for inkdocs should be made with inkdocs.

- Features
  - Fast: Inkdocs uses bun for building and elysia for its server.
  - Flexible: Don't be stuck in a Hugo or Wordpress theme. Inkdocs makes it easy to build your own themes
  - Easy: Just need markdown files on the internet? Inkdocs can get you up in minutes.
