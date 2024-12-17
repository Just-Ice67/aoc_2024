import { assertEquals } from "@std/assert";
import { Maze, uniquePositionCount } from "../16.ts";

Deno.test(function day16Test() {
    const input = `
        ###############
        #.......#....E#
        #.#.###.#.###.#
        #.....#.#...#.#
        #.###.#####.#.#
        #.#.#.......#.#
        #.#.#####.###.#
        #...........#.#
        ###.#.#####.#.#
        #...#.....#.#.#
        #.#.#.###.#.#.#
        #.....#...#.#.#
        #.###.#.#.#.#.#
        #S..#.....#...#
        ###############
    `;

    const maze = Maze.fromInput(input);
    
    const bestPath = maze.bestPath()!;
    assertEquals(bestPath.score, 7036);

    const bestPaths = maze.alternativePaths(bestPath);
    assertEquals(uniquePositionCount(bestPaths), 45);
});
