import { Combination } from "js-combinatorics";

export class ComputerNetwork {
    map: Map<string, Set<string>>;

    constructor(map: Map<string, Set<string>>) {
        this.map = map;
    }

    static fromInput(input: string): ComputerNetwork {
        const network = new ComputerNetwork(new Map());

        for (const line of input.trim().split("\n")) {
            const [comp1, comp2] = line.trim().split("-");

            if (!network.map.has(comp1)) network.map.set(comp1, new Set([comp2]));
            else network.map.get(comp1)!.add(comp2);

            if (!network.map.has(comp2)) network.map.set(comp2, new Set([comp1]));
            else network.map.get(comp2)!.add(comp1);
        }

        return network;
    }

    interconnectedSets(size: number): Set<string> {
        const sets = new Set<string>();

        for (const computer of this.map.keys()) {
            const possibleSets = new Combination(this.map.get(computer)!.values(), size - 1);

            outer: for (const combination of possibleSets.bitwiseIterator()) {
                for (const comp1 of combination) {
                    const connectionSet = this.map.get(comp1)!;

                    for (const comp2 of combination) {
                        if (comp1 === comp2) continue;

                        if (!connectionSet.has(comp2)) continue outer;
                    }
                }

                sets.add([computer, ...combination].sort((a, b) => a.localeCompare(b)).join(","));
            }
        }

        return sets;
    }
}

export function part1(network: ComputerNetwork): number {
    return network.interconnectedSets(3).values().filter((set) => set.split(",").some((comp) => comp.startsWith("t"))).toArray().length;
}

export function part2(network: ComputerNetwork): string {
    let set;
    let i = [...network.map.keys()].length

    do {
        set = network.interconnectedSets(i);
        i--;
    } while (set.size === 0);

    return set.values().next().value!;
}

if (import.meta.main) {
    const network = ComputerNetwork.fromInput(await Deno.readTextFile("./days/inputs/23.txt"));

    console.log("Answer 1:", part1(network));
    console.log("Answer 2:", part2(network));
}
