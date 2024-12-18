import { assertEquals } from "@std/assert";
import { MemorySpace } from "../18.ts";

Deno.test(function day18Test() {
    const input = `
        5,4
        4,2
        4,5
        3,0
        2,1
        6,3
        2,4
        1,5
        0,6
        3,3
        2,6
        5,1
        1,2
        5,5
        2,5
        6,5
        1,4
        0,4
        6,4
        1,1
        6,1
        1,0
        0,5
        1,6
        2,0
    `;

    const memorySpace = MemorySpace.fromInput(input);

    assertEquals(memorySpace.shortestPath(12), 22);

    assertEquals(memorySpace.lastByte(), [6, 1]);
});
