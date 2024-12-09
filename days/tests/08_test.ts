import { assertEquals } from "@std/assert";
import { parseInput, getAntennaMap, getAntinodeMap, countUniqueAntinodePositions } from "../08.ts";

Deno.test(function day08Test() {
    const input = `
        ............
        ........0...
        .....0......
        .......0....
        ....0.......
        ......A.....
        ............
        ............
        ........A...
        .........A..
        ............
        ............
    `;

    const map = parseInput(input);

    assertEquals(map, [
        "............",
        "........0...",
        ".....0......",
        ".......0....",
        "....0.......",
        "......A.....",
        "............",
        "............",
        "........A...",
        ".........A..",
        "............",
        "............",
    ]);

    const antennaMap = getAntennaMap(map);

    assertEquals(antennaMap, {
        "0": [
            [8, 1],
            [5, 2],
            [7, 3],
            [4, 4],
        ],
        "A": [
            [6, 5],
            [8, 8],
            [9, 9],
        ]
    });

    assertEquals(countUniqueAntinodePositions(getAntinodeMap(map, false)), 14);
    assertEquals(countUniqueAntinodePositions(getAntinodeMap(map, true)), 34);
});