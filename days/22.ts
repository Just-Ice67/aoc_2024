import { slidingWindows } from "@std/collections";

export class SecretNumber {
    constructor(seed: number) {
        this._value = seed;
        this._priceChanges = [];
    }

    static fromString(input: string): SecretNumber {
        return new SecretNumber(+input);
    }

    [Symbol.toPrimitive]() { return this._value; }

    get value(): number { return this._value; }
    get priceChanges(): ReadonlyArray<(readonly [number, number])> { return this._priceChanges; }

    next(): number {
        const startPrice = +this._value.toString().at(-1)!;

        this._mixAndPrune(this._value * 64);
        this._mixAndPrune(Math.floor(this._value / 32));
        this._mixAndPrune(this._value * 2048);

        const endPrice = +this._value.toString().at(-1)!;

        this._priceChanges.push([endPrice, endPrice - startPrice]);

        return this._value;
    }
    
    private static readonly _PRUNE = 16777216;

    private _value: number;
    private _priceChanges: [number, number][];

    private _mixAndPrune(value: number) {
        this._value ^= value;
        this._value = ((this._value % SecretNumber._PRUNE) + SecretNumber._PRUNE) % SecretNumber._PRUNE;
    }
}

export function parseInput(input: string): SecretNumber[] {
    return input.trim().split("\n").map((line) => SecretNumber.fromString(line.trim()));
}

export function part1(secrets: SecretNumber[]): number {
    return secrets.reduce((acc, secret) => {
        for (let i = 0; i < 2000; i++) secret.next();

        return acc + secret.value;
    }, 0);
}

export function part2(secrets: SecretNumber[]): number {
    /*
    This function will take a while to execute, but it outputs the best sum found so far.
    So, just wait for the output to stop updating and that's probably it. It takes ~10 seconds on my machine with my input.
    Or, just run it until completion (~5.5 minutes, my machine with my input).
    */

    console.log("\nPossible answers for 2:")

    let best = 0;

    const windows = new Map(secrets.map((secret) => [secret, slidingWindows(secret.priceChanges, 4)]));
    const visitedWindows = new Set();
    
    const windowHash = (window: (readonly [number, number])[]): string => {
        return `${window[0][1]},${window[1][1]},${window[2][1]},${window[3][1]}`;
    }

    const windowSum = (window: (readonly [number, number])[]): number => {
        let sum = 0;

        for (const secret of secrets) {
            const maybeWindow = windows.get(secret)!.find(
                (w) => w[0][1] === window[0][1] && w[1][1] === window[1][1] && w[2][1] === window[2][1] && w[3][1] === window[3][1]
            );

            if (maybeWindow === undefined) continue;

            sum += maybeWindow[3][0];
        }

        return sum;
    }

    for (const secret of secrets) {
        for (const window of windows.get(secret)!) {
            if (window[3][0] !== 9) continue;

            const hash = windowHash(window);

            if (visitedWindows.has(hash)) continue;

            visitedWindows.add(hash);

            const sum = windowSum(window);
            
            if (sum > best) {
                console.log(`${hash}: ${sum}`);
                if (sum === secrets.length * 9) return sum;

                best = sum;
            }
        }
    }

    console.log();

    return best;
}

if (import.meta.main) {
    const secrets = parseInput(await Deno.readTextFile("./days/inputs/22.txt"));

    console.log("Answer 1:", part1(secrets));
    console.log("Answer 2:", part2(secrets));
}
