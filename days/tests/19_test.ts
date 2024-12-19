import { assertEquals } from "@std/assert";
import { TowelArranger, sumPossibleDesignsWaysPossible } from "../19.ts";

Deno.test(function day19Test() {
    const input = `
        r, wr, b, g, bwu, rb, gb, br

        brwrr
        bggr
        gbbr
        rrbgbr
        ubwu
        bwurrg
        brgr
        bbrgwb
    `;

    const towelArranger = TowelArranger.fromInput(input);

    const possibleDesigns = towelArranger.possibleDesigns();

    assertEquals(possibleDesigns.length, 6);
    assertEquals(sumPossibleDesignsWaysPossible(possibleDesigns), 16);
});
