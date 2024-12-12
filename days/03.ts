export function evalInput1(input: string): number {
    let sum = 0;

    let i = 0;
    while (true) {
        i = input.indexOf("mul(", i);
        if (i === -1) break;

        i += 4;

        const comma = input.indexOf(",", i);
        if (comma === -1) break;

        const num1 = +input.slice(i, comma);
        if (isNaN(num1) || num1 > 999 || num1 < 0) continue;

        i = comma + 1;

        const close = input.indexOf(")", i);
        if (close === -1) break;

        const num2 = +input.slice(i, close);
        if (isNaN(num2) || num2 > 999 || num2 < 0) continue;

        sum += num1 * num2;

        i = close + 1;
    }

    return sum;
}

export function evalInput2(input: string): number {
    let sum = 0;

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

        const num1 = +input.slice(i, comma);
        if (isNaN(num1) || num1 > 999 || num1 < 0) continue;

        i = comma + 1;

        const close = input.indexOf(")", i);
        if (close === -1) break;

        const num2 = +input.slice(i, close);
        if (isNaN(num2) || num2 > 999 || num2 < 0) continue;

        sum += num1 * num2;

        i = close + 1;
    }

    return sum;
}

if (import.meta.main) {
    const input = await Deno.readTextFile("./days/inputs/03.txt");
    
    console.log("Answer 1:", evalInput1(input));
    console.log("Answer 2:", evalInput2(input));
}
