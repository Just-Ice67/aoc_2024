export class PlutonianPebbles {
    constructor(...pebbles: number[]) {
        this._pebbles = pebbles;
    }

    static fromInput(input: string): PlutonianPebbles {
        return new PlutonianPebbles(...input.trim().split(" ").map((x) => +x));
    }
    
    blink(n: number): number {
        function inner(pebble: number, n: number): number {
            const cacheKey = `${pebble},${n}`;

            if (PlutonianPebbles._cache.has(cacheKey)) {
                return PlutonianPebbles._cache.get(cacheKey)!;
            }

            let res;

            if (n === 0) {
                res = 1;
            } else if (pebble === 0) {
                res = inner(1, n - 1);
            } else {
                const pebbleStr = pebble.toString();
                const pebbleStrLen = pebbleStr.length;
                
                if (pebbleStrLen % 2 === 0) {
                    const left = +pebbleStr.slice(0, pebbleStrLen / 2);
                    const right = +pebbleStr.slice(pebbleStrLen / 2, pebbleStrLen);
                    
                    res = inner(left, n - 1) + inner(right, n - 1);
                } else {
                    res = inner(pebble * 2024, n - 1);
                }
            }

            PlutonianPebbles._cache.set(cacheKey, res);

            return res;
        }

        let count = 0;

        for (const pebble of this._pebbles) {
            count += inner(pebble, n);
        }

        return count;
    }
    
    private static _cache: Map<string, number> = new Map();
    private _pebbles: number[];
}

if (import.meta.main) {
    const pebbles = PlutonianPebbles.fromInput(await Deno.readTextFile("./days/inputs/11.txt"));

    console.log("Answer 1:", pebbles.blink(25));
    
    console.log("Answer 2:", pebbles.blink(75));
}
