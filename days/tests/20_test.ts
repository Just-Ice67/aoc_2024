import { assertEquals } from "@std/assert";
import { RaceTrack } from "../20.ts";

Deno.test(function day20Test() {
    const input = `
        ###############
        #...#...#.....#
        #.#.#.#.#.###.#
        #S#...#.#.#...#
        #######.#.#.###
        #######.#.#...#
        #######.#.###.#
        ###..E#...#...#
        ###.#######.###
        #...###...#...#
        #.#####.#.###.#
        #.#...#.#.#...#
        #.#.#.#.#.#.###
        #...#...#...###
        ###############
    `;

    const raceTrack = RaceTrack.fromInput(input);

    assertEquals(raceTrack.getPath().length - 1, 84);

    const cheats1 = raceTrack.findCheats(2);

    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 2).length, 14, "Cheats with time saved 2");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 4).length, 14, "Cheats with time saved 4");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 6).length, 2, "Cheats with time saved 6");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 8).length, 4, "Cheats with time saved 8");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 10).length, 2, "Cheats with time saved 10");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 12).length, 3, "Cheats with time saved 12");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 20).length, 1, "Cheats with time saved 20");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 36).length, 1, "Cheats with time saved 36");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 38).length, 1, "Cheats with time saved 38");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 40).length, 1, "Cheats with time saved 40");
    assertEquals(cheats1.filter((cheat) => cheat.timeSaved === 64).length, 1, "Cheats with time saved 64");

    const cheats2 = raceTrack.findCheats(20);

    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 50).length, 32, "Cheats with time saved 50");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 52).length, 31, "Cheats with time saved 52");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 54).length, 29, "Cheats with time saved 54");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 56).length, 39, "Cheats with time saved 56");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 58).length, 25, "Cheats with time saved 58");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 60).length, 23, "Cheats with time saved 60");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 62).length, 20, "Cheats with time saved 62");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 64).length, 19, "Cheats with time saved 64");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 66).length, 12, "Cheats with time saved 66");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 68).length, 14, "Cheats with time saved 68");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 70).length, 12, "Cheats with time saved 70");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 72).length, 22, "Cheats with time saved 72");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 74).length, 4, "Cheats with time saved 74");
    assertEquals(cheats2.filter((cheat) => cheat.timeSaved === 76).length, 3, "Cheats with time saved 76");
});
