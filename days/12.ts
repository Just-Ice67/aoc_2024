export const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]] as [number, number][];

export const REGION_EMPTY = ".";
export const REGION_MARKER = "X";

export class Region {
    plots: string[][]
    
    constructor(...plots: string[][]) {
        this.plots = plots;
    }

    addPlot(x: number, y: number) {
        if (y < 0 || x < 0) return;

        while (y >= this.plots.length) this.plots.push([]);
        
        while (x >= this.plots[y].length) this.plots[y].push(REGION_EMPTY);
        
        this.plots[y][x] = REGION_MARKER;
    }

    area(): number {
        return this.plots.reduce((area, row) => area + row.filter((plot) => plot === REGION_MARKER).length, 0);
    }

    perimeter(): number {
        let perimeter = 0;

        for (let y = 0; y < this.plots.length; y++) {
            for (let x = 0; x < this.plots[y].length; x++) {
                if (this.plots[y][x] !== REGION_MARKER) continue;

                perimeter += 4;

                for (const [dirX, dirY] of DIRECTIONS) {
                    const nextX = x + dirX;
                    const nextY = y + dirY;

                    if (nextY < 0 || nextY >= this.plots.length || nextX < 0 || nextX >= this.plots[nextY].length) continue;

                    if (this.plots[nextY][nextX] === REGION_MARKER) perimeter--;
                }
            }
        }

        return perimeter;
    }

    sides(): number {
        /*
        The idea of this algorithm is to go through each row of the region and count the number of top/bottom sides,
        then go through each column and count the number of left/right sides. A side is only counted once by keeping
        track of if the last value in the row or column had a top/bottom or left/right side(s).
        */
        let sides = 0;

        // Keep track of the maximum x value for iterating over the columns later
        let maxX = 0;
        
        // Count top/bottom sides
        let lastTopSide = false;
        let lastBottomSide = false;

        for (let y = 0; y < this.plots.length; y++) {
            for (let x = 0; x < this.plots[y].length; x++) {
                if (x > maxX) maxX = x;

                if (this.plots[y][x] === REGION_EMPTY) {
                    lastTopSide = false;
                    lastBottomSide = false;

                    continue;
                }

                const topSide = y === 0 ? true : x >= this.plots[y - 1].length ? true : this.plots[y - 1][x] === REGION_EMPTY;

                if (!lastTopSide && topSide) sides++;
                lastTopSide = topSide;

                const bottomSide = y === this.plots.length - 1 ? true : x >= this.plots[y + 1].length ? true : this.plots[y + 1][x] === REGION_EMPTY;

                if (!lastBottomSide && bottomSide) sides++;
                lastBottomSide = bottomSide;
            }

            lastTopSide = false;
            lastBottomSide = false;
        }

        // Count left/right sides
        let lastLeftSide = false;
        let lastRightSide = false;

        for (let x = 0; x <= maxX; x++) {
            for (let y = 0; y < this.plots.length; y++) {
                if (x >= this.plots[y].length || this.plots[y][x] === REGION_EMPTY) {
                    lastLeftSide = false;
                    lastRightSide = false;

                    continue;
                }

                const leftSide = x === 0 ? true : this.plots[y][x - 1] === REGION_EMPTY;

                if (!lastLeftSide && leftSide) sides++;
                lastLeftSide = leftSide;

                const rightSide = x === this.plots[y].length - 1 ? true : this.plots[y][x + 1] === REGION_EMPTY;

                if (!lastRightSide && rightSide) sides++;
                lastRightSide = rightSide;
            }
            
            lastLeftSide = false;
            lastRightSide = false;
        }

        return sides;
    }
}

export class Garden {
    regions: Region[]
    
    constructor(...plots: string[][]) {
        this.regions = Garden._getRegions(plots);
    }

    static fromInput(input: string): Garden {
        return new Garden(...input.trim().split("\n").map((line) => line.trim().split("")));
    }

    fencingCost(bulk = false): number {
        return this.regions.reduce(
            (cost, region) => {
                if (bulk) return cost + (region.area() * region.sides());
                else return cost + (region.area() * region.perimeter());
            }, 0
        );
    }

    private static _getRegions(plots: string[][]): Region[] {
        const visited: Set<string> = new Set();

        const scanRegion = (x: number, y: number): Region => {
            const region = new Region();

            const scanPlot = (x: number, y: number) => {
                region.addPlot(x, y);

                for (const [dirX, dirY] of DIRECTIONS) {
                    const nextX = x + dirX;
                    const nextY = y + dirY;
    
                    if (nextY < 0 || nextY >= plots.length || nextX < 0 || nextX >= plots[nextY].length) continue;
                    if (plots[nextY][nextX] !== plots[y][x]) continue;

                    const nextKey = `${nextX},${nextY}`;

                    if (visited.has(nextKey)) continue;
                    visited.add(nextKey);
    
                    scanPlot(nextX, nextY);
                }
            }

            scanPlot(x, y);

            return region;
        }

        const regions = [];

        for (let y = 0; y < plots.length; y++) {
            for (let x = 0; x < plots[y].length; x++) {
                const key = `${x},${y}`;

                if (visited.has(key)) continue;
                visited.add(key);

                regions.push(scanRegion(x, y));
            }
        }

        return regions;
    }
}

if (import.meta.main) {
    const garden = Garden.fromInput(await Deno.readTextFile("./days/inputs/12.txt"));

    console.log("Answer 1:", garden.fencingCost());
    console.log("Answer 1:", garden.fencingCost(true));
}
