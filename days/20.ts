export class Vector {
    static readonly NORTH: Readonly<Vector> = new Vector(0, -1);
    static readonly SOUTH: Readonly<Vector> = new Vector(0, 1);
    static readonly WEST: Readonly<Vector> = new Vector(-1, 0);
    static readonly EAST: Readonly<Vector> = new Vector(1, 0);
    static readonly ZERO: Readonly<Vector> = new Vector(0, 0);

    static readonly CARDINAL: ReadonlyArray<Readonly<Vector>> = [Vector.NORTH, Vector.SOUTH, Vector.EAST, Vector.WEST];

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static *distanceAway(distance: number): Generator<Vector> {
        for (let offset = 0; offset < distance; offset++) {
            const compliment = distance - offset;

            yield new Vector(offset, compliment);
            yield new Vector(compliment, -offset);
            yield new Vector(-offset, -compliment);
            yield new Vector(-compliment, offset);
        }
    }

    equals(other: Vector): boolean {
        return this.x === other.x && this.y === other.y;
    }

    opposite(): Vector {
        return new Vector(-this.x, -this.y);
    }
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromString(input: string): Position {
        return new Position(...input.split(",").map((num) => +num) as [number, number]);
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }

    equals(other: Position): boolean {
        return this.x === other.x && this.y === other.y;
    }

    shifted(vector: Vector): Position {
        return new Position(this.x + vector.x, this.y + vector.y);
    }
}

export class Cheat {
    startPosition: Position;
    endPosition: Position;

    timeSaved: number;

    constructor(position: Position, endPosition: Position, timeSaved: number) {
        this.startPosition = position;
        this.endPosition = endPosition;

        this.timeSaved = timeSaved;
    }

    static fromString(input: string): Cheat {
        const [startPosition, endPosition, timeSaved] = input.split(":");

        return new Cheat(
            Position.fromString(startPosition),
            Position.fromString(endPosition),
            +timeSaved,
        );
    }

    toString(): string {
        return `${this.startPosition.x},${this.startPosition.y}:${this.endPosition.x},${this.endPosition.y}:${this.timeSaved}`;
    }
}

export class RaceTrack {
    static readonly EMPTY = "."
    static readonly WALL = "#"
    static readonly START = "S"
    static readonly END = "E"

    map: string[][];

    constructor(map: string[][]) {
        this.map = map;
    }

    static fromInput(input: string): RaceTrack {
        return new RaceTrack(input.trim().split("\n").map((line) => line.trim().split("")));
    }

    getPath(): [Position, Vector][] {
        const start = this._findStart();
        const path: [Position, Vector][] = [[start, Vector.ZERO]];

        outer: while (true) {
            const [pos, fromVec] = path.at(-1)!;

            if (this.map[pos.y][pos.x] === RaceTrack.END) return path;
            
            const backwards = fromVec.opposite();
            
            for (const vector of Vector.CARDINAL) {
                if (vector.equals(backwards)) continue;

                const moved = pos.shifted(vector);

                if (moved.y < 0 || moved.y >= this.map.length || moved.x < 0 || moved.x >= this.map[moved.y].length) continue;
                if (this.map[moved.y][moved.x] === RaceTrack.WALL) continue;

                path.push([moved, vector]);
                continue outer;
            }

            return [];
        }
    }

    findCheats(maxPicoseconds: number): Cheat[] {
        const cheats = [];

        const originalPath = this.getPath();

        for (let cheatDur = 2; cheatDur <= maxPicoseconds; cheatDur++) {
            const vectorOffsets = [...Vector.distanceAway(cheatDur)];

            for (let i = 0; i < originalPath.length - 1; i++) {
                const pos = originalPath[i][0];

                for (const vector of vectorOffsets) {
                    const moved = pos.shifted(vector);

                    if (moved.y < 0 || moved.y >= this.map.length || moved.x < 0 || moved.x >= this.map[moved.y].length) continue;
                    if (this.map[moved.y][moved.x] === RaceTrack.WALL) continue;

                    const cheatEnd = originalPath.findIndex(([pos]) => pos.equals(moved));
                    const timeSaved = cheatEnd - i - cheatDur;

                    cheats.push(new Cheat(pos, moved, timeSaved));
                }
            }
        }

        return cheats;
    }

    _findStart(): Readonly<Position> {
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] === RaceTrack.START) return new Position(x, y);
            }
        }

        return new Position(-1, -1);
    }
}

export function cheatsAtLeast(cheats: Cheat[], target: number): number {
    return cheats.filter((cheat) => cheat.timeSaved >= target).length;
}

if (import.meta.main) {
    const raceTrack = RaceTrack.fromInput(await Deno.readTextFile("./days/inputs/20.txt"));
    
    console.log("Answer 1:", cheatsAtLeast(raceTrack.findCheats(2), 100));
    console.log("Answer 2:", cheatsAtLeast(raceTrack.findCheats(20), 100));
}
