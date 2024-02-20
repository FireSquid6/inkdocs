---
title: Swap Router
---

# Enabling

The swap router is a paradigm shift in how you build your website

```ts
import swapRouter from "inkdocs/plugins/swap-router"
// inkdocs.ts
const options: InkdocsOptions = {
  ...
  plugins: [swapRouter()]
  ...
}
```

3. use [swap link](/documentation/components/swap-link) for all of your `<a>` tags

# Explanation

While the swap router is an optional "plugin," it is the main brain of Inkdocs and it is recommended that you use it. The swap router uses htmx to hijack all `a` tags in your page and make them only swap out the content that's changing. Let's imagine the following html page:

```html
<html>
  <head>
    <title>Example Inkdocs</title>
    <link rel="stylesheet" href="/styles.css" />
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  </head>
  <body>
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
