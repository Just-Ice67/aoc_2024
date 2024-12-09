export function parseInput(input: string): [number[], number[]] {
    const pairs = input.trim().split("\n").map(
        (line) => line.trim().split("   ").map(
            (num) => +num
        )
    )
    
    const res = [[], []] as [number[], number[]];

    for (const pair of pairs) {
        res[0].push(pair[0]);
        res[1].push(pair[1]);
    }

    return res;
}

export function listDistance(a: number[], b: number[]): number {
    a = a.toSorted();
    b = b.toSorted();

    let dist = 0;

    for (let i = 0; i < a.length; i++) {
        dist += Math.abs(a[i] - b[i]);
    }

    return dist;
}

export function listSimilarity(a: number[], b: number[]): number {
    const b_counts = {} as { [key: number]: number };

    for (const num of b) {
        b_counts[num] = b_counts[num] ? b_counts[num] + 1 : 1;
    }

    let similarity = 0;

    for (const num of a) {
        similarity += num * (b_counts[num] ? b_counts[num] : 0);
    }

    return similarity;
}

if (import.meta.main) {
    const input = parseInput(await Deno.readTextFile("./days/inputs/01.txt"));

    const distance = listDistance(input[0], input[1]);
    console.log("Answer 1:", distance);

    const similarity = listSimilarity(input[0], input[1]);
    console.log("Answer 2:", similarity);
}
