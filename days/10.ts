export type Map = number[][];

export type Peaks = string[];
export type Trailheads = { [trailhead: string]: Peaks };

export function parseInput(input: string): Map {
    return input.trim().split("\n").map((line) => line.trim().split("").map((num) => +num));
}

const DIRECTIONS = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
] as [number, number][];

export function analyzeTrailheads(map: Map): Trailheads {
    function findPeaks(x: number, y: number): Peaks {
        const peaks = [] as Peaks;
        
        const from = map[y][x];

        for (const [dirX, dirY] of DIRECTIONS) {
            const nextX = x + dirX;
            const nextY = y + dirY;

            if (nextY < 0 || nextY >= map.length || nextX < 0 || nextX >= map[nextY].length) continue;

            const to = map[nextY][nextX];

            if (to - from !== 1) continue;

            if (to === 9) peaks.push(`${nextX},${nextY}`);
            else peaks.push(...findPeaks(nextX, nextY));
        }

        return peaks;
    }

    const trailheads = {} as Trailheads;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] !== 0) continue;

            const key = `${x},${y}`;

            trailheads[key] = findPeaks(x, y);
        }
    }

    return trailheads;
}

export function countPeaks(trailheads: Trailheads, unique: boolean): number {
    let count = 0;

    if (unique) {
        for (const trailhead in trailheads) count += new Set(trailheads[trailhead]).size;
    } else {
        for (const trailhead in trailheads) count += trailheads[trailhead].length;
    }

    return count;
}

if (import.meta.main) {
    const map = parseInput(await Deno.readTextFile("./days/inputs/10.txt"));

    const trailheads = analyzeTrailheads(map);

    console.log("Answer 1:", countPeaks(trailheads, true));
    console.log("Answer 2:", countPeaks(trailheads, false));
}
