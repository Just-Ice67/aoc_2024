import { assertEquals } from "@std/assert";
import { Update, Rules, parseInput, splitUpdates, sortUpdates, updatesMiddlePageSum } from "../05.ts";

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

    assertEquals(rules, new Rules({
        29: [13],
        47: [13, 29, 53, 61],
        53: [13, 29],
        61: [13, 29, 53],
        75: [13, 29, 47, 53, 61],
        97: [13, 29, 47, 53, 61, 75],
    }));

    assertEquals(updates, [
        new Update(75, 47, 61, 53, 29),
        new Update(97, 61, 53, 29, 13),
        new Update(75, 29, 13),
        new Update(75, 97, 47, 61, 53),
        new Update(61, 13, 29),
        new Update(97, 13, 75, 29, 47),
    ]);

    const [validUpdates, invalidUpdates] = splitUpdates(updates, rules);

    assertEquals(validUpdates, [
        new Update(75, 47, 61, 53, 29),
        new Update(97, 61, 53, 29, 13),
        new Update(75, 29, 13),
    ]);

    assertEquals(invalidUpdates, [
        new Update(75, 97, 47, 61, 53),
        new Update(61, 13, 29),
        new Update(97, 13, 75, 29, 47),
    ]);
    
    assertEquals(sortUpdates(invalidUpdates, rules), [
        new Update(97, 75, 47, 61, 53),
        new Update(61, 29, 13),
        new Update(97, 75, 47, 29, 13),
    ]);
    
    assertEquals(updatesMiddlePageSum(validUpdates), 143);
    assertEquals(updatesMiddlePageSum(invalidUpdates), 123);
});
