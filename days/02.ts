export function parseInput(input: string): number[][] {
    return input.trim().split("\n").map(
        (line) => line.trim().split(" ").map(
            (num) => +num
        )
    );
}

export function isReportSafe(report: number[]): boolean {
    const asc = report[0] - report[1] < 0 ? true : false;

    for (let i = 0; i < report.length - 1; i++) {
        const dist = report[i] - report[i + 1];

        if ((asc && (dist > -1 || dist < -3)) || (!asc && (dist < 1 || dist > 3))) return false;
    }

    return true;
}

export function reportsCount(reports: number[][], shouldCount: (report: number[]) => boolean): number {
    let count = 0;

    for (const report of reports) {
        if (shouldCount(report)) count++;
    }

    return count;
}

export function isReportSafeWithDampner(report: number[]): boolean {
    function inner(report: number[], i: number, asc: boolean, removed: boolean): boolean {
        for (; i < report.length - 1; i++) {
            const dist = report[i] - report[i + 1];
    
            if ((asc && (dist > -1 || dist < -3)) || (!asc && (dist < 1 || dist > 3))) {
                if (removed) return false;
                else {
                    const report_a = [...report];
                    report_a.splice(i, 1);

                    const report_b = [...report];
                    report_b.splice(i + 1, 1);

                    return inner(report_a, Math.max(i - 1, 0), asc, true) || inner(report_b, i, asc, true);
                }
            }
        }

        return true;
    }

    return inner(report, 0, true, false) || inner(report, 0, false, false);
}

if (import.meta.main) {
    const reports = parseInput(await Deno.readTextFile("./days/inputs/02.txt"));

    console.log("Answer 1:", reportsCount(reports, isReportSafe));
    console.log("Answer 2:", reportsCount(reports, isReportSafeWithDampner));
}
