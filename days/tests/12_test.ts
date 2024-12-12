import { assertEquals } from "@std/assert";
import { Garden } from "../12.ts";

Deno.test(function day12Test() {
    const input = `
        RRRRIICCFF
        RRRRIICCCF
        VVRRRCCFFF
        VVRCCCJFFF
        VVVVCJJCFE
        VVIVCCJJEE
        VVIIICJJEE
        MIIIIIJJEE
        MIIISIJEEE
        MMMISSJEEE
    `;

    const garden = Garden.fromInput(input);

    assertEquals(garden.fencingCost(), 1930);
    assertEquals(garden.fencingCost(true), 1206);
});
