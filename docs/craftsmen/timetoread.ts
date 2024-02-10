import { Craftsman } from "inkdocs";

const AVERAGE_READING_SPEED = 300; // words per minute. Average reader is 238. We engineers are faster than mere mortals, so I put it at 300.

export const timetoread: Craftsman = (_, routes) => {
  const map = new Map<string, number>();

  for (const route of routes) {
    // count the number of words in the html
    const text = route.html as string;
    const words = text.split(/\s+/).length;
    map.set(route.href, words / AVERAGE_READING_SPEED);
  }

  return {
    name: "timetoread",
    data: map,
  };
};
