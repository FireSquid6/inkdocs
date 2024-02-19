---
title: Deployment
weight: -10
---

Inkdocs can be deployed through docker or just as a static site on something like vercel or netlify.

# Deploying to Vercel

# Deploying with Docker

The default template comes prebuilt with a dockerfile. You shouldn't need to edit the Dockerfile at all. It is built off of [elysia's dockerfile](https://elysiajs.com/integrations/docker). If you know what you're doing, feel free to edit it. You can then deploy your docker image to whatever platform you usuall use for that.

## Deploying to fly.io

See [fly.io's docs](https://fly.io/docs/) for this. You'll just need to create and account and run a couple commands.
