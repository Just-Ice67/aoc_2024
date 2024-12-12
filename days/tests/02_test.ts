import { assertEquals } from "@std/assert";
import { Report, parseInput, reportsFilterSum } from "../02.ts";

Deno.test(function day02Test() {
    const input = `
        7 6 4 2 1
        1 2 7 8 9
        9 7 6 2 1
        1 3 2 4 5
        8 6 4 4 1
        1 3 6 7 9
    `;

    const reports = parseInput(input);

    assertEquals(reports,
        [
            new Report(7, 6, 4, 2, 1),
            new Report(1, 2, 7, 8, 9),
            new Report(9, 7, 6, 2, 1),
            new Report(1, 3, 2, 4, 5),
            new Report(8, 6, 4, 4, 1),
            new Report(1, 3, 6, 7, 9),
        ]
    );

    assertEquals(reportsFilterSum(reports, (report) => report.safe()), 2);
    assertEquals(reportsFilterSum(reports, (report) => report.safeWithDampener()), 4);
});
