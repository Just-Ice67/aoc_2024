import { assertEquals } from "@std/assert";
import { TopographicalMap } from "../10.ts";

Deno.test(function day10Test() {
    const input = `
        89010123
        78121874
        87430965
        96549874
        45678903
        32019012
        01329801
        10456732
    `;

    const map = TopographicalMap.fromInput(input);

    assertEquals(map, new TopographicalMap([
        [8, 9, 0, 1, 0, 1, 2, 3],
        [7, 8, 1, 2, 1, 8, 7, 4],
        [8, 7, 4, 3, 0, 9, 6, 5],
        [9, 6, 5, 4, 9, 8, 7, 4],
        [4, 5, 6, 7, 8, 9, 0, 3],
        [3, 2, 0, 1, 9, 0, 1, 2],
        [0, 1, 3, 2, 9, 8, 0, 1],
        [1, 0, 4, 5, 6, 7, 3, 2],
    ]));

    assertEquals(map.uniquePeaks(), 36);
    assertEquals(map.peaks(), 81);
});
