import { assertEquals } from "@std/assert";
import { parseInput, sortBlocks, calculateChecksum, moveBlocks } from "../09.ts";

Deno.test(function day09Test() {
    const input = "2333133121414131402";

    const blocks = parseInput(input);

    assertEquals(blocks, [
        "0", "0", ".", ".", ".", "1", "1",
        "1", ".", ".", ".", "2", ".", ".",
        ".", "3", "3", "3", ".", "4", "4",
        ".", "5", "5", "5", "5", ".", "6",
        "6", "6", "6", ".", "7", "7", "7",
        ".", "8", "8", "8", "8", "9", "9",
    ]);

    const fragmented = sortBlocks([...blocks]);

    assertEquals(fragmented, [
        "0", "0", "9", "9", "8", "1", "1",
        "1", "8", "8", "8", "2", "7", "7",
        "7", "3", "3", "3", "6", "4", "4",
        "6", "5", "5", "5", "5", "6", "6",
        ".", ".", ".", ".", ".", ".", ".",
        ".", ".", ".", ".", ".", ".", ".",
    ]);

    assertEquals(calculateChecksum(fragmented), 1928);

    moveBlocks(blocks);

    assertEquals(blocks, [
        "0", "0", "9", "9", "2", "1", "1",
        "1", "7", "7", "7", ".", "4", "4",
        ".", "3", "3", "3", ".", ".", ".",
        ".", "5", "5", "5", "5", ".", "6",
        "6", "6", "6", ".", ".", ".", ".",
        ".", "8", "8", "8", "8", ".", ".",
    ]);

    assertEquals(calculateChecksum(blocks), 2858);
});
