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
- (x) server
- (x) filepath to route
- (x) filesystem interface
- (x) build system
- ( ) plugin interface
  - ( ) search plugin
  - ( ) mdx plugin
  - ( ) norg plugin
  - ( ) in8n plugin
- (x) 404 page support and handling

## New Intelligent Router System

See ./page.svg for a "skeleton" of how a page should look. The green represents the base html defined by this user. This is never changed. The purple represents the layout defined by the user. This only changes when it needs to. The blue represents the actual contnet of the page. This only changes if a request to a page with a different layout is made. The blue represents the actual content of a page.

- ( ) New Layouts
  - A "layout" exports two functions:
  - `page` - which takes in a `content`, `metadata`, `filepath`, and `artifacts`
  - `content` - which takes in the arguments `html`, `metadata`, and `filepath`
  - When switching to a page of the same layout, we just swap out the content. When switching
  - pages are built by first calling the `content` function and then calling the `page function`
- ( ) Use htmx in markdoc
  - hx-swap tags are automatically added for all `a` tags. If the a tag links to a page of the same layout, we swap the content. If it links to a page of a different layout, we swap the whole page (excluding base html)
  - This should get the benefits of an SPA while also getting the benefits of an MPA
- ( ) New server
  - /api/\* - routes to user defined api routes that can return json, html, or whatever
  - /@pages/\* - routes to built pages used for hx swapping
  - /@content/\* - routes to built content used for hx swapping
  - /@components/\* - routes to user defined components
- ( ) Components

  - Custom components can be called using code blocks, much like the way mdx works. For example, the markdown:

  ````markdown
  ```inkdocs
  cool-graph

  ---

  type: scatter
  year: 2024
  ```
  ````

  would hx-swap on page load for the `cool-graph` component. It would be passed the props `type: scatter` and `year: 2024`. All text after the `---` is parsed as yaml. This may require shipping some custom javascript on the client.

- ( ) Remove custom parsers
  - They won't work with new custom htmx rendering

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
