import { assertEquals } from "@std/assert";
import { parseInput, part1 } from "../25.ts";

Deno.test(function day25Test() {
    const input = `
        #####
        .####
        .####
        .####
        .#.#.
        .#...
        .....

        #####
        ##.##
        .#.##
        ...##
        ...#.
        ...#.
        .....

        .....
        #....
        #....
        #...#
        #.#.#
        #.###
        #####

        .....
        .....
        #.#..
        ###..
        ###.#
        ###.#
        #####

        .....
        .....
        .....
        #....
        #.#..
        #.#.#
        #####
    `;

    const [locks, keys] = parseInput(input);

    assertEquals(part1(locks, keys), 3);
});
