export class Report {
    levels: number[];

    constructor(...levels: number[]) {
        this.levels = levels;
    }

    safe(): boolean {
        const asc = this.levels[0] - this.levels[1] < 0 ? true : false;

        for (let i = 0; i < this.levels.length - 1; i++) {
            const dist = this.levels[i] - this.levels[i + 1];

            if ((asc && (dist > -1 || dist < -3)) || (!asc && (dist < 1 || dist > 3))) return false;
        }

        return true;
    }

    safeWithDampener(dampening = 1): boolean {
        function inner(levels: number[], i: number, asc: boolean, removed: number): boolean {
            for (; i < levels.length - 1; i++) {
                const dist = levels[i] - levels[i + 1];
        
                if ((asc && (dist > -1 || dist < -3)) || (!asc && (dist < 1 || dist > 3))) {
                    if (removed === dampening) return false;
                    else {
                        const possibleDampened1 = [...levels];
                        possibleDampened1.splice(i, 1);
    
                        const possibleDampened2 = [...levels];
                        possibleDampened2.splice(i + 1, 1);
    
                        return inner(possibleDampened1, Math.max(i - 1, 0), asc, removed + 1) || inner(possibleDampened2, i, asc, removed + 1);
                    }
                }
            }
    
            return true;
        }
    
        return inner(this.levels, 0, true, 0) || inner(this.levels, 0, false, 0);
    }
}

export function parseInput(input: string): Report[] {
    return input.trim().split("\n").map(
        (line) => new Report(...line.trim().split(" ").map(
            (num) => +num
        ))
    );
}

export function reportsFilterSum(reports: Report[], filter: (report: Report) => boolean): number {
    let sum = 0;

    for (const report of reports) {
        if (filter(report)) sum++;
    }

    return sum;
}

if (import.meta.main) {
    const reports = parseInput(await Deno.readTextFile("./days/inputs/02.txt"));

    console.log("Answer 1:", reportsFilterSum(reports, (report) => report.safe()));
    console.log("Answer 2:", reportsFilterSum(reports, (report) => report.safeWithDampener()));
}
