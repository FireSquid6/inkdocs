---
title: Header Ids
---

# Usage

```ts
import headerIds from "inkdocs/plugins/header-ids"
// inkdocs.ts
const options: InkdocsOptions = {
  ...
  plugins: [headerIds({
    parentId: "content"  // everything that is a child of the element with this id will get an id corresponding to their header.
  })]
  ...
}
```

# Explanation

The header ids plugin gives all of your headers under the corresponding id a header that can be linked to. For example:

```html
<div id="content">
  <h1>Something cool</h1>
  <h2>Something else that's cool</h2>
  <h3>another header</h3>
</div>
```

Becomes:

```html
<div id="content">
  <h1 id="something-cool">Something cool</h1>
  <h2 id="something-else-that-s-cool">Something else that's cool</h2>
  <h3 id="another-header">another header</h3>
</div>
```

The algorithm for making this id from the text in the header is:

```ts
function idFromText(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "-");
}
```
