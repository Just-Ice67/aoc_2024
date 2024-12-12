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

export function listDistance(left: number[], right: number[]): number {
    left = left.toSorted();
    right = right.toSorted();

    let dist = 0;

    for (let i = 0; i < left.length; i++) {
        dist += Math.abs(left[i] - right[i]);
    }

    return dist;
}

export function listSimilarity(left: number[], right: number[]): number {
    const rightCounts: Map<number, number> = new Map();

    for (const num of right) {
        const count = rightCounts.has(num) ? rightCounts.get(num)! + 1 : 1;

        rightCounts.set(num, count);
    }

    let similarity = 0;

    for (const num of left) {
        if (rightCounts.has(num)) similarity += num * rightCounts.get(num)!;
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
