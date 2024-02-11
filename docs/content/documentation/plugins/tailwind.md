---
Title: TailwindCSS
---
# Enabling
1. add the plugin:
```ts
import tailwind from "inkdocs/plugins/tailwind"
// inkdocs.ts
const options: InkdocsOptions = {
  ...
  plugins: [tailwind({
    inputFile: "styles.css",  // relative to static folder
    outputFile: "styles.css",  // relative to build folder
  })]
  ...
}
```
2. add a `tailwind.config.js` file to the root of your project
```js
module.exports = {
  content: ["./**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```
3. Add the tailwind directives to your specified stylesheet:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```


# Explanation
This is just a quick and simple way to use [Tailwind CSS](https://tailwindcss.com/) in your inkdocs project. It is essentially just running `bunx tailwindcss -i {your input css} -o {your output css}` whenever inkdocs builds.