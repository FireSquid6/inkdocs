---
title: Writing Content
weight: -200
---

By default, inkdocs will parse `.md` files and `.yaml` files. If you're using the standard router, inkdocs will also parse `.html` files

# Filesystem

Suppose we have the following filesystem:

```
/content
    index.md
    about.md
    /docs
        index.md
        install.md
        getting-started.md
```

Assuming your `contentFolder` is set to `content` in inkdocs options, this will render the following routes:

```
/ -> index.md
/about -> about.md
/docs -> /docs/index.md
/docs/install -> /docs/install
/docs/getting-started -> /docs/getting-started
...
```

# Choosing Your Layout

Inkdocs layouts are how

Inkdocs uses the following formula to figure out what layout (defined in your options) to use for each page:

1. If the metadata for the page contains a `layout`
2. Check `layout_tree` in options based on the filepath
3. Just use whatever layout is marked as default in the options

For more on layouts, see [building your site](/documentation/building-your-site#layouts)

# Markdown

Markdown files are parsed using inkdown, an internal library built on top of [marked](https://marked.js.org/) and turned into html strings.

To add metadata to markdown, use yaml at the top:

```md
---
title: hello world
layout: MyLayout
---

some standard markdown text

# A Big header
```

## Swap Router Components

If you're using the swap router, you can add custom components to your markdown. See [Recpies](/documentation/recpies) for more information.

## Why no mdx?

mdx is not supported by inkdocs because I found it too hard and confusing to deal with. This is probably just because I am lazy and stupid, so if you'd like to add support for it, feel free to do so.

# yaml

Yaml files are just parsed as metadata with no content. This is useful if you have an index file that just needs metadata but is handled entirely by the layout.
