---
title: Deployment
weight: -10
---

Inkdocs can be deployed through docker or just as a static site on something like vercel or netlify.

# Deploying to Vercel

## Create the Project

Create a new project at [vercel.com/new](https://vercel.com/new). Select the github repo your project is on and continue.

## Configuring the Project

You should set the build command to `bun run build`, the output directory to whatever your `buildFolder` is in your inkdocs options (this is typically `build`). You should also set your install command to `bun install`.

![Vercel Deploy Options](/images/vercel_deploy_options.png)

Once you hit Deploy, your site should be live! See [the vercel docs](https://vercel.com/docs) for more configuration information.

# Deploying with Docker

The default template comes prebuilt with a dockerfile. You shouldn't need to edit the Dockerfile at all. It is built off of [elysia's dockerfile](https://elysiajs.com/integrations/docker). If you know what you're doing, feel free to edit it. You can then deploy your docker image to whatever platform you usuall use for that.

## Deploying to fly.io

See [fly.io's docs](https://fly.io/docs/) for this. You'll just need to create and account and run a couple commands.
