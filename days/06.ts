export type Map = string[][];
export type Position = [number, number];
export type Path = Position[];

export const START_DIR = [0, -1] as [number, number];
export const START = "^";
export const EMPTY = ".";
export const WALL = "#";

export function parseInput(input: string): Map {
    return input.trim().split("\n").map((line) => line.trim().split(""));
}

export function findStart(map: Map): Position {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === START) return [x, y];
        }
    }

    return [-1, -1];
}

export function getPath(map: Map): [Path, boolean] {
    let dir = START_DIR;
    let [x, y] = findStart(map);
    
    const path = [[x, y]] as Path;
    const walls = {} as { [pos: string]: [number, number] };
    let looping = false;

    while (true) {
        const [nextX, nextY] = [x + dir[0], y + dir[1]];

        if (nextY < 0 || nextY >= map.length || nextX < 0 || nextX >= map[nextY].length) break;

        if (map[nextY][nextX] === WALL) {
            const key = `${nextX},${nextY}`;

            if (key in walls && walls[key][0] === dir[0] && walls[key][1] === dir[1]) {
                looping = true;
                break;
            } else walls[key] = dir;

            if (dir[0] === 0 && dir[1] === -1) dir = [1, 0];
            else if (dir[0] === 1 && dir[1] === 0) dir = [0, 1];
            else if (dir[0] === 0 && dir[1] === 1) dir = [-1, 0];
            else if (dir[0] === -1 && dir[1] === 0) dir = [0, -1];
        } else {
            x = nextX;
            y = nextY;
            
            path.push([x, y]);
        }
    }

    return [path, looping];
}

export function removePathDuplicates(path: Path): Path {
    const unique = new Set(path.map((pos) => pos.join(",")))
    return Array.from(unique).map((pos) => pos.split(",").map((num) => +num)) as Path;
}

export function countUniquePathPositions(path: Path): number {
    return removePathDuplicates(path).length;
}

export function findLoops(map: Map) {
    let count = 0;

    const path = removePathDuplicates(getPath(map)[0]);

    for (const [x, y] of path) {
        if (map[y][x] !== EMPTY) continue;

        map[y][x] = WALL;

        if (getPath(map)[1]) count++;

        map[y][x] = EMPTY;
    }

    return count;
}

if (import.meta.main) {
    const map = parseInput(await Deno.readTextFile("./days/inputs/06.txt"));

    const path = getPath(map)[0];

    console.log("Answer 1:", countUniquePathPositions(path));
    console.log("Answer 2:", findLoops(map));
}
