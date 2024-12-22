import { assertEquals } from "@std/assert";
import { parseInput, solution } from "../21.ts";

Deno.test(function day21Test() {
    const input = `
        029A
        980A
        179A
        456A
        379A
    `;

    const instructions = parseInput(input);

    assertEquals(solution(instructions, 2), 126384);
});
