import { assertEquals } from "@std/assert";
import { PlutonianPebbles } from "../11.ts";

Deno.test(function day11Test() {
    const input = "125 17";

    const pebbles = PlutonianPebbles.fromInput(input);

    assertEquals(pebbles, new PlutonianPebbles(125, 17));

    assertEquals(pebbles.blink(6), 22);

    assertEquals(pebbles.blink(25), 55312);
});
