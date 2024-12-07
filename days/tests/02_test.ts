import { assertEquals } from "@std/assert";
import { parseInput, isReportSafe, reportsCount, isReportSafeWithDampner } from "../02.ts";

Deno.test(function day02Test() {
    const input = `
        7 6 4 2 1
        1 2 7 8 9
        9 7 6 2 1
        1 3 2 4 5
        8 6 4 4 1
        1 3 6 7 9
    `

    const reports = parseInput(input);

    assertEquals(reports,
        [
            [7, 6, 4, 2, 1],
            [1, 2, 7, 8, 9],
            [9, 7, 6, 2, 1],
            [1, 3, 2, 4, 5],
            [8, 6, 4, 4, 1],
            [1, 3, 6, 7, 9],
        ]
    );

    assertEquals(reportsCount(reports, isReportSafe), 2);
    assertEquals(reportsCount(reports, isReportSafeWithDampner), 4);
});
