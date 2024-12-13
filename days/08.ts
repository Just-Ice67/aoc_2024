export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromString(from: string): Position {
        const [x, y] = from.split(",").map((num) => +num);

        return new Position(x, y);
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }

    equals(other: Position) {
        return this.x === other.x && this.y === other.y;
    }

    add(other: Position): Position {
        return new Position(this.x + other.x, this.y + other.y);
    }

    sub(other: Position): Position {
        return new Position(this.x - other.x, this.y - other.y);
    }

    scale(scale: number): Position {
        return new Position(this.x * scale, this.y * scale);
    }
}

export class FrequencyMap {
    frequencies: Map<string, Position[]>;

    constructor(...frequencies: [string, Position[]][]) {
        this.frequencies = new Map(frequencies);
    }

    uniquePositions(): Position[] {
        const unique = this.frequencies.values().reduce(
            (set, positions) => {
                return set.union(new Set(positions.map(
                    (pos) => pos.toString()
                )));
            }, new Set<string>()
        );

        return Array.from(unique).map((pos) => Position.fromString(pos));
    }
}

export class RoofMap {
    static readonly EMPTY = ".";

    map: string[][];

    constructor(...map: string[][]) {
        this.map = map;
    }

    static fromInput(input: string): RoofMap {
        return new RoofMap(...input.trim().split("\n").map((line) => line.trim().split("")));
    }

    antennas(): FrequencyMap {
        const antennaMap = new FrequencyMap();

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                const frequency = this.map[y][x];
    
                if (frequency === RoofMap.EMPTY) continue;
    
                if (antennaMap.frequencies.has(frequency)) {
                    antennaMap.frequencies.get(frequency)!.push(new Position(x, y));
                } else {
                    antennaMap.frequencies.set(frequency, [new Position(x, y)]);
                }
            }
        }
    
        return antennaMap;
    }

    antinodes(resonantHarmonics: boolean): FrequencyMap {
        const antinodeMap = new FrequencyMap();

        const antennaMap = this.antennas();

        for (const [frequency, positions] of antennaMap.frequencies.entries()) {
            for (const pos1 of positions) {
                for (const pos2 of positions) {
                    if (pos1.equals(pos2)) continue;
    
                    if (resonantHarmonics) {
                        const slope = pos2.sub(pos1);
    
                        let currPos = pos1.add(slope);
    
                        while(
                            currPos.y >= 0 && currPos.y < this.map.length && 
                            currPos.x >= 0 && currPos.x < this.map[currPos.y].length
                        ) {
                            if (antinodeMap.frequencies.has(frequency)) {
                                antinodeMap.frequencies.get(frequency)!.push(currPos);
                            } else {
                                antinodeMap.frequencies.set(frequency, [currPos]);
                            }
    
                            currPos = currPos.add(slope);
                        }
                    }
                    else {
                        const slope = pos2.sub(pos1).scale(2);
                        
                        const pos = pos1.add(slope);
                        
                        if (
                            pos.y < 0 || pos.y >= this.map.length ||
                            pos.x < 0 || pos.x >= this.map[pos.y].length
                        ) continue;
                        
                        if (antinodeMap.frequencies.has(frequency)) {
                            antinodeMap.frequencies.get(frequency)!.push(pos);
                        } else {
                            antinodeMap.frequencies.set(frequency, [pos]);
                        }
                    }
                }
            }
        }
    
        return antinodeMap;
    }
}

if (import.meta.main) {
    const map = RoofMap.fromInput(await Deno.readTextFile("./days/inputs/08.txt"));

    console.log("Answer 1:", map.antinodes(false).uniquePositions().length);
    console.log("Answer 2:", map.antinodes(true).uniquePositions().length);
}
