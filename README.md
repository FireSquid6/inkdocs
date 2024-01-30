# Inkdocs

Inkdocs is a static site generator built for documentation. It is currently in early development with an expected 1.0 release at the end of January 2024. It is actively maintained by [firesquid](https://github.com/firesquid6) with help from others from [Hack Club](https://github.com/hackclub).

## Features

- uses no framework. It ships **0** javascript to the frontend by default, and only ships htmx if you use the swap router.
- ships your docs as a multi page application and does server side routing
- uses markdown by default, but can use any other markup if you have a parser for it.
- can be extensively styled and customized or just used out of the box.
- can be easily extended with plugins to add hyperscript, tailwind, or any other functionality you may need

Coming soon:

- mdx support plugin
- internationalization plugin

## The Swap Router

While the swap router is an optional "plugin," it is the main brain of Inkdocs and it is recommended that you use it. The swap router uses htmx to hijack all `a` tags in your page and make them only swap out the content that's changing. Let's imagine the follwoing html page:

```html
<html>
<head>
    <title>Example Inkdocs</title>
    <link rel="stylesheet" href="/styles.css">
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
</head
<body cz-shortcut-listen="true">
<main id="layout">
    <div>Pretend I'm some really cool sidebar</div>
    <article id="content">
        <h1>Blog</h1>
        <p>This is some blog stuff you may need idk</p>
        <a href="/docs">Back to the docs</a>
        <a href="/blog/another">Check Out Another Blog Post</a>
    </article>
</main>

</body>
</html>
```

When we visit another blog post, we really only need to change what's inside of the `article`. When we visit a page with a different layout (say /docs), then we only need to change what's inside of the `main` tag. The swap router is smart and will perform an `hx-swap` with the article when visiting another blog post, and swap the main when visiting a different page.

# Contributing

Contributing will be kinda a mess until the 1.0. Contact @firesquid6 on discord if you think this project is cool and you'd like to help out.

## Setting Up

If you're on nixos or using the nix package manager, just run `nix-shell` to start using all of the appropriate dependencies. You can also allow the .envrc if you'd like. Other users should read the comments of the `shell.nix` file and install the dependencies however is convienient.

## Guide to This Repo

- `/docs` - contains the documentation website for inkdocs (which is built in inkdocs)
- `/packages` - contains all of the packages for inkdocs
  - `/inkdocs` - the core of inkdocs. Contains the code for building and serving code as well as some of the core plugins
  - `/devserver` - contains the code for the `inkdocs-devserver` package on npm. Helps with the inkdocs DX by adding the automatic reloading seen in stuff like vite.
  - `/create-inkdocs` - cli for bootstrapping new inkdocs sites

# Deploying

Coming soon. This will be handled using docker and/or vercel.

# Acknowledgements

Inkdocs stands on the shoulders of many giants including Elysia, oven-sh, and htmx.
