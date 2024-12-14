export class Trailhead {
    peaks: string[];

    constructor(peaks?: string[]) {
        this.peaks = peaks === undefined ? [] : peaks;
    }

    uniquePeaks(): Set<string> {
        return new Set(this.peaks);
    }
}

const DIRECTIONS = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
] as [number, number][];

export class TopographicalMap {
    constructor(map?: number[][]) {
        this._map = [];
        this._trailheads = []

        if (map !== undefined) this.setMap(map);
    }

    static fromInput(input: string): TopographicalMap {
        return new TopographicalMap(input.trim().split("\n").map((line) => line.trim().split("").map((num) => +num)));
    }

    setMap(map: number[][]) {
        this._map = map;
        this._trailheads = [];
        this._analyzeMap();
    }

    peaks(): number {
        return this._trailheads.reduce((acc, trailhead) => acc + trailhead.peaks.length, 0);
    }

    uniquePeaks(): number {
        return this._trailheads.reduce((acc, trailhead) => acc + trailhead.uniquePeaks().size, 0);
    }

    private _analyzeMap() {
        const findPeaks = (x: number, y: number): string[] => {
            const peaks = [];
            
            const from = this._map[y][x];
    
            for (const [dirX, dirY] of DIRECTIONS) {
                const nextX = x + dirX;
                const nextY = y + dirY;
    
                if (nextY < 0 || nextY >= this._map.length || nextX < 0 || nextX >= this._map[nextY].length) continue;
    
                const to = this._map[nextY][nextX];
    
                if (to - from !== 1) continue;
    
                if (to === 9) peaks.push(`${nextX},${nextY}`);
                else peaks.push(...findPeaks(nextX, nextY));
            }
    
            return peaks;
        }
    
    
        for (let y = 0; y < this._map.length; y++) {
            for (let x = 0; x < this._map[y].length; x++) {
                if (this._map[y][x] !== 0) continue;

                this._trailheads.push(new Trailhead(findPeaks(x, y)));
            }
        }
    }

    private _map: number[][];
    private _trailheads: Trailhead[];
}

if (import.meta.main) {
    const map = TopographicalMap.fromInput(await Deno.readTextFile("./days/inputs/10.txt"));

    console.log("Answer 1:", map.uniquePeaks());
    console.log("Answer 2:", map.peaks());
}
