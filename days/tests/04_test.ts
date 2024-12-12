import { assertEquals } from "@std/assert";
import { WordSearch } from "../04.ts";

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

    const wordSearch = new WordSearch(input);

    assertEquals(wordSearch.findWord("XMAS"), 18);
    assertEquals(wordSearch.findWordX("MAS"), 9);
});
