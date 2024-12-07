import { assertEquals } from "@std/assert";
import { parseInput, validUpdates, updatesMiddlePageSum, invalidUpdates, sortInvalidUpdates } from "../05.ts";

Deno.test(function day05Test() {
    const input = `
        47|53
        97|13
        97|61
        97|47
        75|29
        61|13
        75|53
        29|13
        97|29
        53|29
        61|53
        97|53
        61|29
        47|13
        75|47
        97|75
        47|61
        75|61
        47|29
        75|13
        53|13

        75,47,61,53,29
        97,61,53,29,13
        75,29,13
        75,97,47,61,53
        61,13,29
        97,13,75,29,47
    `;

    const [updates, rules] = parseInput(input);

    // Sort rules for deterministic order
    for (const key in rules) {
        rules[key].sort();
    }

    assertEquals(rules, {
        29: [13],
        47: [13, 29, 53, 61],
        53: [13, 29],
        61: [13, 29, 53],
        75: [13, 29, 47, 53, 61],
        97: [13, 29, 47, 53, 61, 75],
    });

    assertEquals(updates, [
        [75, 47, 61, 53, 29],
        [97, 61, 53, 29, 13],
        [75, 29, 13],
        [75, 97, 47, 61, 53],
        [61, 13, 29],
        [97, 13, 75, 29, 47],
    ]);

    const valid = validUpdates(updates, rules);

    assertEquals(valid, [
        [75, 47, 61, 53, 29],
        [97, 61, 53, 29, 13],
        [75, 29, 13],
    ]);

    assertEquals(updatesMiddlePageSum(valid), 143);

    const invalid = invalidUpdates(updates, rules);

    assertEquals(invalid, [
        [75, 97, 47, 61, 53],
        [61, 13, 29],
        [97, 13, 75, 29, 47],
    ]);

    assertEquals(sortInvalidUpdates(invalid, rules), [
        [97, 75, 47, 61, 53],
        [61, 29, 13],
        [97, 75, 47, 29, 13],
    ]);

    assertEquals(updatesMiddlePageSum(invalid), 123);
});
