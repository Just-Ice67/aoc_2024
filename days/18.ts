export class MemorySpace {
    static readonly EMPTY = ".";
    static readonly CORRUPTED = "#";

    constructor(corruptedBytes: [number, number][]) {
        this._corruptedBytes = corruptedBytes;

        this._mapSize = Math.max(...this._corruptedBytes.flat()) + 1;
    }

    static fromInput(input: string): MemorySpace {
        return new MemorySpace(input.trim().split("\n").map((line) => line.trim().split(",").map((num) => +num) as [number, number]));
    }

    shortestPath(bytesFallen: number): number {
        const map = this._makeMap(bytesFallen);

        const end = this._mapSize - 1;

        const explored: boolean[][] = map.map((row) => Array(row.length).fill(false));
        
        explored[0][0] = true;

        const queue: [number, number, number][] = [[0, 0, 0]];

        while (queue.length > 0) {
            const [x, y, steps] = queue.shift()!;

            if (x === end && y === end) return steps;

            for (const [moveX, moveY] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
                const movedX = x + moveX;
                const movedY = y + moveY;

                if (movedX < 0 || movedX >= this._mapSize || movedY < 0 || movedY >= this._mapSize) continue;
                if (map[movedY][movedX] === MemorySpace.CORRUPTED || explored[movedY][movedX]) continue;

                explored[movedY][movedX] = true;

                queue.push([movedX, movedY, steps + 1]);
            }
        }

        return -1;
    }

    lastByte(): [number, number] {
        for (let i = 0; i < this._corruptedBytes.length; i++) {
            if (this.shortestPath(i + 1) === -1) return this._corruptedBytes[i];
        }

        return [-1, -1];
    }

    private _corruptedBytes: [number, number][];
    private _mapSize: number;

    private _makeMap(bytesFallen: number): string[][] {
        const map = Array(this._mapSize).fill(undefined).map(() => Array(this._mapSize).fill(MemorySpace.EMPTY));

        for (let i = 0; i < bytesFallen && i < this._corruptedBytes.length; i++) {
            map[this._corruptedBytes[i][0]][this._corruptedBytes[i][1]] = MemorySpace.CORRUPTED;
        }

        return map;
    }
}

if (import.meta.main) {
    const memorySpace = MemorySpace.fromInput(await Deno.readTextFile("./days/inputs/18.txt"));

    console.log("Answer 1:", memorySpace.shortestPath(1024));
    console.log("Answer 2:", memorySpace.lastByte().join(","));
}
