// deno-lint-ignore no-explicit-any
export function cache(fn: (...args: any[]) => any): (...args: any[]) => any {
    const cache = new Map();
    
    // deno-lint-ignore no-explicit-any
    return function(this: any) {
        const hash = [].join.call(arguments);

        if (cache.has(hash)) {
            return cache.get(hash);
        } else {
            const res = fn.apply(this, Array.from(arguments));
            cache.set(hash, res);

            return res;
        }
    }
}

export class PlutonianPebbles {
    constructor(...pebbles: number[]) {
        this.pebbles = pebbles;
    }

    static fromInput(input: string): PlutonianPebbles {
        return new PlutonianPebbles(...input.trim().split(" ").map((x) => +x));
    }
    
    blink(n: number): number {
        let count = 0;

        for (const pebble of this.pebbles) {
            count += PlutonianPebbles.blinkPebble(pebble, n);
        }

        return count;
    }
    
    private static blinkPebble: (pebble: number, n: number) => number = cache(function(pebble: number, n: number): number {
        if (n === 0) return 1;

        if (pebble === 0) return PlutonianPebbles.blinkPebble(1, n - 1);

        const pebbleStr = pebble.toString();
        const pebbleStrLen = pebbleStr.length;

        if (pebbleStrLen % 2 === 0) {
            const left = +pebbleStr.slice(0, pebbleStrLen / 2);
            const right = +pebbleStr.slice(pebbleStrLen / 2, pebbleStrLen);

            return PlutonianPebbles.blinkPebble(left, n - 1) + PlutonianPebbles.blinkPebble(right, n - 1);
        } else return PlutonianPebbles.blinkPebble(pebble * 2024, n - 1);
    });
    
    private pebbles: number[];
}

if (import.meta.main) {
    const pebbles = PlutonianPebbles.fromInput(await Deno.readTextFile("./days/inputs/11.txt"));

    console.log("Answer 1:", pebbles.blink(25));
    
    console.log("Answer 2:", pebbles.blink(75));
}
