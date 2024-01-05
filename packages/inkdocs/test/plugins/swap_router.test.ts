import { describe, it, expect } from "bun:test";
import { getLayoutFromHref } from "../../plugins/swap_router";

// describe("getLayoutFromHref", () => {
//   it("correctly identifies standard routes", () => {
//     const result = getLayoutFromHref("/test", {
//       layouts: new Map([
//         ["test", () => "test"],
//         ["default", () => "default"],
//       ]),
//     });
//
//     expect(result).toEqual("test");
//   });
//   it("deals with edge case of /", () => {
//     const result = getLayoutFromHref("/", {
//       layouts: new Map([
//         ["test", () => "test"],
//         ["default", () => "default"],
//         ["", () => "other"],
//       ]),
//     });
//
//     expect(result).toEqual("other");
//   });
// });
