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
Everything starts in the baseHtml. It is where most of your 
## Server options
Server options should look like:
```ts
const options = {
  ...
  server = {
    port = 3000,  // the port to serve on
    apiRoutes: [  // if you just need to give elysia extra routes, you can use this
      route: "/api/something",
      verb: "GET",
      handler: () => {
        return "hello world"
      }
    ]
  },
  ...
}
```
You can defined the port to use as well as any extra ApiRoutes that your application may need
## The Layout Tree
Each file chooses a layout using the steps shown [here](/documentation/writing-content#choosing-your-layout)

The route tree is a part of how inkdocs looks at layouts.

# Routers
Routers are special plugins that will handle all of the parsing for you. There are two you can choose from by default:
 - [Swap Router](/documentation/plugins/swap-router) (recommended)
 - [Standard Router](/documentation/plugins/standard-router)
# Layouts

# Craftsmen and Artifacts
