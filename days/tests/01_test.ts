import { assertEquals } from "@std/assert";
import { parseInput, listDistance, listSimilarity } from "../01.ts";

Deno.test(function day01Test() {
    const input = `
        3   4
        4   3
        2   5
        1   3
        3   9
        3   3
    `;

    const [a, b] = parseInput(input);

    assertEquals(a, [3, 4, 2, 1, 3, 3]);
    assertEquals(b, [4, 3, 5, 3, 9, 3]);

    assertEquals(listDistance(a, b), 11);
    assertEquals(listSimilarity(a, b), 31);
});
