# Inkdown

A wrapper around [marked](https://marked.js.org/) that allows you to give your markdown custom components. Custom components should be called like:

```md
some regular markdown text

%%% my-component
:: key = value

# A header in my component

a paragram in my component
%%%
```
