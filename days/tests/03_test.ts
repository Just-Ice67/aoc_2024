import { assertEquals } from "@std/assert";
import { parseInput, performInstructions, parseInput2 } from "../03.ts";

Deno.test(function day03Test() {
    const instructions1 = parseInput("xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))");

    assertEquals(instructions1,
        [
            [2, 4],
            [5, 5],
            [11, 8],
            [8, 5],
        ]
    );

    assertEquals(performInstructions(instructions1), 161);

    const instructions2 = parseInput2("xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))");

    assertEquals(instructions2,
        [
            [2, 4],
            [8, 5],
        ]
    );

    assertEquals(performInstructions(instructions2), 48);
});