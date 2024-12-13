import { assertEquals } from "@std/assert";
import { DiskBlocks } from "../09.ts";

Deno.test(function day09Test() {
    const input = "2333133121414131402";

    const blocks = DiskBlocks.fromInput(input);

    assertEquals(blocks, new DiskBlocks([
        "0", "0", ".", ".", ".", "1", "1",
        "1", ".", ".", ".", "2", ".", ".",
        ".", "3", "3", "3", ".", "4", "4",
        ".", "5", "5", "5", "5", ".", "6",
        "6", "6", "6", ".", "7", "7", "7",
        ".", "8", "8", "8", "8", "9", "9",
    ]));

    const fragmented = blocks.clone().sort();

    assertEquals(fragmented, new DiskBlocks([
        "0", "0", "9", "9", "8", "1", "1",
        "1", "8", "8", "8", "2", "7", "7",
        "7", "3", "3", "3", "6", "4", "4",
        "6", "5", "5", "5", "5", "6", "6",
        ".", ".", ".", ".", ".", ".", ".",
        ".", ".", ".", ".", ".", ".", ".",
    ]));

    assertEquals(fragmented.checksum(), 1928);

    blocks.move();

    assertEquals(blocks, new DiskBlocks([
        "0", "0", "9", "9", "2", "1", "1",
        "1", "7", "7", "7", ".", "4", "4",
        ".", "3", "3", "3", ".", ".", ".",
        ".", "5", "5", "5", "5", ".", "6",
        "6", "6", "6", ".", ".", ".", ".",
        ".", "8", "8", "8", "8", ".", ".",
    ]));

    assertEquals(blocks.checksum(), 2858);
});
