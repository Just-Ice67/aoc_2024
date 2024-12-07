export type Update = number[];
export type Updates = Update[];

export type Rules = {
    [key: number]: number[];
}

export function parseInput(input: string): [Updates, Rules] {
    function parseUpdates(input: string): Updates {
        return input.trim().split("\n").map((line) => line.trim().split(",").map((num) => parseInt(num)));
    }
    
    function parseRules(input: string): Rules {
        const rules = {} as Rules;
    
        for (const line of input.trim().split("\n")) {
            const [num_1, num_2] = line.trim().split("|").map((num) => parseInt(num));
    
            if (rules[num_1]) rules[num_1].push(num_2);
            else rules[num_1] = [num_2];
        }
    
        return rules;
    }

    const [rules, updates] = input.trim().split("\n\n");

    return [parseUpdates(updates), parseRules(rules)];
}

export function validUpdate(update: Update, rules: Rules): boolean {
    for (let i = 0; i < update.length; i++) {
        const page = update[i];
        const updateRules = rules[page];

        if (updateRules) {
            for (const afterPage of updateRules) {
                const afterPageIndex = update.indexOf(afterPage);

                if (afterPageIndex !== -1 && afterPageIndex < i) return false;
            }
        }
    }

    return true;
}

export function validUpdates(updates: Updates, rules: Rules): Updates {
    return updates.filter((update) => validUpdate(update, rules));
}

export function updatesMiddlePageSum(updates: Updates): number {
    return updates.reduce((sum, update) => sum + update[Math.floor(update.length / 2)], 0);
}

export function invalidUpdates(updates: Updates, rules: Rules): Updates {
    return updates.filter((update) => !validUpdate(update, rules));
}

export function sortInvalidUpdate(update: Update, rules: Rules): Update {
    return update.sort((a, b) => {
        if (rules[a] && rules[a].includes(b)) return -1;
        else if (a === b) return 0;
        else return 1;
    });
}

export function sortInvalidUpdates(updates: Updates, rules: Rules): Updates {
    return updates.map((update) => sortInvalidUpdate(update, rules));
}

if (import.meta.main) {
    const [updates, rules] = parseInput(await Deno.readTextFile("./days/inputs/05.txt"));

    console.log("Answer 1:", updatesMiddlePageSum(validUpdates(updates, rules)));
    console.log("Answer 2:", updatesMiddlePageSum(sortInvalidUpdates(invalidUpdates(updates, rules), rules)));
}
