# What is Inkdocs?

Inkdocs is an incredibly fast static site builder specifically geared towards building documentation sites (although it can be used for more!) just like [docusaurus](https://docusaurus.io/) or [starlight](https://starlight.astro.build/).

It is:

- easy to get up and running if you just need content on the internet
- easy to customize to create a hand-crafted user experience
- incredibly fast (NO javascript to the browser by default)
- deployable through docker

# How does it work?

Inkdocs can work either by using what is called the "Swap Router" or the "Standard Router."

The standard router is very simple. It takes in requests and returns the built html.

On the other hand, the swap router is a little more complicated. It uses [htmx](https://htmx.org/) to hijack all links at the time of parsing and instructs them to either swap out the the content of the page, or the entire layout. This means that whenever you go to a new page, the server responds with the minimal amount of actually changing content. This allows you to get the routing speed of an SPA with the initial page load speed of an MPA.
