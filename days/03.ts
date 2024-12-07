export function parseInput(input: string): [number, number][] {
    const instructions = [] as [number, number][];
    let i = 0;

    while (true) {
        i = input.indexOf("mul(", i);
        if (i === -1) break;

        i += 4;

        const comma = input.indexOf(",", i);
        if (comma === -1) break;

        let num_1_nan = false;
        for (let j = i; j < comma; j++) {
            if (input[j] < "0" || input[j] > "9") num_1_nan = true;
        }

        const num_1 = num_1_nan ? NaN : parseInt(input.slice(i, comma));
        if (isNaN(num_1) || num_1 > 999 || num_1 < 0) continue;

        i = comma + 1;

        const close = input.indexOf(")", i);
        if (close === -1) break;

        let num_2_nan = false;
        for (let j = i; j < close; j++) {
            if (input[j] < "0" || input[j] > "9") num_2_nan = true;
        }

        const num_2 = num_2_nan ? NaN : parseInt(input.slice(i, close));
        if (isNaN(num_2) || num_2 > 999 || num_2 < 0) continue;

        instructions.push([num_1, num_2]);

        i = close + 1;
    }

    return instructions;
}

export function performInstructions(instructions: [number, number][]): number {
    let sum = 0;

    for (const [num_1, num_2] of instructions) {
        sum += num_1 * num_2;
    }

    return sum;
}

export function parseInput2(input: string): [number, number][] {
    const instructions = [] as [number, number][];

    let i = 0;

    let next_dont = input.indexOf("don't()");

    while (true) {
        i = input.indexOf("mul(", i);
        if (i === -1) break;
        if (i > next_dont && next_dont !== -1) {
            i = input.indexOf("do()", next_dont + 7);
            if (i === -1) break;

            i += 4;
            next_dont = input.indexOf("don't()", i);
            continue;
        }

        i += 4;

        const comma = input.indexOf(",", i);
        if (comma === -1) break;

        let num_1_nan = false;
        for (let j = i; j < comma; j++) {
            if (input[j] < "0" || input[j] > "9") num_1_nan = true;
        }

        const num_1 = num_1_nan ? NaN : parseInt(input.slice(i, comma));
        if (isNaN(num_1) || num_1 > 999 || num_1 < 0) continue;

        i = comma + 1;

        const close = input.indexOf(")", i);
        if (close === -1) break;

        let num_2_nan = false;
        for (let j = i; j < close; j++) {
            if (input[j] < "0" || input[j] > "9") num_2_nan = true;
        }

        const num_2 = num_2_nan ? NaN : parseInt(input.slice(i, close));
        if (isNaN(num_2) || num_2 > 999 || num_2 < 0) continue;

        instructions.push([num_1, num_2]);

        i = close + 1;
    }

    return instructions;
}

if (import.meta.main) {
    const input = await Deno.readTextFile("./days/inputs/03.txt");
    
    const instructions1 = parseInput(input);
    console.log("Answer 1:", performInstructions(instructions1));

    const instructions2 = parseInput2(input);
    console.log("Answer 2:", performInstructions(instructions2));
}
