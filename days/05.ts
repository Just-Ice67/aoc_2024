export class Update {
    pageNumbers: number[];

    constructor(...pageNumbers: number[]) {
        this.pageNumbers = pageNumbers;
    }

    static fromInput(input: string): Update {
        return new Update(...input.trim().split(",").map((num) => +num));
    }

    valid(rules: Rules): boolean {
        for (let i = 0; i < this.pageNumbers.length; i++) {
            const page = this.pageNumbers[i];
            const pageRules = rules[page];
    
            if (pageRules) {
                for (const mustBeforePage of pageRules) {
                    const mustBeforePageIndex = this.pageNumbers.indexOf(mustBeforePage);
    
                    if (mustBeforePageIndex !== -1 && mustBeforePageIndex < i) return false;
                }
            }
        }
    
        return true;
    }

    invalid(rules: Rules): boolean { return !this.valid(rules); }

    sort(rules: Rules): Update {
        this.pageNumbers.sort((a, b) => {
            if (a in rules && rules[a].includes(b)) return -1;
            else if (a === b) return 0;
            else return 1;
        });

        return this;
    }
}

export class Rules {
    [key: number]: number[];

    constructor(obj?: { [key: number]: number[] }) {
        if (obj === undefined) return;

        Object.assign(this, obj);
    }

    static fromInput(input: string): Rules {
        const rules = new Rules();
    
        for (const line of input.trim().split("\n")) {
            const [num, mustBefore] = line.trim().split("|").map((num) => +num);
    
            rules.addRule(num, mustBefore);
        }
    
        return rules;
    }

    addRule(num: number, ...mustBefore: number[]) {
        num in this ? this[num].push(...mustBefore) : this[num] = mustBefore;
    }
}

export function parseInput(input: string): [Update[], Rules] {
    function parseUpdates(input: string): Update[] {
        return input.trim().split("\n").map((line) => Update.fromInput(line));
    }

    const [rules, updates] = input.trim().split("\n\n");

    return [parseUpdates(updates), Rules.fromInput(rules)];
}

export function splitUpdates(updates: Update[], rules: Rules): [Update[], Update[]] {
    const valid = [];
    const invalid = [];

    for (const update of updates) {
        if (update.valid(rules)) valid.push(update);
        else invalid.push(update);
    }

    return [valid, invalid];
}

export function sortUpdates(updates: Update[], rules: Rules): Update[] {
    return updates.map((update) => update.sort(rules));
}

export function updatesMiddlePageSum(updates: Update[]): number {
    return updates.reduce((sum, update) => sum + update.pageNumbers[Math.floor(update.pageNumbers.length / 2)], 0);
}

if (import.meta.main) {
    const [updates, rules] = parseInput(await Deno.readTextFile("./days/inputs/05.txt"));
    const [validUpdates, invalidUpdates] = splitUpdates(updates, rules);

    console.log("Answer 1:", updatesMiddlePageSum(validUpdates));
    console.log("Answer 2:", updatesMiddlePageSum(sortUpdates(invalidUpdates, rules)));
}
