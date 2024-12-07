import { assertEquals } from "@std/assert";
import { parseInput, findWord, findWordX } from "../04.ts";

Deno.test(function day04Test() {
    const input = `
        MMMSXXMASM
        MSAMXMSMSA
        AMXSXMAAMM
        MSAMASMSMX
        XMASAMXAMM
        XXAMMXXAMA
        SMSMSASXSS
        SAXAMASAAA
        MAMMMXMMMM
        MXMXAXMASX
    `;

    const wordSearch = parseInput(input);

    assertEquals(findWord(wordSearch, "XMAS"), 18);
    assertEquals(findWordX(wordSearch, "MAS"), 9);
});
