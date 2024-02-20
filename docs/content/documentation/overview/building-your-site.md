---
title: Building Your Site
weight: 0
---

# How Inkdocs Builds Your Site

1. Everything in the `static` folder is copied over to the build folder
2. For each file in the `content` folder, a `Parser` is run to generate the html and metadata from it
3. Those routes are then passed to all of the [Craftsmen](#craftsmen-and-artifacts) which create Artifacts
4. Those artifacts are then passed to the [Layouts](#layouts) which build the `Pages`.
5. Those pages are then written to the `build` folder.

# Options

## The baseHtml

Everything starts in the baseHtml. It should look something like:

```html
<html>
  <head>
    <!-- put stuff for your head here -->
  </head>
  <body>
    {slot}
  </body>
</html>
```

Whenever inkdocs builds a page, it swaps the result of the layout into the `{slot}` tag. Additionally, some plugins will add custom scripts to the head, so it's important that your `<head>` be defined in the baseHtml.

## Server options

Server options should look like:

```ts
const options = {
  ...
  server = {
    port: 3000,  // the port to serve on
    devserverPort: 8008,  // the port the devserver listens on
  },
  ...
}
```

When running the devserver, server options are only reloaded when you restart the devserver

## The Layout Tree

Each file chooses a layout using the steps shown [here](/documentation/writing-content#choosing-your-layout)

The route tree is a part of how inkdocs looks at layouts. For example, the route tree for this site looks like:

```ts
layoutTree: {
  path: "", // the root path
  layoutName: "",
  children: [
    {
      path: "documentation", //everything in the /documentation route will use the layout named "docs"
      layoutName: "docs",
      children: [],
    },
    {
      path: "blog",
      layoutName: "blogpost",
      children: [],
    },
  ],
},
```

# Routers

Routers are special plugins that will handle all of the parsing for you. There are two you can choose from by default:

- [Swap Router](/documentation/plugins/swap-router) (recommended)
- [Standard Router](/documentation/plugins/standard-router)

Most of the advantages of inkdocs are brought by the swap router, so it is recommended that you use it. If you know what you're doing however, you can just use the standard router or no router if you want to build the parser yourself.

# Layouts

Layouts are the core building blocks of inkdocs. If you've used any component based web framework before (React, Vue, Solid, Svelte), they should look pretty familiar:

```tsx
const MyLayout: Layout = (
  children: JSX.Element,  // the "content" of the page built by the parser
  metadata: any,  // metadata provided by the parser
  artifacts: Map<string, any>,  // artifacts provided by craftsmen
  filepath: string,  // the filepath that the page will be written to
) {
  // returns JSX
  return (
    <p>Hello world</p>
  )
}

export MyLayout
```

Layouts need to be defined in the options with a name that can be referenced by the metadata of content or the layout tree. This is done using a map:

```ts
layouts: new Map([
  ["default", DefaultLayout],
  ["docs", DocsLayout],
  ["landing", LandingLayout],
  ["blogpost", BlogLayout],
]),
```

You can define all of your layouts in separate files or put everything in the `inkdocs.ts` file. Inkdocs does not care.

# Craftsmen and Artifacts

While layouts can build single pages, sometimes you need large components in your layout that need to look at every single route. That's where Craftsmen come in. This site uses a craftsman for the sidebar that looks like:

```tsx
export default function Sidebar(_: InkdocsOptions, routes: Route[]): Artifact {
  const routeTree = makeRouteTree(routes); // other function defined later in the file that I'm not including

  // find the tree that is the segment "documentation"
  let documentationTree: RouteTree[] = [];
  for (let i = 0; i < routeTree.length; i++) {
    if (routeTree[i].segment === "documentation") {
      documentationTree = routeTree[i].children;
    }
  }
  sortTree(documentationTree);

  const sidebar = (
    <div class="flex flex-col bg-background">
      <h1 class="m-2 text-2xl">
        <label
          for="drawer-toggle"
          class="lg:hidden drawer-button inline btn btn-primary"
        >
          Close Drawer
        </label>
        Documentation
      </h1>
      {documentationTree.map((tree) => (
        <SidebarItem depth={0} tree={tree} />
      ))}
    </div>
  );

  return {
    name: "sidebar",
    data: sidebar,
  };
}
```

It is then defined in the options with:

```ts
craftsmen: [Sidebar],
```

That artifact is precomputed before all of tha layouts and can then be used by then:

```tsx
const DocsLayout: Layout = (
  children: JSX.Element,
  metadata: any,
  artifacts,
) => {
  const sidebar = artifacts.get("sidebar") as JSX.Element; // here
  return (
    <Root>
      <div class="drawer lg:drawer-open">
        <input type="checkbox" id="drawer-toggle" class=" drawer-toggle" />

        <div class="drawer-content">
          <label
            for="drawer-toggle"
            class="drawer-button inline lg:hidden btn btn-primary"
          >
            Open Drawer
          </label>

          <article id="content" class="prose prose-invert mx-auto">
            <title>Inkdocs | {metadata.title ?? "Untitled"}</title>
            {children}
          </article>
        </div>

        <div class="drawer-side h-full">{sidebar}</div>
      </div>
    </Root>
  );
};
```

The main disadvantage of artifacts is that they are not typed properly. This is because I am stupid. One day I will figure out how to make then typed properly.
