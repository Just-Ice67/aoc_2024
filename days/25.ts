import { CartesianProduct } from "js-combinatorics";

export type Lock = [number, number, number, number, number];
export type Key = [number, number, number, number, number];

export function parseInput(input: string): [Lock[], Key[]] {
    const locks = [] as Lock[];
    const keys = [] as Key[];

    const lockOrKeys = input.trim().split("\n\n").map((lockOrKey) => lockOrKey.trim().split("\n").map((line) => line.trim()));

    for (const lockOrKey of lockOrKeys) {
        const lockOrKeyHeights = [0, 0, 0, 0, 0] as Lock | Key;

        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                if (lockOrKey[i][j] === "#") {
                    lockOrKeyHeights[j]++;
                }
            }
        }

        if (lockOrKey[0] === "#####") locks.push(lockOrKeyHeights as Lock);
        else keys.push(lockOrKeyHeights as Key);
    }

    return [locks, keys];
}

export function part1(locks: Lock[], keys: Key[]): number {
    const combonations = new CartesianProduct(locks, keys);

    let fit = 0;

    outer: for (const [lock, key] of combonations) {
        for (let i = 0; i < 5; i++) {
            if (lock[i] + key[i] > 5) continue outer;
        }

        fit++;
    }

    return fit;
}

if (import.meta.main) {
    const [locks, keys] = parseInput(await Deno.readTextFile("./days/inputs/25.txt"));

    console.log("Answer 1:", part1(locks, keys));
}
