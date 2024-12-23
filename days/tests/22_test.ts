import { assertEquals } from "@std/assert";
import { parseInput, part1, part2 } from "../22.ts";

Deno.test(function day22Test() {
    const input1 = `
        1
        10
        100
        2024
    `;

    const secrets1 = parseInput(input1);

    assertEquals(part1(secrets1), 37327623);

    const input2 = `
        1
        2
        3
        2024
    `;

    const secrets2 = parseInput(input2);
    part1(secrets2);

    assertEquals(part2(secrets2), 23);
});
